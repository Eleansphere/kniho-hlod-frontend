<script setup lang="ts">
import { authorizationStore } from '@/stores/authorizationStore';
import { ref } from 'vue';
import { formatDate } from '@/utils/date';
const props = defineProps<{
  userId: string;
}>();

const { loggedUser } = authorizationStore();

const showPasswordForm = ref(false);

const newPassword = ref('');
const confirmPassword = ref('');

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
  <div class="p-4">
    (ve vyvoji...)
    <Accordion :activeIndex="0">
      <AccordionTab>
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-user"></i>
            <span>Osobní údaje</span>
          </div>
        </template>

        <div class="flex align-items-center gap-3 mb-4">
          <div class="relative">
            <Avatar size="large" shape="circle" />
            <!-- <Button
              icon="pi pi-camera"
              rounded
              size="small"
              class="absolute"
              style="bottom: 0; right: 0; width: 2rem; height: 2rem"
              severity="secondary"
              @click="changeAvatar"
            /> -->
          </div>
          <div class="flex-1">
            <Button
              label="Změnit profilovku"
              icon="pi pi-image"
              text
              size="small"
              class="mt-2 p-0"
              @click="changeAvatar"
            />
          </div>
        </div>

        <div class="grid gap-3">
          <div class="col-12 md:col-6">
            <label class="block font-medium mb-2">Jméno</label>
            <InputText :value="loggedUser?.username || '—'" disabled fluid />
          </div>
          <div class="col-12 md:col-6">
            <label class="block font-medium mb-2">E-mail</label>
            <InputText :value="loggedUser?.email || '—'" disabled fluid />
          </div>

          <div class="col-12 md:col-6">
            <label class="block font-medium mb-2">Datum registrace</label>
            <InputText :value="formatDate(loggedUser?.createdAt) || '—'" disabled fluid />
          </div>
        </div>
      </AccordionTab>

      <AccordionTab>
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-shield"></i>
            <span>Zabezpečení</span>
          </div>
        </template>

        <div class="flex justify-between align-items-center mb-3">
          <p class="text-600 m-0">Spravujte své heslo a bezpečnostní nastavení</p>
          <Button
            v-if="!showPasswordForm"
            label="Změnit heslo"
            icon="pi pi-key"
            outlined
            size="small"
            @click="showPasswordForm = true"
          />
        </div>

        <Card v-if="showPasswordForm">
          <template #content>
            <div class="grid gap-3">
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
            </div>
          </template>
        </Card>

        <div v-else class="grid gap-3">
          <div class="col-12 md:col-6">
            <label class="block font-medium mb-2">Poslední změna hesla</label>
            <InputText :value="formatDate(loggedUser?.updatedAt) || '—'" disabled fluid />
          </div>
          <div class="col-12 md:col-6">
            <label class="block font-medium mb-2">Dvoufaktorové ověření</label>
            <div class="flex align-items-center gap-2">
              <InputText value="Neaktivní" disabled fluid />
              <Button label="Aktivovat" icon="pi pi-lock" outlined size="small" />
            </div>
          </div>
        </div>
      </AccordionTab>

      <AccordionTab>
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-cog"></i>
            <span>Předvolby</span>
          </div>
        </template>

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
      </AccordionTab>
    </Accordion>
  </div>
</template>
