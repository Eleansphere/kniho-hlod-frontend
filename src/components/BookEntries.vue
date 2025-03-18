<script setup lang="ts">
import { ref } from 'vue';

const bookEntries = ref();

const deleteEntry = () => {};
</script>

<template>
    <div class="card">
        <DataTable :value="bookEntries" tableStyle="min-width: 50rem">
            <Column field="code" header="Název titulu"></Column>
            <Column field="name" header="Vypůjčil"></Column>
            <Column field="category" header="Datum"></Column>
            <Column field="quantity" header="Smazat záznam"></Column>
            <Column class="w-24 !text-end">
                <template #body="{ data }">
                    <Button
                        icon="pi pi-trash"
                        @click="deleteEntry(data)"
                        severity="danger"
                        rounded
                    ></Button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
