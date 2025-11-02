<script setup lang="ts">
const neco = 0;
</script>

<template>
  <div class="grid gap-3">
    <div class="col-12 md:col-6">
      <label class="block font-medium mb-2">Jazyk</label>
      <Dropdown optionLabel="label" optionValue="value" :modelValue="'cs'" fluid />
    </div>
    <div class="col-12 md:col-6">
      <label class="block font-medium mb-2">Časová zóna</label>
      <Dropdown optionLabel="label" optionValue="value" :modelValue="'Europe/Prague'" fluid />
    </div>
    <div class="col-12">
      <label class="block font-medium mb-2">E-mailová oznámení</label>
      <div class="flex flex-column gap-2">
        <div class="flex align-items-center">
          <Checkbox inputId="notifications1" :modelValue="true" />
          <label for="notifications1" class="ml-2">Oznámení o novinkách</label>
        </div>
        <div class="flex align-items-center">
          <Checkbox inputId="notifications2" :modelValue="false" />
          <label for="notifications2" class="ml-2">Oznámení o vypršení výpujčky</label>
        </div>
        <div class="flex align-items-center">
          <Checkbox inputId="notifications3" :modelValue="true" />
          <label for="notifications3" class="ml-2">
            Bezpečnostní upozornění (změna hesla atd.)
          </label>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-content-end mt-4">
    <Button label="Uložit předvolby" icon="pi pi-save" />
  </div>
</template>
