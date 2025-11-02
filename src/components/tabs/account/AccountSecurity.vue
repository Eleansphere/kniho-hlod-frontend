<script setup lang="ts">
import { ref } from 'vue';
import { formatDate } from '@/utils/date';
import { authorizationStore } from '@/stores/authorization-store';

const { loggedUser } = authorizationStore();
const neco = 0;
const newPassword = ref('');
const confirmPassword = ref('');
const showPasswordForm = ref(false);
const isSubmitting = ref(false);

function cancelPasswordChange(): void {
  showPasswordForm.value = false;
}

function changeAvatar(): void {
  // Placeholder for avatar change logic
  console.log('Change avatar clicked');
}

function changePassword(): void {
  // Placeholder for password change logic
  console.log('Change password clicked');
}
</script>

<template>
  <div class="flex justify-between align-items-center mb-3">
    <p class="text-600 m-0">Spravujte své heslo a bezpečnostní nastavení</p>
  </div>

  <!-- <div v-if="showPasswordForm" class="grid gap-3">
    <div class="col-12 md:col-6">
      <label for="newPassword" class="block font-medium mb-2">Nové heslo</label>
      <Password
        id="newPassword"
        v-model="newPassword"
        placeholder="Zadejte nové heslo"
        toggleMask
        fluid
      />
    </div>

    <div class="col-12 md:col-6">
      <label for="confirmPassword" class="block font-medium mb-2">Potvrzení hesla</label>
      <Password
        id="confirmPassword"
        v-model="confirmPassword"
        placeholder="Potvrďte nové heslo"
        toggleMask
        :feedback="false"
        fluid
      />
    </div>

    <div class="col-12">
      <div class="flex gap-2 justify-content-end mt-3">
        <Button
          label="Zrušit"
          icon="pi pi-times"
          outlined
          severity="secondary"
          @click="cancelPasswordChange"
        />
        <Button
          label="Změnit heslo"
          icon="pi pi-check"
          :loading="isSubmitting"
          @click="changePassword"
        />
      </div>
    </div>
  </div> -->

  <div class="grid gap-3">
    <div class="col-12 md:col-6">
      <label class="block font-medium mb-2">Poslední změna hesla</label>
      <div class="flex align-items-center gap-2">
        <InputText :value="formatDate(loggedUser?.updatedAt) || '—'" disabled fluid />
        <Button
          label="Změnit heslo"
          icon="pi pi-key"
          outlined
          size="small"
          @click="showPasswordForm = true"
        />
      </div>
    </div>
    <div class="col-12 md:col-6">
      <label class="block font-medium mb-2">Dvoufaktorové ověření</label>
      <div class="flex align-items-center gap-2">
        <InputText value="Neaktivní" disabled fluid />
        <Button label="Aktivovat" icon="pi pi-lock" outlined size="small" />
      </div>
    </div>
  </div>
</template>
