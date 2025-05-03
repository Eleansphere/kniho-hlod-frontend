<script setup lang="ts">
import { usePreferredDialog } from '@/components/DialogHelper.vue';
import { useBookStore } from '@/stores/entities/bookStore';
import { Book } from '@/types/EntityTypes';
import type { TableColumnDefinition } from '@/types/tableTypes';
import { computed, onMounted, ref } from 'vue';
import GenericForm from '../form/GenericForm.vue';
import { bookFormSchema } from '../../schemas/BookFormSchema';

const props = defineProps<{
    userId: string;
}>();

const tableColumns: Array<TableColumnDefinition> = [
    { field: 'author', header: 'Autor' },
    { field: 'title', header: 'Název knihy' },
    { field: 'genre', header: 'Žánr', formatter: formatGenre },
    { field: 'isAvailable', header: 'Dostupná', formatter: (val) => (val ? 'Ano' : 'Ne') }
];

function formatGenre(value) {
    const option = bookFormSchema.fields
        .find((f) => f.name === 'genre')
        ?.options?.find((o) => o.value === value);
    return option?.label || value;
}

const store = useBookStore();
const availableBooks = computed<Array<Book>>(() => {
    return store.entities.filter((book) => book.owner_id === props.userId);
});

const dialog = usePreferredDialog();

const currentBook = ref<Book>(new Book());
const isSubmitting = ref(false);

function openBookDialog(bookData: Book) {
    dialog.open(
        GenericForm,
        {
            definition: bookFormSchema,
            modelValue: bookData,
            mode: bookData ? 'view' : 'create',
            submitting: isSubmitting.value,
            'onUpdate:modelValue': (val) => (currentBook.value = val),
            onSubmit: handleSubmit
        },
        {
            modal: true,
            header: bookData ? `Detail knihy: ${bookData.title} ` : 'Nová kniha',
            style: { width: '500px' }
        }
    );
}

async function handleSubmit(bookData: Book) {
    try {
        isSubmitting.value = true;

        const bookToSave = { ...bookData };
        bookToSave.owner_id = props.userId;

        await store.saveEntity(bookToSave);

        dialog.close();
    } catch (error) {
        console.error('Chyba při ukládání knihy:', error);
    } finally {
        isSubmitting.value = false;
    }
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

        <Table :columns="tableColumns" :items="availableBooks" :handle-detail="openBookDialog" />
    </div>
</template>
