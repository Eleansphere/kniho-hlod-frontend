<script setup lang="ts">
import type { Entity } from '@/types/EntityTypes';
import type { TableColumnDefinition } from '@/types/tableTypes';

defineProps<{
    columns: Array<TableColumnDefinition>;
    items: Array<Entity>;
    displayDetailOnly?: boolean;
    handleDetail?: (data?: Entity) => void;
}>();
</script>

<template>
    <DataTable :value="items" size="small">
        <Column v-if="handleDetail" class="w-0">
            <template v-if="!displayDetailOnly" #header>
                <Button size="small" @click="handleDetail()" icon="pi pi-plus"> </Button>
            </template>
            <template #body="{ data }">
                <Button size="small" outlined @click="handleDetail(data)" icon="pi pi-search">
                </Button>
            </template>
        </Column>

        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" />
    </DataTable>
</template>
