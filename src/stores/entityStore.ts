import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getEntityClass } from './entityClassRegistry';
import { authorizationStore } from './authorizationStore';
import type {
    BaseEntity,
    CreateExtendedEntity,
    EntityExtension,
    EntityStoreConfig
} from '@/types/storeDefinition';

export function defineEntityStore<TEntity extends BaseEntity, TExtend = {}>(
    storeName: string,
    extensions: { [K in keyof TExtend]: EntityExtension<TEntity, TExtend[K]> } = {} as any,
    config?: EntityStoreConfig
) {
    return defineStore(storeName, () => {
        const rawEntitiesMap = ref(new Map<string, TEntity>());
        const error = ref<string | null>(null);
        const isLoading = ref(false);

        const apiUrl = config?.apiUrl || `/api/${config?.pluralName || storeName.toLowerCase()}`;

        function extendEntity(entity: TEntity): CreateExtendedEntity<TEntity, TExtend> {
            const extended = { ...entity } as CreateExtendedEntity<TEntity, TExtend>;
            for (const [key, extendFn] of Object.entries(extensions)) {
                try {
                    (extended as any)[key] = (extendFn as any)(entity);
                } catch (err) {
                    console.error(`Error extending entity ${entity.id} with ${key}:`, err);
                }
            }
            return extended;
        }

        const transformEntity = (data: any): TEntity => {
            const ClassRef = getEntityClass<TEntity>(storeName);
            if (ClassRef) {
                const instance = new ClassRef();
                for (const key in data) {
                    const value = data[key];
                    (instance as any)[key] =
                        value && typeof value === 'string' && key.endsWith('_date')
                            ? new Date(value)
                            : value;
                }
                return instance;
            }
            return data;
        };

        const entities = computed<Array<CreateExtendedEntity<TEntity, TExtend>>>(() => {
            return Array.from(rawEntitiesMap.value.values()).map((entity) =>
                extendEntity(entity as TEntity)
            );
        });

        const getToken = () => authorizationStore().getToken();
        const getHeaders = () => ({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
            ...(config?.headers || {})
        });

        async function fetchEntities() {
            error.value = null;
            isLoading.value = true;
            try {
                const response = await fetch(apiUrl, { headers: getHeaders() });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data: TEntity[] = (await response.json()).map(transformEntity);
                rawEntitiesMap.value = new Map(data.map((e) => [e.id, e]));
            } catch (err) {
                error.value = (err as Error).message;
            } finally {
                isLoading.value = false;
            }
        }

        async function getEntity(
            id: string
        ): Promise<CreateExtendedEntity<TEntity, TExtend> | null> {
            error.value = null;
            isLoading.value = true;
            try {
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: 'GET',
                    headers: getHeaders()
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const entity: TEntity = transformEntity(await response.json());
                rawEntitiesMap.value.set(entity.id, entity);
                return extendEntity(entity);
            } catch (err) {
                error.value = (err as Error).message;
                return null;
            } finally {
                isLoading.value = false;
            }
        }

        function getRawEntity(id: string): TEntity | null {
            return rawEntitiesMap.value.get(id) ?? null;
        }

        async function saveEntity(
            entityData: TEntity
        ): Promise<CreateExtendedEntity<TEntity, TExtend> | undefined> {
            error.value = null;
            isLoading.value = true;
            try {
                const method = entityData.id ? 'PUT' : 'POST';
                const url = entityData.id ? `${apiUrl}/${entityData.id}` : apiUrl;

                const response = await fetch(url, {
                    method,
                    headers: getHeaders(),
                    body: JSON.stringify(entityData)
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const savedEntity: TEntity = transformEntity(await response.json());
                rawEntitiesMap.value.set(savedEntity.id, savedEntity);
                return extendEntity(savedEntity);
            } catch (err) {
                error.value = (err as Error).message;
                return undefined;
            } finally {
                isLoading.value = false;
            }
        }

        async function deleteEntity(id: string) {
            error.value = null;
            isLoading.value = true;
            try {
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE',
                    headers: getHeaders()
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                rawEntitiesMap.value.delete(id);
                return true;
            } catch (err) {
                error.value = (err as Error).message;
                return false;
            } finally {
                isLoading.value = false;
            }
        }

        return {
            entities,
            error,
            isLoading,
            fetchEntities,
            getEntity,
            getRawEntity,
            saveEntity,
            deleteEntity,
            getOrFetchEntity: async (id: string) => {
                const cached = rawEntitiesMap.value.get(id);
                return cached ? extendEntity(cached) : await getEntity(id);
            },
            refreshEntity: async (id: string) => await getEntity(id)
        };
    });
}
