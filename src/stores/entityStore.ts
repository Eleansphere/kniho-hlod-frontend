import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authorizationStore } from './authorizationStore';

export function createEntityStore<T extends { id: string }>(storeName: string, apiUrl: string) {
    return defineStore(storeName, () => {
        const entitiesMap = ref(new Map<string, T>());
        const error = ref<string | null>(null);
        const token = authorizationStore().getToken();

        const entities = computed(() => Array.from(entitiesMap.value.values()));

        async function fetchEntities() {
            error.value = null;
            try {
                const response = await fetch(apiUrl);
                const data: T[] = await response.json();
                entitiesMap.value = new Map(data.map((entity) => [entity.id, entity]));
            } catch (err) {
                error.value = (err as Error).message;
            }
        }

        async function getEntity(entityId: string) {
            error.value = null;
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entityId)
                });

                const newEntity: T = await response.json();
                if (newEntity) {
                    entitiesMap.value.get(newEntity.id);
                }
            } catch (err) {
                error.value = (err as Error).message;
            }
        }

        async function saveEntity(entityData: T) {
            error.value = null;
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(entityData)
                });
                const newEntity: T = await response.json();
                if (newEntity.id) {
                    entitiesMap.value.set(newEntity.id, newEntity);
                }
            } catch (err) {
                error.value = (err as Error).message;
            }
        }

        async function deleteEntity(entityId: string) {
            error.value = null;
            try {
                await fetch(`${apiUrl}/${entityId}`, {
                    method: 'DELETE'
                });
                entitiesMap.value.delete(entityId);
            } catch (err) {
                error.value = (err as Error).message;
            }
        }

        return {
            entities,
            error,
            fetchEntities,
            getEntity,
            saveEntity,
            deleteEntity
        };
    });
}
