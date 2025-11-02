<script setup lang="ts">
import { useBookStore, type ExtendedBook } from '@/stores/entities/book-store';
import { Book } from '@/types/entities';
import { computed, onMounted, ref } from 'vue';
import { bookForm } from '../books/books-form-definition';
import { useNotification } from '@/composables/use-notification';
import { useDeleteConfirmation } from '@/composables/use-delete-confirmation';
import { useLoanStore } from '@/stores/entities/loan-store';
import { getTabsDefinition, TABLE_DEFINITION } from './books-table-definition';
import { useFormDialog } from '@/composables/use-form-dialog';

const props = defineProps<{
  userId: string;
}>();

const store = useBookStore();
const loanStore = useLoanStore();

const availableBooks = computed<Array<ExtendedBook>>(() => {
  return store.entities.filter(
    (book) =>
      book.ownerId === props.userId && !loanStore.entities.some((loan) => loan.bookId === book.id)
  );
});

const borrowedBooks = computed<Array<ExtendedBook>>(() => {
  return store.entities.filter((book) => {
    return (
      loanStore.entities.some((loan) => loan.bookId === book.id) && book.ownerId === props.userId
    );
  });
});

const isSubmitting = ref(false);
const { showSaveSuccess, showSaveError } = useNotification();

const { openFormDialog } = useFormDialog();

function openDialog(data: Book): void {
  openFormDialog({
    definition: bookForm,
    modelValue: data ?? { ...new Book() },
    onSave: async (content) => {
      await handleSubmit(content);
    },
    mode: data ? 'view' : 'create',
    submitting: isSubmitting.value,
    header: data ? `Detail knihy: ${data.title} ` : 'Nová kniha',
  });
}

async function handleSubmit(data: Book): Promise<void> {
  try {
    isSubmitting.value = true;

    const bookToSave = { ...data, ownerId: props.userId };
    console.log('Ukládám knihu:', bookToSave);
    await store.saveEntity(bookToSave);

    showSaveSuccess('Úspěch', 'Kniha byla úspěšně uložena.');
  } catch (error) {
    showSaveError('Chyba', 'Knihu se nepodařilo uložit.');
    console.error('Chyba při ukládání knihy:', error);
  } finally {
    isSubmitting.value = false;
  }
}

const { deleteWithConfirmation } = useDeleteConfirmation(
  async (book: Book) => {
    try {
      if (!book) return;
      await store.deleteEntity(book.id);
    } catch (error) {
      console.error(error);
    }
  },
  {
    confirmMessage: 'Smazat knihu?',
    successMessage: 'Kniha byla úspěšně smazána.',
    errorMessage: 'Chyba při mazání knihy.',
    notes: (book) => `Od autora "${book.author}" s názvem: "${book.title}"`,
  }
);

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
            :handle-delete="deleteWithConfirmation"
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
