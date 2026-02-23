<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ExtendedLoan } from '@/features/loans/store'
import { MS_PER_DAY } from '@/features/loans/constants'
import { LOAN_STATUS_SEVERITY } from '@/shared/utils/constants/severity'
import { formatDate } from '@/shared/utils/date'

const props = defineProps<{
  loan: ExtendedLoan
}>()

const emit = defineEmits<{
  detail: [loan: ExtendedLoan]
  delete: [loan: ExtendedLoan]
  markReturned: [loan: ExtendedLoan]
}>()

const { t } = useI18n()

const isOverdue = computed(() => {
  if (props.loan.isReturned || !props.loan.returnDate) return false
  return new Date(props.loan.returnDate) < new Date()
})

const overdueDays = computed(() => {
  if (!props.loan.returnDate) return 0
  return Math.floor((Date.now() - new Date(props.loan.returnDate).getTime()) / MS_PER_DAY)
})

const statusLabel = computed(() => {
  if (props.loan.isReturned) return t('status.returned')
  if (isOverdue.value) return t('status.overdue', { days: overdueDays.value })
  return t('status.active')
})

const cardClass = computed(() => {
  if (isOverdue.value) return 'border-red-200 bg-red-50/30'
  return 'border-surface-100 bg-surface-0'
})
</script>

<template>
  <div
    class="rounded-xl shadow-sm border p-4 flex flex-col gap-3 transition-shadow hover:shadow-md"
    :class="cardClass"
  >
    <!-- Header row -->
    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-9 h-9 shrink-0 bg-surface-100 rounded-lg flex items-center justify-center">
          <i class="pi pi-book text-surface-500 text-sm"></i>
        </div>
        <div class="min-w-0">
          <p class="font-bold text-surface-800 truncate leading-tight">
            {{ loan.bookEntity?.title ?? '—' }}
          </p>
          <p class="text-surface-500 text-xs truncate">{{ loan.bookEntity?.author }}</p>
        </div>
      </div>
      <Tag
        :value="statusLabel"
        :severity="isOverdue ? LOAN_STATUS_SEVERITY.overdue : loan.isReturned ? LOAN_STATUS_SEVERITY.returned : LOAN_STATUS_SEVERITY.active"
        class="shrink-0"
      >
        <template #default>
          <span class="flex items-center gap-1">
            <i v-if="isOverdue" class="pi pi-exclamation-triangle text-xs"></i>
            {{ statusLabel }}
          </span>
        </template>
      </Tag>
    </div>

    <!-- Borrower -->
    <div class="flex items-center gap-2 text-sm">
      <i class="pi pi-user text-surface-400 text-xs"></i>
      <span class="text-surface-600">{{ loan.borrower }}</span>
    </div>

    <!-- Dates -->
    <div class="grid grid-cols-2 gap-2 text-xs">
      <div class="bg-surface-50 rounded-lg px-3 py-2">
        <p class="text-surface-400 mb-0.5">{{ t('loans.loanDate') }}</p>
        <p class="font-medium text-surface-700">
          {{ formatDate(String(loan.loanDate)) }}
        </p>
      </div>
      <div
        class="rounded-lg px-3 py-2"
        :class="isOverdue ? 'bg-red-50' : 'bg-surface-50'"
      >
        <p class="text-surface-400 mb-0.5">{{ t('loans.returnDate') }}</p>
        <p class="font-medium" :class="isOverdue ? 'text-red-600' : 'text-surface-700'">
          {{ loan.returnDate ? formatDate(String(loan.returnDate)) : t('loans.noDate') }}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 pt-1 border-t border-surface-100" @click.stop>
      <Button
        icon="pi pi-search"
        size="small"
        outlined
        severity="secondary"
        class="flex-1"
        @click="emit('detail', loan)"
      />
      <Button
        v-if="!loan.isReturned"
        icon="pi pi-check"
        size="small"
        severity="success"
        class="flex-1"
        :title="t('loans.markReturned')"
        @click="emit('markReturned', loan)"
      />
      <Button
        icon="pi pi-trash"
        size="small"
        outlined
        severity="danger"
        class="flex-1"
        @click="emit('delete', loan)"
      />
    </div>
  </div>
</template>
