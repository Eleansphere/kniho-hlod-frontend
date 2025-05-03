<script setup lang="ts">
import { usePreferredDialog } from '@/components/DialogHelper.vue';
import { Loan } from '@/types/EntityTypes';
import type { TableColumnDefinition } from '@/types/tableTypes';
import { computed, onMounted, ref } from 'vue';
import GenericForm from '../form/GenericForm.vue';
import { useLoanStore } from '@/stores/entities/loanStore';
import { loanFormSchema } from '@/schemas/LoanFormSchema';

const props = defineProps<{
    userId: string;
}>();

const tableColumns: Array<TableColumnDefinition> = [
    { field: 'book_id', header: 'Kniha' },
    { field: 'borrower', header: 'Vypůjčil si' },
    { field: 'loan_date', header: 'Datum vypůjčení' },
    { field: 'return_date', header: 'Datum vrácení' }
];

const store = useLoanStore();
const availableLoans = computed<Array<Loan>>(() => {
    return store.entities;
});

const dialog = usePreferredDialog();

const currentLoan = ref<Loan>(new Loan());
const isSubmitting = ref(false);

function openLoanDialog(loanData: Loan) {
    dialog.open(
        GenericForm,
        {
            definition: loanFormSchema,
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
    loanToSave.owner_id = props.userId;

    try {
        await store.saveEntity(loanToSave);

        console.log(loanToSave);

        dialog.close();
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    store.fetchEntities();
});
</script>

<template>
    <h1 class="font-bold">Výpujčky</h1>

    <Table :columns="tableColumns" :items="availableLoans" :handle-detail="openLoanDialog" />
</template>
