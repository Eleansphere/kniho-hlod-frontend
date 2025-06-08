<script setup lang="ts">
import TopPanelMenu from '@/pages/TopPanelMenu.vue';
</script>

<template>
  <div class="w-full h-screen bg-hlod bg-no-repeat bg-cover bg-blue-100">
    <top-panel-menu />
    <main class="px-2 mt-4">
      <router-view />
    </main>
  </div>
</template>
