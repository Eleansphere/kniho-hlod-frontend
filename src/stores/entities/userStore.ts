import { API_ENDPOINTS } from '@/stores/apiEndPoints';
import { defineEntityStore } from '@/stores/entityStore';
import type { User } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/storeDefinition';

type ExtendUser = {};

export type ExtendedUser = CreateExtendedEntity<User, ExtendUser>;

export const useUserStore = defineEntityStore<User, ExtendUser>(
  'userStore',
  {},
  {
    apiUrl: API_ENDPOINTS.users,
  }
);
