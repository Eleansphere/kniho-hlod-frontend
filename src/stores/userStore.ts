import { createEntityStore } from '@/stores/entityStore';
import type { User } from '@/types/EntityTypes';
import {API_ENDPOINTS} from "@/stores/apiEndPoints";

export const useUserStore = createEntityStore<User>('userStore', API_ENDPOINTS.users);
