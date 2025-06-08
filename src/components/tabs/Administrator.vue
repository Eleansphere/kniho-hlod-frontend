<script setup lang="ts">
import { usePreferredDialog } from '@/components/DialogHelper.vue';
import { userForm } from '@/components/form/definitions/user';
import type { TableColumnDefinition } from '@/components/table/types';
import { useUserStore } from '@/stores/entities/userStore';
import { User } from '@/types/entities';
import { computed, onMounted, ref } from 'vue';
import GenericForm from '../form/GenericForm.vue';

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

function openDialog(data: User):void {
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
  <h1 class="font-bold">Administartor</h1>
  <Table :columns="columns" :items="availableUsers" :handle-detail="openDialog" />
</template>
