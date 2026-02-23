<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 gap-4">
    <i class="pi pi-bell text-5xl text-surface-300"></i>
    <p class="text-surface-500 text-lg font-medium">{{ t('notifications.title') }}</p>
    <p class="text-surface-400 text-sm">{{ t('notifications.comingSoon') }}</p>
  </div>
</template>
