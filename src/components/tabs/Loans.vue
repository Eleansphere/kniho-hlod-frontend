<script setup lang="ts">
import { usePreferredDialog } from '@/components/DialogHelper.vue';
import { loanForm } from '@/components/form/definitions/loan';
import type { TableColumnDefinition } from '@/components/table/types';
import { authorizationStore } from '@/stores/authorizationStore';
import { useBookStore } from '@/stores/entities/bookStore';
import { useLoanStore, type ExtendedLoan } from '@/stores/entities/loanStore';
import { Loan } from '@/types/entities';
import { computed, ref } from 'vue';
import GenericForm from '../form/GenericForm.vue';
import type { FormDefinition } from '../form/types';
import { useNotification } from '@/composables/useNotification';
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation';

const props = defineProps<{
  userId: string;
}>();

const columns: Array<TableColumnDefinition> = [
  { field: ['bookEntity', 'title'], header: 'Kniha', type: 'text' },
  { field: 'borrower', header: 'Vypůjčil si', type: 'text' },
  { field: 'loanDate', header: 'Datum vypůjčení', type: 'date' },
  { field: 'returnDate', header: 'Datum vrácení', type: 'date' },
];

const store = useLoanStore();
const { loggedUser } = authorizationStore();

const availableLoans = computed<Array<ExtendedLoan>>(() => {
  return store.entities.filter((loan) => loan.ownerId === loggedUser?.id);
});

const dialog = usePreferredDialog();

const currentLoan = ref<Loan>(new Loan());
const isSubmitting = ref(false);

const { showSaveSuccess, showSaveError } = useNotification();
const bookStore = useBookStore();

const availableBooks = computed(() => {
  return bookStore.entities
    .filter((book) => book.ownerId === loggedUser?.id)
    .map((book) => ({
      label: book.title,
      value: book.id,
    }));
});

const editedLoanForm = computed<FormDefinition<Loan>>(() => ({
  ...loanForm,
  fields: [
    {
      name: 'bookId',
      label: 'Kniha',
      type: 'select',
      required: true,
      placeholder: 'Vyber knihu',
      options: availableBooks.value,
    },
    ...loanForm.fields,
  ],
}));

function openDialog(data: Loan): void {
  dialog.open(
    GenericForm,
    {
      definition: editedLoanForm.value,
      modelValue: data,
      mode: data ? 'view' : 'create',
      submitting: isSubmitting.value,
      'onUpdate:modelValue': (val) => (currentLoan.value = val),
      onSubmit: handleSubmit,
    },
    {
      modal: true,
      draggable: false,
      header: data ? `Detail výpujčky: ${data.id}` : 'Nová výpujčka',
      style: {
        width: '40%',
      },
    }
  );
}

async function handleSubmit(data: Loan): Promise<void> {
  const loanToSave = { ...data, ownerId: props.userId };

  try {
    await store.saveEntity(loanToSave);

    console.log(loanToSave);
    showSaveSuccess('Úspěch', 'Výpujčka byla úspěšně uložena.');
    dialog.close();
  } catch (error) {
    showSaveError('Chyba', 'Při ukládání výpujčky došlo k chybě.');
    console.error(error);
  }
}

const { deleteWithConfirmation } = useDeleteConfirmation(
  async (loan: ExtendedLoan) => {
    try {
      if (!loan) return;
      await store.deleteEntity(loan.id);
    } catch (error) {
      console.error(error);
    }
  },
  {
    confirmMessage: 'Smazat výpujčku?',
    successMessage: 'Výpujčka byla úspěšně smazána.',
    errorMessage: 'Chyba při mazání výpujčky.',
    notes: (loan) =>
      `Pro knihu "${loan.bookEntity!.title}" vypůjčenou dne: ${new Intl.DateTimeFormat('cs-CZ').format(new Date(loan.loanDate))}`,
  }
);
</script>

<template>
  <h1 class="font-bold">Výpujčky</h1>

  <Table
    :columns="columns"
    :items="availableLoans"
    :handle-detail="openDialog"
    :handle-delete="deleteWithConfirmation"
  />
</template>
