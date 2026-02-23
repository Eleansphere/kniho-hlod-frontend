<script setup lang="ts">
import { computed } from 'vue'
import type { ExtendedLoan } from '@/stores/entities/loan-store'

const props = defineProps<{
  loan: ExtendedLoan
}>()

const emit = defineEmits<{
  detail: [loan: ExtendedLoan]
  delete: [loan: ExtendedLoan]
  markReturned: [loan: ExtendedLoan]
}>()

const isOverdue = computed(() => {
  if (props.loan.isReturned || !props.loan.returnDate) return false
  return new Date(props.loan.returnDate) < new Date()
})

const overdueDays = computed(() => {
  if (!props.loan.returnDate) return 0
  return Math.floor((Date.now() - new Date(props.loan.returnDate).getTime()) / 86_400_000)
})

const statusLabel = computed(() => {
  if (props.loan.isReturned) return 'Vráceno'
  if (isOverdue.value) return `Po termínu (${overdueDays.value} dní)`
  return 'Aktivní'
})

const statusClass = computed(() => {
  if (props.loan.isReturned) return 'bg-surface-100 text-surface-500'
  if (isOverdue.value) return 'bg-red-100 text-red-600'
  return 'bg-primary-100 text-primary-600'
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
      <span
        class="shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
        :class="statusClass"
      >
        <i v-if="isOverdue" class="pi pi-exclamation-triangle text-xs"></i>
        {{ statusLabel }}
      </span>
    </div>

    <!-- Borrower -->
    <div class="flex items-center gap-2 text-sm">
      <i class="pi pi-user text-surface-400 text-xs"></i>
      <span class="text-surface-600">{{ loan.borrower }}</span>
    </div>

    <!-- Dates -->
    <div class="grid grid-cols-2 gap-2 text-xs">
      <div class="bg-surface-50 rounded-lg px-3 py-2">
        <p class="text-surface-400 mb-0.5">Zapůjčeno</p>
        <p class="font-medium text-surface-700">
          {{ new Date(loan.loanDate).toLocaleDateString('cs-CZ') }}
        </p>
      </div>
      <div
        class="rounded-lg px-3 py-2"
        :class="isOverdue ? 'bg-red-50' : 'bg-surface-50'"
      >
        <p class="text-surface-400 mb-0.5">Vrátit do</p>
        <p class="font-medium" :class="isOverdue ? 'text-red-600' : 'text-surface-700'">
          {{ loan.returnDate ? new Date(loan.returnDate).toLocaleDateString('cs-CZ') : '—' }}
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
        title="Označit jako vráceno"
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
