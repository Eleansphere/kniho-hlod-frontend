<script setup lang="ts">
import { userForm } from '@/components/form/definitions/user';
import type { TableColumnDefinition } from '@/components/table/types';
import { useUserStore } from '@/stores/entities/user-store';
import { User } from '@/types/entities';
import { computed, onMounted, ref } from 'vue';
import GenericForm from '../form/GenericForm.vue';
import { useNotification } from '@/composables/use-notification';
import { useDeleteConfirmation } from '@/composables/use-delete-confirmation';
import { usePreferredDialog } from '@/composables/use-preferred-dialog';

const columns: Array<TableColumnDefinition> = [
  {
    field: 'username',
    header: 'Přihlašovací jméno',
    type: 'text',
  },
  { field: 'email', header: 'Email', type: 'text' },
  { field: 'role', header: 'Role', type: 'text' },
];

const store = useUserStore();
const availableUsers = computed<Array<User>>(() => {
  return store.entities;
});

const dialog = usePreferredDialog();

const currentUser = ref<User>(new User());
const isSubmitting = ref(false);
const { showSaveSuccess, showSaveError } = useNotification();

function openDialog(data: User): void {
  dialog.open(
    GenericForm,
    {
      definition: userForm,
      modelValue: data,
      mode: data ? 'view' : 'create',
      submitting: isSubmitting.value,
      'onUpdate:modelValue': (val) => (currentUser.value = val),
      onSubmit: handleSubmit,
    },
    {
      modal: true,
      draggable: false,
      header: data ? `Detail uživatele: ${data.username}` : 'Nový uživatel',
      style: {
        width: '40%',
      },
    }
  );
}

async function handleSubmit(data: User): Promise<void> {
  Object.assign(currentUser, data);

  try {
    await store.saveEntity(currentUser.value);
    showSaveSuccess(
      'Uživatel úspěšně uložen',
      `Uživatel ${currentUser.value.username} byl úspěšně uložen.`
    );
    dialog.close();
  } catch (error) {
    showSaveError(
      'Chyba při ukládání uživatele',
      `Uživatel ${currentUser.value.username} se nepodařilo uložit.`
    );
    console.error(error);
  }
}

const { deleteWithConfirmation } = useDeleteConfirmation(
  async (user: User) => {
    try {
      if (!user) return;
      await store.deleteEntity(user.id);
    } catch (error) {
      console.error(error);
    }
  },
  {
    confirmMessage: 'Smazat uživatele?',
    successMessage: 'Uživatel byl úspěšně smazán.',
    errorMessage: 'Chyba při mazání uživatele.',
    notes: (user) => `"${user.username}" s rolí "${user.role}" a emailem: "${user.email}"`,
  }
);

onMounted(() => {
  store.fetchEntities();
});
</script>

<template>
  <h1 class="font-bold">Administrátor</h1>
  <Table
    :columns="columns"
    :items="availableUsers"
    :handle-detail="openDialog"
    :handle-delete="deleteWithConfirmation"
  />
</template>
