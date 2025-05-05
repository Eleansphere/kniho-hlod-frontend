import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authorizationStore } from './authorizationStore';
import type {
    BaseEntity,
    CreateExtendedEntity,
    EntityExtension,
    EntityStoreConfig
} from '@/types/storeDefinition';

// Function to define an entity store with extensions
export function defineEntityStore<TEntity extends BaseEntity, TExtend = {}>(
    storeName: string,
    extensions: { [K in keyof TExtend]: EntityExtension<TEntity, TExtend[K]> } = {} as any,
    config?: EntityStoreConfig
) {
    return defineStore(storeName, () => {
        const rawEntitiesMap = ref(new Map<string, TEntity>());
        const error = ref<string | null>(null);
        const isLoading = ref(false);

        // Určení API URL na základě konfigurace nebo výchozího formátu
        const apiUrl = config?.apiUrl || `/api/${config?.pluralName || storeName.toLowerCase()}`;

        // Aplikuje rozšíření na entitu
        function extendEntity(entity: TEntity): CreateExtendedEntity<TEntity, TExtend> {
            const extended = { ...entity } as CreateExtendedEntity<TEntity, TExtend>;

            // Aplikace každé rozšiřující funkce na entitu
            for (const [key, extendFn] of Object.entries(extensions)) {
                try {
                    (extended as any)[key] = (extendFn as any)(entity);
                } catch (err) {
                    console.error(`Error extending entity ${entity.id} with ${key}:`, err);
                }
            }

            return extended;
        }

        // Computed property vracející všechny entity už jako rozšířené
        const entities = computed<Array<CreateExtendedEntity<TEntity, TExtend>>>(() => {
            return Array.from(rawEntitiesMap.value.values()).map((entity) => extendEntity(entity));
        });

        // Get a fresh token when needed
        const getToken = () => authorizationStore().getToken();

        // Získání hlaviček pro API požadavky
        const getHeaders = () => {
            const defaultHeaders: Record<string, string> = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            };

            return {
                ...defaultHeaders,
                ...(config?.headers || {})
            };
        };

        // Fetch all entities
        async function fetchEntities() {
            error.value = null;
            isLoading.value = true;

            try {
                const response = await fetch(apiUrl, {
                    headers: getHeaders()
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data: TEntity[] = await response.json();
                rawEntitiesMap.value = new Map(data.map((entity) => [entity.id, entity]));
            } catch (err) {
                error.value = (err as Error).message;
            } finally {
                isLoading.value = false;
            }
        }

        // Get a single entity by ID
        async function getEntity(
            entityId: string
        ): Promise<CreateExtendedEntity<TEntity, TExtend> | null> {
            error.value = null;
            isLoading.value = true;

            try {
                const response = await fetch(`${apiUrl}/${entityId}`, {
                    method: 'GET',
                    headers: getHeaders()
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const entity: TEntity = await response.json();
                rawEntitiesMap.value.set(entity.id, entity);
                return extendEntity(entity);
            } catch (err) {
                error.value = (err as Error).message;
                return null;
            } finally {
                isLoading.value = false;
            }
        }

        // Get raw entity without extensions
        function getRawEntity(entityId: string): TEntity | null {
            return rawEntitiesMap.value.get(entityId);
        }

        // Create or update an entity
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

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const savedEntity: TEntity = await response.json();
                rawEntitiesMap.value.set(savedEntity.id, savedEntity);
                return extendEntity(savedEntity);
            } catch (err) {
                error.value = (err as Error).message;
                return undefined;
            } finally {
                isLoading.value = false;
            }
        }

        // Delete an entity
        async function deleteEntity(entityId: string) {
            error.value = null;
            isLoading.value = true;

            try {
                const response = await fetch(`${apiUrl}/${entityId}`, {
                    method: 'DELETE',
                    headers: getHeaders()
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                rawEntitiesMap.value.delete(entityId);
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
            // Helper to get or fetch an entity
            getOrFetchEntity: async (
                id: string
            ): Promise<CreateExtendedEntity<TEntity, TExtend> | null> => {
                const cachedEntity = rawEntitiesMap.value.get(id);
                if (cachedEntity) return extendEntity(cachedEntity);
                return await getEntity(id);
            },
            // Refresh a single entity from API
            refreshEntity: async (
                id: string
            ): Promise<CreateExtendedEntity<TEntity, TExtend> | null> => {
                return await getEntity(id);
            }
        };
    });
}
