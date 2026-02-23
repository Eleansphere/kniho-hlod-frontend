<script setup lang="ts">
import LoadingPage from '@/pages/LoadingPage.vue';
import { ref } from 'vue';

const isLoading = ref(true);
</script>

<template>
  <div v-if="isLoading" class="min-h-screen bg-hlod bg-no-repeat bg-cover flex justify-center items-end pb-10">
    <loading-page @all-loaded="isLoading = false" />
  </div>
  <router-view v-else />
</template>
