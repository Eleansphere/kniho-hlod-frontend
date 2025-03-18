<script setup lang="ts">
import AddForm from '@/components/AddForm.vue';
import { usePreferredDialog } from '@/components/DialogHelper.vue';
import { useUserStore } from '@/stores/userStore';
import type { InputDefinition } from '@/types/AddFormTypes';
import { User, type Entity } from '@/types/EntityTypes';
import type { TableColumnDefinition } from '@/types/tableTypes';
import { computed, onMounted, reactive } from 'vue';

const tableColumns: Array<TableColumnDefinition> = [
    { field: 'username', header: 'Přihlašovací jméno' },
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Role' }
];

const cachedUsers = computed<Array<User>>(() => {
    return useUserStore().entities;
});

const userInputsDefinition: Array<InputDefinition<User>> = [
    {
        name: 'username',
        label: 'Uživatelské jméno',
        type: 'text',
        required: true
    },
    {
        name: 'password',
        label: 'Heslo',
        type: 'password',
        required: true
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true
    },
    {
        name: 'role',
        label: 'Uživatelská role',
        type: 'select',
        required: true,
        options: [
            {
                label: 'Administrátor',
                value: 'admin'
            },

            {
                label: 'Uživatel',
                value: 'user'
            }
        ]
    }
];

const dialog = usePreferredDialog();

function selectRow(rowData: User) {
    dialog.open(
        AddForm,
        {
            fields: userInputsDefinition,
            modelValue: rowData || new User(),
            detailOnly: rowData ? true : false,
            onSubmit: onSubmitForm
        },
        {
            modal: true,
            draggable: false,
            header: rowData ? 'Detail' : 'Nový uživatel',
            style: {
                width: '40%'
            }
        }
    );
}

const userForm = reactive<User>(new User());

async function onSubmitForm(newData: Entity) {
    Object.assign(userForm, newData);

    try {
        await useUserStore().saveEntity(userForm);
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    useUserStore().fetchEntities();
});
</script>

<template>
    <h1 class="font-bold">Administartor</h1>

    <Table :columns="tableColumns" :items="cachedUsers" :handleDetail="selectRow">
        <template #actions="{ data }">
            <Button icon="pi pi-search" @click="selectRow(data)" severity="secondary" rounded />
        </template>
    </Table>
</template>
