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

function openRegistrationDialog(data: User): void {
  dialog.open(
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
      style: { width: '500px' },
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
    dialog.close();
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
  <div class="flex items-end justify-center min-h-dvh bg-hlod bg-cover bg-bottom bg-no-repeat">
    <div
      class="bg-surface-50 dark:bg-surface-900 p-6 shadow rounded-border w-full lg:w-5/12 mx-auto mb-8"
    >
      <div class="text-center mb-8">
        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Kniho-hlod</div>
        <span class="text-surface-600 dark:text-surface-200 font-medium leading-normal">
          Nemáte účet?
        </span>
        <a
          class="font-medium no-underline ml-2 text-primary cursor-pointer"
          @click="() => openRegistrationDialog(new User())"
        >
          Vytvořte si účet!
        </a>
      </div>

      <div>
        <label for="email" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">
          Email
        </label>
        <InputText
          id="email"
          v-model="userData.email"
          type="text"
          placeholder="Email address"
          class="w-full mb-4"
        />

        <label for="password" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">
          Heslo
        </label>
        <InputText
          id="password"
          v-model="userData.password"
          type="password"
          placehoder="Password"
          class="w-full mb-4"
          @keyup.enter="handleAuthorization"
        />
        <!-- <div class="flex items-center justify-between mb-8">
          <div class="flex items-center">
            <Checkbox id="rememberme1" v-model="checked1" :binary="true" class="mr-2" />
            <label for="rememberme1">Remember me</label>
          </div>
          <a class="font-medium no-underline ml-2 text-primary text-right cursor-pointer">
            Forgot password?
          </a>
        </div> -->

        <Button
          label="Přihlásit se"
          @click="handleAuthorization"
          icon="pi pi-lock !text-xl !leading-none"
          fluid
          :disabled="isProcessing"
          :loading="isProcessing"
        />
      </div>
    </div>
  </div>
</template>
