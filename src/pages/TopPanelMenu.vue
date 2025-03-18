<script setup lang="ts">
import { authorizationStore } from '@/stores/authorizationStore';

const { actualUsername, logOut } = authorizationStore();
</script>

<template>
    <Menubar class="bg-green-400">
        <template #start>
            <span class="flex justify-evenly items-center gap-1 px-2 py-2">
                <img src="../assets/logo.svg" alt="main-logo" width="35" height="40" />
                <span class="text-xl font-semibold">
                    KNIHO-<span class="text-primary">HLOD</span>
                </span>
            </span>
        </template>
        <template #end>
            <div class="flex items-center gap-4">
                <Avatar
                    image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                    shape="circle"
                />
                <span>{{ actualUsername }}</span>
                <Button @click="logOut" icon="pi pi-sign-out" rounded />
            </div>
        </template>
    </Menubar>
</template>
