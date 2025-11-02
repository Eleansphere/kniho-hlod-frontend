<script setup lang="ts">
import { usePreferredDialog } from '@/components/DialogHelper.vue';
import { loanForm } from '@/components/tabs/loans/loans-form-definition';
import { authorizationStore } from '@/stores/authorization-store';
import { useBookStore } from '@/stores/entities/book-store';
import { getActiveLoans, useLoanStore, type ExtendedLoan } from '@/stores/entities/loan-store';
import { Loan } from '@/types/entities';
import { computed, ref } from 'vue';
import GenericForm from '@/components/form/GenericForm.vue';
import type { FormDefinition } from '../../form/types';
import { useNotification } from '@/composables/use-notification';
import { useDeleteConfirmation } from '@/composables/use-delete-confirmation';
import { getTabsDefinition, TABLE_DEFINITION } from './loans-table-definitions';

const props = defineProps<{
  userId: string;
}>();

const store = useLoanStore();
const { loggedUser } = authorizationStore();

const activeLoans = computed<Array<ExtendedLoan>>(() => {
  return getActiveLoans(loggedUser!.id);
});

const archivedLoans = computed<Array<ExtendedLoan>>(() => {
  return store.entities.filter((loan) => loan.ownerId === loggedUser?.id && loan.isReturned);
});

const dialog = usePreferredDialog();

const currentLoan = ref<Loan>(new Loan());
const isSubmitting = ref(false);

const { showSaveSuccess, showSaveError } = useNotification();
const bookStore = useBookStore();

const availableBooks = computed(() => {
  return bookStore.entities
    .filter(
      (book) =>
        book.ownerId === props.userId && !store.entities.some((loan) => loan.bookId === book.id)
    )
    .map((book) => ({
      label: book.title,
      value: book.id,
    }));
});

// const availableBooks = computed(() => {
//   return bookStore.entities
//     .filter((book) => book.ownerId === loggedUser?.id)
//     .map((book) => ({
//       label: book.title,
//       value: book.id,
//     }));
// });

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
      `Pro knihu "${loan.bookEntity!.title}" vypůjčenou dne: ${new Intl.DateTimeFormat(
        'cs-CZ'
      ).format(new Date(loan.loanDate))}`,
  }
);

function markAsReturned(loan: ExtendedLoan): void {
  if (!loan) return;
  handleSubmit({ ...loan, isReturned: true });
}
</script>

<template>
  <h1 class="font-bold">Výpujčky</h1>

  <Tabs value="0">
    <TabList>
      <Tab
        v-for="tab in getTabsDefinition(activeLoans, archivedLoans)"
        :key="tab.title"
        :value="tab.value"
      >
        <div class="flex gap-2 items-center">
          <i :class="tab.icon" :key="tab.icon"></i>
          <p>
            {{ tab.title }}
          </p>
        </div>
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel
        v-for="tab in getTabsDefinition(activeLoans, archivedLoans)"
        :key="tab.title"
        :value="tab.value"
      >
        <Table
          :columns="TABLE_DEFINITION"
          :items="tab.content"
          :handle-detail="openDialog"
          :handle-delete="deleteWithConfirmation"
          :display-detail-only="tab.value === '1'"
        >
          <template #action-column="{ row }">
            <Button
              v-if="!row.isReturned"
              @click="markAsReturned(row)"
              icon="pi pi-check"
              size="small"
              outlined
            />
          </template>
        </Table>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>
