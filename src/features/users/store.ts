import { API_ENDPOINTS } from '@/stores/api-end-points';
import { defineEntityStore } from '@/stores/entity-store';
import type { User } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/store-definition';

type ExtendUser = {};

export type ExtendedUser = CreateExtendedEntity<User, ExtendUser>;

export const useUserStore = defineEntityStore<User, ExtendUser>(
  'userStore',
  {},
  {
    apiUrl: API_ENDPOINTS.users,
  }
);
