<script setup lang="ts">
import { useBookStore, type ExtendedBook } from '@/stores/entities/book-store';
import { Book } from '@/types/entities';
import { computed, onMounted, ref } from 'vue';
import { bookForm } from '../books/books-form-definition';
import { useLoanStore } from '@/stores/entities/loan-store';
import { useFormDialog } from '@/composables/use-form-dialog';
import { useConfirmDialog } from '@/composables/use-confirm-dialog';
import { authorizationStore } from '@/stores/authorization-store';
import BookCard from '@/components/books/BookCard.vue';
import BookDetailDialog from '@/components/books/BookDetailDialog.vue';
import { usePreferredDialog } from '@/composables/use-preferred-dialog';

const store = useBookStore();
const loanStore = useLoanStore();
const { loggedUser } = authorizationStore();

const searchQuery = ref('');
const activeFilter = ref<'all' | 'available' | 'lent'>('all');

const allBooks = computed<Array<ExtendedBook>>(() => {
  return store.entities.filter((book) => book.ownerId === loggedUser?.id);
});

const filteredBooks = computed<Array<ExtendedBook>>(() => {
  let books = allBooks.value;

  if (activeFilter.value === 'available') {
    books = books.filter(
      (b) => !loanStore.entities.some((l) => l.bookId === b.id && !l.isReturned)
    );
  } else if (activeFilter.value === 'lent') {
    books = books.filter((b) => loanStore.entities.some((l) => l.bookId === b.id && !l.isReturned));
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    books = books.filter(
      (b) => b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q)
    );
  }

  return books;
});

const { openFormDialog } = useFormDialog();
const dialog = usePreferredDialog();

function openEditDialog(data?: Book): void {
  openFormDialog({
    definition: bookForm,
    modelValue: data ?? { ...new Book() },
    onSave: async (content) => {
      await store.saveEntity({ ...content, ownerId: loggedUser!.id });
    },
    mode: data ? 'view' : 'create',
    header: data ? `Upravit: ${(data as Book).title}` : 'Nová kniha',
  });
}

function openDetail(book: ExtendedBook): void {
  dialog.open(
    BookDetailDialog,
    { book },
    {
      modal: true,
      header: `Detail: ${book.title}`,
      dialogSize: 'form',
    }
  );
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

const filterOptions = [
  { label: 'Vše', value: 'all' },
  { label: 'Dostupné', value: 'available' },
  { label: 'Půjčené', value: 'lent' },
] as const;

onMounted(() => {
  store.fetchEntities();
});
</script>

<template>
  <div class="grid gap-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-surface-800">Knihovna</h1>
      <Button
        label="Nová kniha"
        icon="pi pi-plus"
        size="small"
        class="self-start"
        @click="openEditDialog()"
      />
    </div>

    <!-- Search + Filter -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <i
          class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
        ></i>
        <InputText
          v-model="searchQuery"
          placeholder="Hledej podle názvu nebo autora…"
          class="w-full pl-9"
        />
      </div>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="opt in filterOptions"
          :key="opt.value"
          @click="activeFilter = opt.value"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
          :class="
            activeFilter === opt.value
              ? 'bg-primary-500 text-white border-primary-500'
              : 'bg-surface-0 text-surface-600 border-surface-200 hover:bg-surface-50'
          "
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredBooks.length === 0" class="text-center py-12 text-surface-400">
      <i class="pi pi-book text-4xl mb-3 block text-surface-200"></i>
      <p>Žádné knihy nenalezeny.</p>
    </div>

    <!-- Card grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <BookCard
        v-for="book in filteredBooks"
        :key="book.id"
        :book="book"
        @edit="openDetail"
        @delete="deleteBook"
      />
    </div>
  </div>
</template>
