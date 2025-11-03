<script setup lang="ts">
import { userForm } from '@/components/form/definitions/user';
import type { TableColumnDefinition } from '@/components/table/types';
import { useUserStore } from '@/stores/entities/user-store';
import { User } from '@/types/entities';
import { computed, onMounted, ref } from 'vue';
import { useFormDialog } from '@/composables/use-form-dialog';
import { useConfirmDialog } from '@/composables/use-confirm-dialog';

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

const { openFormDialog } = useFormDialog();

function openDialog(data: User): void {
  openFormDialog({
    definition: userForm,
    modelValue: data,
    onSave: async (content) => {
      await store.saveEntity(content);
    },
    mode: data ? 'view' : 'create',
    header: data ? `Detail uživatele: ${data.username}` : 'Nový uživatel',
  });
}

const { confirmDelete } = useConfirmDialog();

function deleteUser(data: User) {
  confirmDelete({
    text: 'Smazat uživatele?',
    handleConfirmCallback: async () => {
      await store.deleteEntity(data.id);
    },
  });
}

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
    :handle-delete="deleteUser"
  />
</template>
