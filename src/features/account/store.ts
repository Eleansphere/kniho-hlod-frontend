import { API_ENDPOINTS } from '@/stores/api-end-points';
import { defineEntityStore } from '@/stores/entity-store';
import type { ProfileImage } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/store-definition';

type ExtendFile = {};

export type ExtendedFile = CreateExtendedEntity<ProfileImage, ExtendFile>;

export const useFileStore = defineEntityStore<ProfileImage, ExtendFile>(
  'profileImageStore',
  {},
  { apiUrl: API_ENDPOINTS.files }
);
