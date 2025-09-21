<script setup>
import { overviewStats, lastBorrowedBook, earliestLoanReturn } from './overview-stats-definition';
import { authorizationStore } from '@/stores/authorizationStore';

const { loggedUser } = authorizationStore();
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-1">Vítej červe {{ loggedUser.username }}</h2>
    <p class="text-gray-600 mb-6">Rád tě tu zase vidíme 👋</p>

    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <i class="pi pi-book text-red-600"></i>
        <span class="text-red-600 font-semibold text-lg">Rychlý přehled</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-4">
          <div class="flex items-center gap-2 text-green-700 font-semibold mb-2">
            <i class="pi pi-book"></i>
            Poslední zapůjčená kniha
          </div>
          <p>
            <span class="font-medium">Titul:</span>
            {{ lastBorrowedBook.bookEntity.title }}
          </p>
          <p>
            <span class="font-medium">Zapůjčena:</span>
            {{ lastBorrowedBook.borrower }}
          </p>
          <p>
            <span class="font-medium">Dne:</span>
            {{ new Date(lastBorrowedBook.loanDate).toLocaleDateString('cs-CZ') }}
          </p>
        </div>

        <div class="bg-white p-4">
          <div class="flex items-center gap-2 text-red-700 font-semibold mb-2">
            <i class="pi pi-clock"></i>
            Nejbližší termín vrácení
          </div>
          <p>
            <span class="font-medium">Titul:</span>
            {{ earliestLoanReturn.bookEntity.title }}
          </p>
          <p>
            <span class="font-medium">Do:</span>
            {{ earliestLoanReturn.returnDate }}
          </p>
          <p>
            <span class="font-medium">Vypujčeno:</span>
            {{ earliestLoanReturn.borrower }}
          </p>
        </div>
      </div>
    </div>

    <div>
      <div class="flex items-center gap-2 mb-4">
        <i class="pi pi-chart-bar text-sky-600"></i>
        <span class="text-sky-600 font-semibold text-lg">Statistiky</span>
      </div>

      <div class="flex flex-wrap gap-4">
        <template v-for="(val, i) in overviewStats" :key="i">
          <Card class="flex-1 border border-surface shadow-none">
            <template #content>
              <div class="flex justify-between gap-8">
                <div class="flex flex-col gap-1">
                  <span class="text-surface-500 dark:text-surface-400 text-sm">
                    {{ val.label }}
                  </span>
                  <span class="font-bold text-lg">{{ val.value }}</span>
                </div>
                <span
                  class="w-8 h-8 rounded-full inline-flex justify-center items-center text-center"
                  :style="{ backgroundColor: val.color, color: '#ffffff' }"
                >
                  <i :class="val.icon" />
                </span>
              </div>
            </template>
          </Card>
        </template>
      </div>
    </div>
  </div>
</template>
