<script setup lang="ts">
import LoadingPage from '@/pages/LoadingPage.vue';
import { ref } from 'vue';

const isLoading = ref(true);
</script>

<template>
  <div class="h-screen bg-hlod bg-no-repeat bg-cover flex justify-center">
    <main class="flex justify-center" :class="isLoading ? 'items-end mb-10' : 'items-center'">
      <loading-page v-if="isLoading" @all-loaded="isLoading = false" />
      <router-view v-else />
    </main>
  </div>
</template>
