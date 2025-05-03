<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { onMounted, reactive, ref } from 'vue';
import type { User } from '@/types/EntityTypes';

const isProcessing = ref(false);

const userStore = useUserStore();

const form = reactive({
    username: '',
    password: '',
    email: '',
    role: ''
});

async function saveUser(userData: User) {
    isProcessing.value = true;
    try {
        await userStore.saveEntity(userData);
        console.log('Ukladam', userData);
    } catch (error) {
        console.log(error);
    } finally {
        isProcessing.value = false;
    }
}

async function handleDelete(userId: string) {
    try {
        await userStore.deleteEntity(userId);
    } catch (e) {
        console.log(e);
    }
}

onMounted(async () => {
    await userStore.fetchEntities();
});
</script>

<template>
    <h1>USER sexy</h1>

    <div>
        <FloatLabel variant="in">
            <InputText id="in_label" v-model="form.username" variant="filled" />
            <label for="in_label">Username</label>
        </FloatLabel>
        <FloatLabel variant="in">
            <InputText id="in_label" v-model="form.password_hash" variant="filled" />
            <label for="in_label">Heslo</label>
        </FloatLabel>
        <FloatLabel variant="in">
            <InputText id="in_label" v-model="form.email" variant="filled" />
            <label for="in_label">Email</label>
        </FloatLabel>

        <Button label="Uložit" @click="saveUser(form)" :loading="isProcessing" />
        <div class="flex flex-col gap-2">
            <ul v-for="user in userStore.entities" :key="user.id">
                <li class="grid grid-cols-3">
                    <span>{{ user.username }}</span>
                    <span>{{ user.email }}</span>
                    <Button
                        size="small"
                        rounded
                        icon="pi pi-trash"
                        severity="danger"
                        @click="handleDelete(user.id)"
                    />
                </li>
            </ul>
        </div>
    </div>
</template>
