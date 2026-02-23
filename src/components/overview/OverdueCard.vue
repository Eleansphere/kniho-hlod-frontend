<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ExtendedLoan } from '@/stores/entities/loan-store'

defineProps<{
  loan: ExtendedLoan
}>()

const { t } = useI18n()

function overdueDays(returnDate: Date | string): number {
  return Math.floor((Date.now() - new Date(returnDate).getTime()) / 86_400_000)
}
</script>

<template>
  <div class="text-sm mb-1">
    <span class="font-semibold">{{ loan.bookEntity?.title }}</span>
    &bull; {{ loan.borrower }} &bull;
    {{ new Date(loan.returnDate!).toLocaleDateString() }}
    <Tag
      :value="t('overview.overdueDays', { days: overdueDays(loan.returnDate!) })"
      severity="danger"
      class="ml-1 !text-xs"
    />
  </div>
</template>
