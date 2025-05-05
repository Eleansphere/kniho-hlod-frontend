<script setup lang="ts">
import { usePreferredDialog } from '@/components/DialogHelper.vue';
import { useUserStore } from '@/stores/entities/userStore';
import { User } from '@/types/EntityTypes';
import type { TableColumnDefinition } from '@/components/table/types';
import { computed, onMounted, ref } from 'vue';
import GenericForm from '../form/GenericForm.vue';
import { userFormSchema } from '@/schemas/UserFormSchema';

const tableColumns: Array<TableColumnDefinition> = [
    { field: 'username', header: 'Přihlašovací jméno' },
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Role' }
];

const store = useUserStore();
const availableUsers = computed<Array<User>>(() => {
    return store.entities;
});

const dialog = usePreferredDialog();

const currentUser = ref<User>(new User());
const isSubmitting = ref(false);

function openUserDialog(userData: User) {
    dialog.open(
        GenericForm,
        {
            definition: userFormSchema,
            modelValue: userData,
            mode: userData ? 'view' : 'create',
            submitting: isSubmitting.value,
            'onUpdate:modelValue': (val) => (currentUser.value = val),
            onSubmit: handleSubmit
        },
        {
            modal: true,
            draggable: false,
            header: userData ? `Detail uživatele: ${userData.username}` : 'Nový uživatel',
            style: {
                width: '40%'
            }
        }
    );
}

async function handleSubmit(userData: User) {
    Object.assign(currentUser, userData);

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

    <Table :columns="tableColumns" :items="availableUsers" :handle-detail="openUserDialog" />
</template>
