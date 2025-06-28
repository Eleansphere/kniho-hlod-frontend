<script setup lang="ts">
import { formatValue, getNestedValue } from '@/components/table/helpers';
import type { TableColumnDefinition } from '@/components/table/types';
import type { Entity } from '@/types/entities';

defineProps<{
  columns: Array<TableColumnDefinition>;
  items: Array<Entity>;
  displayDetailOnly?: boolean;
  handleDetail?: (data?: Entity) => void;
  handleDelete?: (data?: Entity) => void;
}>();
</script>

<template>
  <DataTable :value="items" size="small">
    <template #empty>{{ 'neni zaznamu' }}</template>
    <Column v-if="handleDetail" class="w-0">
      <template v-if="!displayDetailOnly" #header>
        <Button size="small" @click="handleDetail()" icon="pi pi-plus" />
      </template>
      <template #body="{ data }">
        <Button size="small" outlined @click="handleDetail(data)" icon="pi pi-search" />
      </template>
    </Column>
    <Column v-if="handleDelete" class="w-0">
      <template #body="{ data }">
        <Button size="small" severity="danger" @click="handleDelete(data)" icon="pi pi-trash" />
      </template>
    </Column>
    <Column
      v-for="col in columns"
      :key="Array.isArray(col.field) ? col.field.join('.') : col.field"
      :field="Array.isArray(col.field) ? col.field.join('.') : col.field"
      :header="col.header"
    >
      <template #body="{ data }">
        {{ formatValue(getNestedValue(data, col.field), col) }}
      </template>
    </Column>
  </DataTable>
</template>
