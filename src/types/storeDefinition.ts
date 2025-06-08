// Base entity interface
export interface BaseEntity {
  id: string;
}

// Type to create extended entities with additional properties
export type CreateExtendedEntity<TEntity, TExtend = {}> = TEntity & TExtend;

// Type for extension function that resolves related entities
export type EntityExtension<TEntity, TResult> = (entity: TEntity) => TResult;

export interface EntityStoreConfig {
  apiUrl?: string;
  pluralName?: string;
  headers?: Record<string, string>;
}
