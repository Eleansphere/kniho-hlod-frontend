import { API_ENDPOINTS } from '@/stores/api-end-points';
import { defineEntityStore } from '@/stores/entity-store';
import type { ProfileImage } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/store-definition';

type ExtendProfileImage = {};

export type ExtendedBook = CreateExtendedEntity<ProfileImage, ExtendProfileImage>;

export const useBookStore = defineEntityStore<ProfileImage, ExtendProfileImage>(
  'profileImageStore',
  {},
  { apiUrl: API_ENDPOINTS.profileImages }
);
