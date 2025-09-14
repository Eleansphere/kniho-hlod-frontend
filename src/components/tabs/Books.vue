<script setup lang="ts">
import { usePreferredDialog } from '@/components/DialogHelper.vue';
import type { TableColumnDefinition } from '@/components/table/types';
import { useBookStore, type ExtendedBook } from '@/stores/entities/bookStore';
import { Book } from '@/types/entities';
import { computed, onMounted, ref } from 'vue';
import GenericForm from '../form/GenericForm.vue';
import { bookForm } from '../form/definitions/book';
import { useNotification } from '@/composables/useNotification';
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation';

const props = defineProps<{
  userId: string;
}>();

const columns: Array<TableColumnDefinition> = [
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

// function formatGenre(value) {
//     const option = bookFormSchema.fields
//         .find((f) => f.name === 'genre')
//         ?.options?.find((o) => o.value === value);
//     return option?.label || value;
// }

const store = useBookStore();
const availableBooks = computed<Array<ExtendedBook>>(() => {
  return store.entities.filter((book) => book.ownerId === props.userId);
});

const dialog = usePreferredDialog();

const currentBook = ref<Book>(new Book());
const isSubmitting = ref(false);
const { showSaveSuccess, showSaveError } = useNotification();

function openDialog(data: Book): void {
  dialog.open(
    GenericForm,
    {
      definition: bookForm,
      modelValue: data,
      mode: data ? 'view' : 'create',
      submitting: isSubmitting.value,
      'onUpdate:modelValue': (val) => (currentBook.value = val),
      onSubmit: handleSubmit,
    },
    {
      modal: true,
      header: data ? `Detail knihy: ${data.title} ` : 'Nová kniha',
      style: { width: '500px' },
    }
  );
}

async function handleSubmit(data: Book): Promise<void> {
  try {
    isSubmitting.value = true;

    const bookToSave = { ...data, ownerId: props.userId };
    console.log('Ukládám knihu:', bookToSave);
    await store.saveEntity(bookToSave);

    showSaveSuccess('Úspěch', 'Kniha byla úspěšně uložena.');
    dialog.close();
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

    <Table
      :columns="columns"
      :items="availableBooks"
      :handle-detail="openDialog"
      :handle-delete="deleteWithConfirmation"
    />
  </div>
</template>
