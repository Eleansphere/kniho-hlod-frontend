<script setup lang="ts">
import { loanForm } from '@/components/tabs/loans/loans-form-definition';
import { authorizationStore } from '@/stores/authorization-store';
import { useBookStore } from '@/stores/entities/book-store';
import { getActiveLoans, useLoanStore, type ExtendedLoan } from '@/stores/entities/loan-store';
import { Loan } from '@/types/entities';
import { computed, ref } from 'vue';
import type { FormDefinition } from '../../form/types';
import { getTabsDefinition, TABLE_DEFINITION } from './loans-table-definitions';
import { useFormDialog } from '@/composables/use-form-dialog';
import { useConfirmDialog } from '@/composables/use-confirm-dialog';

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

const { openFormDialog } = useFormDialog();

function openDialog(data: Loan): void {
  openFormDialog({
    definition: editedLoanForm.value,
    modelValue: data,
    onSave: async (content) => {
      await store.saveEntity({ ...content, ownerId: loggedUser!.id });
    },
    mode: data ? 'view' : 'create',
    header: data ? `Detail výpujčky: ${data.id}` : 'Nová výpujčka',
  });
}

const { confirmDelete } = useConfirmDialog();

function deleteLoan(loan: ExtendedLoan) {
  confirmDelete({
    text: 'Smazat výpujčku?',
    handleConfirmCallback: async () => {
      await store.deleteEntity(loan.id);
    },
  });
}

function markAsReturned(loan: ExtendedLoan): void {
  if (!loan) return;
  store.saveEntity({ ...loan, isReturned: true });
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
          :handle-delete="deleteLoan"
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
