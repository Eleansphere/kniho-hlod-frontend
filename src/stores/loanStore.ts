import { createEntityStore } from '@/stores/entityStore';
import type { Loan } from "../types/EntityTypes"
import {API_ENDPOINTS} from "@/stores/apiEndPoints";

export const useLoanStore = createEntityStore<Loan>('loanStore', API_ENDPOINTS.loans);
