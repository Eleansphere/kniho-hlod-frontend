<script setup lang="ts">
import { useBookStore, type ExtendedBook } from '@/stores/entities/book-store';
import { Book } from '@/types/entities';
import { computed, onMounted } from 'vue';
import { bookForm } from '../books/books-form-definition';
import { useLoanStore } from '@/stores/entities/loan-store';
import { getTabsDefinition, TABLE_DEFINITION } from './books-table-definition';
import { useFormDialog } from '@/composables/use-form-dialog';
import { useConfirmDialog } from '@/composables/use-confirm-dialog';
import { authorizationStore } from '@/stores/authorization-store';

const store = useBookStore();
const loanStore = useLoanStore();
const { loggedUser } = authorizationStore();

const availableBooks = computed<Array<ExtendedBook>>(() => {
  return store.entities.filter(
    (book) =>
      book.ownerId === loggedUser?.id && !loanStore.entities.some((loan) => loan.bookId === book.id)
  );
});

const borrowedBooks = computed<Array<ExtendedBook>>(() => {
  return store.entities.filter((book) => {
    return (
      loanStore.entities.some((loan) => loan.bookId === book.id) && book.ownerId === loggedUser?.id
    );
  });
});

const { openFormDialog } = useFormDialog();

function openDialog(data: Book): void {
  openFormDialog({
    definition: bookForm,
    modelValue: data ?? { ...new Book() },
    onSave: async (content) => {
      await store.saveEntity({ ...content, ownerId: loggedUser!.id });
    },
    mode: data ? 'view' : 'create',
    header: data ? `Detail knihy: ${data.title} ` : 'Nová kniha',
  });
}

const { confirmDelete } = useConfirmDialog();

function deleteBook(data: Book) {
  confirmDelete({
    text: 'Smazat knihu?',
    handleConfirmCallback: async () => {
      await store.deleteEntity(data.id);
    },
  });
}

onMounted(() => {
  store.fetchEntities();
});
</script>

<template>
  <div class="books-container">
    <div class="header-container">
      <h1>Knihovna</h1>
    </div>
    <Tabs value="0">
      <TabList>
        <Tab
          v-for="tab in getTabsDefinition(borrowedBooks, availableBooks)"
          :key="tab.title"
          :value="tab.value"
        >
          <i :class="tab.icon" :key="tab.icon"></i>
          {{ tab.title }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel
          v-for="tab in getTabsDefinition(borrowedBooks, availableBooks)"
          :key="tab.title"
          :value="tab.value"
        >
          <Table
            :columns="TABLE_DEFINITION"
            :items="tab.content"
            :handle-detail="openDialog"
            :handle-delete="deleteBook"
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
