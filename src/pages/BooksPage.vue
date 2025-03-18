<script setup lang="ts">
import { usePreferredDialog } from '@/components/DialogHelper.vue';
import { useBookStore } from '@/stores/bookStore';
import type { InputDefinition } from '@/types/AddFormTypes';
import { Book, type Entity } from '@/types/EntityTypes';
import type { TableColumnDefinition } from '@/types/tableTypes';
import { computed, onMounted, reactive } from 'vue';
import AddForm from '@/components/AddForm.vue';

const props = defineProps<{
    userId: string;
}>();

const tableColumns: Array<TableColumnDefinition> = [
    { field: 'author', header: 'Autor' },
    { field: 'title', header: 'Název knihy' },
    { field: 'role', header: 'Role' }
];

const cachedBooks = computed<Array<Book>>(() => {
    return useBookStore().entities;
});

const userInputsDefinition: Array<InputDefinition<Book>> = [
    {
        name: 'title',
        label: 'Název',
        type: 'text',
        required: true
    },
    {
        name: 'author',
        label: 'Author',
        type: 'text',
        required: true
    }
];

const dialog = usePreferredDialog();

function selectRow(rowData: Book) {
    dialog.open(
        AddForm,
        {
            fields: userInputsDefinition,
            modelValue: rowData || bookForm,
            detailOnly: rowData ? true : false,
            onSubmit: onSubmitForm
        },
        {
            modal: true,
            draggable: false,
            header: rowData ? 'Detail knihy' : 'Nová kniha',
            style: {
                width: '40%'
            }
        }
    );
}

const bookForm = reactive<Book>({
    ...new Book(),
    owner_id: props.userId
});

async function onSubmitForm(newData: Entity) {
    Object.assign(bookForm, newData);
    console.log(newData);
    try {
        await useBookStore().saveEntity(bookForm);
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    useBookStore().fetchEntities();
});
</script>

<template>
    <h1>Knihyyyy pridej</h1>
    <p>Tabulka knih plu pridani knihy a detail knihy s editaci</p>
    <Table :columns="tableColumns" :items="cachedBooks" :handleDetail="selectRow">
        <template #actions="{ data }">
            <Button icon="pi pi-search" @click="selectRow(data)" severity="secondary" rounded />
        </template>
    </Table>
</template>
