const entityClassRegistry = new Map<string, new () => any>();

export function registerEntityClass<TEntity>(key: string, classRef: new () => TEntity): void {
  entityClassRegistry.set(key, classRef);
}

export function getEntityClass<TEntity>(key: string): (new () => TEntity) | undefined {
  return entityClassRegistry.get(key);
}
