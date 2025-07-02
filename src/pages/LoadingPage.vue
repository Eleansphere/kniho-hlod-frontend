<script setup lang="ts">
import ProgressBar from 'primevue/progressbar';
import { ref, onMounted } from 'vue';

const progress = ref(0);

onMounted(() => {
  // Simuluj načítání, progres se bude zvyšovat na 100 za 3 vteřiny
  const interval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 2;
    } else {
      clearInterval(interval);
      // emituj event, když je loading hotový
      emit('all-loaded');
    }
  }, 60);
});

const emit = defineEmits<{
  'all-loaded': void;
}>();
</script>

<template>
  <div
    class="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300"
  >
    <h2 class="mb-6 text-2xl font-semibold text-blue-900">Načítání aplikace...</h2>
    <ProgressBar :value="progress" class="w-72" />
  </div>
</template>

<style scoped>
/* Přidáme jemný stín pod ProgressBar */
.p-progressbar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}
</style>
