<script setup>
import { ref } from 'vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Divider from 'primevue/divider';

const user = ref({
  name: 'Hlodere',
});

const lastBorrow = ref({
  bookTitle: 'Nejaká kniha',
  borrowedBy: 'Jméno Borec',
  borrowedAt: '2025-09-10',
});

const nextReturn = ref({
  bookTitle: 'Jiná kniha',
  dueDate: '2025-09-20',
  borrowedBy: 'Další Borec',
});

const stats = ref([
  {
    label: 'Aktivní výpůjčky',
    color1: '#34d399',
    value: 25,
    icon: 'pi pi-table',
  },
  {
    label: 'Celkem výpůjček',
    color1: '#60a5fa',
    value: 120,
    icon: 'pi pi-image',
  },
  {
    label: 'Počet knih',
    color1: '#fbbf24',
    value: 56,
    icon: 'pi pi-inbox',
  },
]);
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-1">Vítej červe {{ user.name }}</h2>
    <p class="text-gray-600">Rád tě tu zase vidíme 👋</p>
  </div>
  <Accordion :multiple="true" expandIcon="pi pi-chevron-down" collapseIcon="pi pi-chevron-up">
    <AccordionTab>
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-book text-red-600"></i>
          <span class="text-red-600 font-semibold">Rychlý přehled</span>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-4">
          <div class="flex items-center gap-2 text-green-700 font-semibold mb-2">
            <i class="pi pi-book"></i>
            Poslední zapůjčená kniha
          </div>
          <p>
            <span class="font-medium">Kniha:</span>
            {{ lastBorrow.bookTitle }}
          </p>
          <Divider class="my-3" />
          <p>
            <span class="font-medium">Zapůjčena:</span>
            {{ lastBorrow.borrowedBy }} dne {{ lastBorrow.borrowedAt }}
          </p>
        </div>

        <div class="bg-white p-4">
          <div class="flex items-center gap-2 text-red-700 font-semibold mb-2">
            <i class="pi pi-clock"></i>
            Nejbližší termín vrácení
          </div>
          <p>
            <span class="font-medium">Kniha:</span>
            {{ nextReturn.bookTitle }}
          </p>
          <Divider class="my-3" />
          <p>
            <span class="font-medium">Do:</span>
            {{ nextReturn.dueDate }} – {{ nextReturn.borrowedBy }}
          </p>
        </div>
      </div>
    </AccordionTab>

    <AccordionTab>
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-chart-bar text-sky-600"></i>
          <span class="text-sky-600 font-semibold">Statistiky</span>
        </div>
      </template>
      <div class="flex flex-wrap gap-4">
        <template v-for="(val, i) in stats" :key="i">
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
                  :style="{ backgroundColor: val.color1, color: '#ffffff' }"
                >
                  <i :class="val.icon" />
                </span>
              </div>
            </template>
          </Card>
        </template>
      </div>
    </AccordionTab>
  </Accordion>
</template>
