<script setup lang="ts">
import { usePreferredDialog } from '@/components/DialogHelper.vue';
import { Loan } from '@/types/EntityTypes';
import type { TableColumnDefinition } from '@/components/table/types';
import { computed, ref } from 'vue';
import GenericForm from '../form/GenericForm.vue';
import type { ExtendedLoan } from '@/stores/entities/loanStore';
import { loanFormSchema } from '@/schemas/LoanFormSchema';
import type { FormDefinition } from '../form/FormTypes';
import { useBookStore } from '@/stores/entities/bookStore';
import { authorizationStore } from '@/stores/authorizationStore';
import { useLoanStore } from '@/stores/entities/loanStore';

const props = defineProps<{
    userId: string;
}>();

const tableColumns: Array<TableColumnDefinition> = [
    { field: ['bookEntity', 'title'], header: 'Kniha', type: 'text' },
    { field: 'borrower', header: 'Vypůjčil si', type: 'text' },
    { field: 'loanDate', header: 'Datum vypůjčení', type: 'date' },
    { field: 'returnDate', header: 'Datum vrácení', type: 'date' }
];

const store = useLoanStore();
const availableLoans = computed<Array<ExtendedLoan>>(() => {
    return store.entities.filter((loan) => loan.ownerId === authorizationStore().loggedUser?.id);
});

const dialog = usePreferredDialog();

const currentLoan = ref<Loan>(new Loan());
const isSubmitting = ref(false);

const availableBooks = computed(() => {
    return useBookStore()
        .entities.filter((book) => book.ownerId === authorizationStore().loggedUser?.id)
        .map((book) => ({
            label: book.title,
            value: book.id
        }));
});

const editedLoanFormSchema: FormDefinition<Loan> = {
    ...loanFormSchema,
    fields: [
        {
            name: 'bookId',
            label: 'Kniha',
            type: 'select',
            required: true,
            placeholder: 'Vyber knihu',
            options: availableBooks.value
        },
        ...loanFormSchema.fields
    ]
};

function openLoanDialog(loanData: Loan) {
    dialog.open(
        GenericForm,
        {
            definition: editedLoanFormSchema,
            modelValue: loanData,
            mode: loanData ? 'view' : 'create',
            submitting: isSubmitting.value,
            'onUpdate:modelValue': (val) => (currentLoan.value = val),
            onSubmit: handleSubmit
        },
        {
            modal: true,
            draggable: false,
            header: loanData ? `Detail výpujčky: ${loanData.id}` : 'Nová výpujčka',
            style: {
                width: '40%'
            }
        }
    );
}

async function handleSubmit(loanData: Loan) {
    const loanToSave = { ...loanData };
    loanToSave.ownerId = props.userId;

    try {
        await store.saveEntity(loanToSave);

        console.log(loanToSave);

        dialog.close();
    } catch (error) {
        console.error(error);
    }
}
</script>

<template>
    <h1 class="font-bold">Výpujčky</h1>

    <Table :columns="tableColumns" :items="availableLoans" :handle-detail="openLoanDialog" />
</template>
