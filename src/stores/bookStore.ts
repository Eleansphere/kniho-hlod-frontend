import {createEntityStore} from "@/stores/entityStore";
import {API_ENDPOINTS} from "@/stores/apiEndPoints";
import type { Book } from "@types/";


export const useBookStore = createEntityStore<Book>('bookStore', API_ENDPOINTS.books);
