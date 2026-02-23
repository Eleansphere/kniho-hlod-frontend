<script setup lang="ts">
const { icon, label } = defineProps<{
  icon: string;
  label: string;
}>();
</script>

<template>
  <div class="flex items-center gap-2">
    <i :class="`pi pi-${icon}`"></i>
    <span>{{ label }}</span>
  </div>
</template>
