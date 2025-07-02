<script setup lang="ts">
import LoadingPage from '@/pages/LoadingPage.vue';
import { ref } from 'vue';

const isLoading = ref(true);
</script>

<template>
  <loading-page v-if="isLoading" @all-loaded="isLoading = false" />
  <div v-else class="h-screen bg-hlod bg-no-repeat bg-cover flex items-center justify-center">
    <main class="flex items-center justify-center">
      <router-view />
    </main>
  </div>
</template>
