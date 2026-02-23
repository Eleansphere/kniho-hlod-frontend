<script setup lang="ts">
import { registrationForm } from '@/components/form/definitions/registration';
import GenericForm from '@/components/form/GenericForm.vue';
import { useNotification } from '@/composables/use-notification';
import { usePreferredDialog } from '@/composables/use-preferred-dialog';
import { authorizationStore } from '@/stores/authorization-store';
import { useUserStore } from '@/stores/entities/user-store';
import { User } from '@/types/entities';
import { reactive, ref } from 'vue';

const userData = reactive<Partial<User>>({
  email: 'zkouska@zkouska.cz',
  password: 'zkouska',
});

const isProcessing = ref(false);
const isSubmitting = ref(false);
const formData = ref<User>(new User());

const { showSaveSuccess, showSaveError } = useNotification();
const { handleLogin } = authorizationStore();
const store = useUserStore();

async function handleAuthorization(): Promise<void> {
  isProcessing.value = true;
  try {
    await handleLogin(userData);
    showSaveSuccess('Úspěšné přihlášení', 'Vítejte zpět!');
  } catch (error) {
    showSaveError('Chyba při přihlášení', 'Zkontrolujte své přihlašovací údaje.');
    console.error(error);
  } finally {
    isProcessing.value = false;
  }
}

const dialog = usePreferredDialog();
let registrationDialogRef: ReturnType<typeof dialog.open> | null = null;

function openRegistrationDialog(data: User): void {
  registrationDialogRef = dialog.open(
    GenericForm,
    {
      definition: registrationForm,
      modelValue: data,
      mode: 'create',
      submitting: isSubmitting.value,
      'onUpdate:modelValue': (val) => (formData.value = val),
      onSubmit: handleRegistration,
    },
    {
      modal: true,
      header: 'Registrace nového uživatele',
      dialogSize: 'form',
    }
  );
}

async function handleRegistration(data: User): Promise<void> {
  isSubmitting.value = true;
  Object.assign(formData.value, data);
  formData.value.role = 'user';

  try {
    await store.saveEntity(formData.value);
    showSaveSuccess(
      'Registrace úspěšná',
      `Uživatel ${formData.value.username} byl úspěšně zaregistrován.`
    );
    registrationDialogRef?.close();
  } catch (error) {
    showSaveError(
      'Chyba při registraci',
      `Uživatel ${formData.value.username} se nepodařilo zaregistrovat.`
    );
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-dvh bg-hlod bg-cover bg-center bg-no-repeat">
    <div class="w-full max-w-md mx-4">
      <div class="bg-surface-0 rounded-2xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-surface-800 px-8 py-8 text-center">
          <div class="flex justify-center mb-3">
            <div class="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center">
              <i class="pi pi-book text-primary-300 text-3xl"></i>
            </div>
          </div>
          <h1 class="text-surface-0 text-3xl font-bold tracking-wide mb-1">Kniho-hlod</h1>
          <p class="text-surface-400 text-sm">Přehled tvých zapůjčených knih</p>
        </div>

        <!-- Form -->
        <div class="px-8 py-8">
          <div class="mb-5">
            <label for="email" class="block text-surface-700 font-medium mb-2 text-sm">Email</label>
            <InputText
              id="email"
              v-model="userData.email"
              type="text"
              placeholder="vas@email.cz"
              class="w-full"
            />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-surface-700 font-medium mb-2 text-sm">Heslo</label>
            <InputText
              id="password"
              v-model="userData.password"
              type="password"
              placeholder="••••••••"
              class="w-full"
              @keyup.enter="handleAuthorization"
            />
          </div>

          <Button
            label="Přihlásit se"
            @click="handleAuthorization"
            icon="pi pi-sign-in"
            fluid
            :disabled="isProcessing"
            :loading="isProcessing"
          />

          <div class="text-center mt-5 text-sm">
            <span class="text-surface-500">Nemáte účet?</span>
            <a
              class="ml-2 text-primary-500 font-semibold cursor-pointer hover:text-primary-600 hover:underline"
              @click="() => openRegistrationDialog(new User())"
            >
              Vytvořte si účet!
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
