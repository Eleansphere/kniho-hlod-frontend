import type { TableColumnDefinition } from '@/components/table/types';
import type { ExtendedBook } from '@/stores/entities/book-store';
import { computed } from 'vue';

export function getTabsDefinition(borrowed: Array<ExtendedBook>, available: Array<ExtendedBook>) {
  const TABS = computed(() => [
    { title: 'Zapůjčené', value: '0', content: borrowed, icon: 'pi pi-bookmark-fill' },
    { title: 'Nezapůjčené', value: '1', content: available, icon: 'pi pi-bookmark' },
  ]);

  return TABS.value;
}

export const TABLE_DEFINITION: Array<TableColumnDefinition> = [
  { field: 'author', header: 'Autor', type: 'text' },
  { field: 'title', header: 'Název knihy', type: 'text' },
  { field: 'description', header: 'Popis', type: 'text' },
  { field: 'publicationYear', header: 'Rok vydání', type: 'number' },
  {
    field: 'isAvailable',
    header: 'Dostupná',
    type: 'boolean',
  },
];
