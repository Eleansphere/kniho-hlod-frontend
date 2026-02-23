<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ExtendedBook } from '@/features/books/store';
import { getLoansForBook } from '@/features/loans/store';
import { MS_PER_DAY } from '@/features/loans/constants';
import { BOOK_AVAILABILITY_SEVERITY } from '@/shared/utils/constants/severity';

const props = defineProps<{
  book: ExtendedBook
}>()

const emit = defineEmits<{
  edit: [book: ExtendedBook]
  delete: [book: ExtendedBook]
}>()

const { t } = useI18n()

const activeLoan = computed(() => {
  const loans = getLoansForBook(props.book.id)
  return loans.find((l) => !l.isReturned) ?? null
})

const isOverdue = computed(() => {
  if (!activeLoan.value?.returnDate) return false
  return new Date(activeLoan.value.returnDate) < new Date()
})

const overdueDays = computed(() => {
  if (!activeLoan.value?.returnDate) return 0
  return Math.floor((Date.now() - new Date(activeLoan.value.returnDate).getTime()) / MS_PER_DAY)
})

const statusLabel = computed(() => {
  if (!activeLoan.value) return t('status.available')
  if (isOverdue.value) return t('status.overdue', { days: overdueDays.value })
  return t('books.loanedTo', { name: activeLoan.value.borrower })
})
</script>

<template>
  <div
    class="bg-surface-0 rounded-xl shadow-sm border border-surface-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer"
    @click="emit('edit', book)"
  >
    <!-- Icon + year -->
    <div class="flex items-start justify-between">
      <div class="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center">
        <i class="pi pi-book text-surface-500"></i>
      </div>
      <span v-if="book.publicationYear" class="text-xs text-surface-400 font-medium">
        {{ book.publicationYear }}
      </span>
    </div>

    <!-- Title & Author -->
    <div class="flex-1">
      <h3 class="font-bold text-surface-800 leading-tight line-clamp-2">{{ book.title }}</h3>
      <p v-if="book.author" class="text-surface-500 text-sm mt-0.5">{{ book.author }}</p>
    </div>

    <!-- Status badge -->
    <Tag
      :value="statusLabel"
      :severity="isOverdue ? BOOK_AVAILABILITY_SEVERITY.overdue : !activeLoan ? BOOK_AVAILABILITY_SEVERITY.available : BOOK_AVAILABILITY_SEVERITY.lent"
      class="self-start"
    >
      <template #default>
        <span class="flex items-center gap-1">
          <i v-if="isOverdue" class="pi pi-exclamation-triangle text-xs"></i>
          {{ statusLabel }}
        </span>
      </template>
    </Tag>

    <!-- Actions -->
    <div class="flex gap-2 pt-1 border-t border-surface-100" @click.stop>
      <Button
        icon="pi pi-pencil"
        size="small"
        outlined
        severity="secondary"
        class="flex-1"
        @click="emit('edit', book)"
      />
      <Button
        icon="pi pi-trash"
        size="small"
        outlined
        severity="danger"
        class="flex-1"
        @click="emit('delete', book)"
      />
    </div>
  </div>
</template>
