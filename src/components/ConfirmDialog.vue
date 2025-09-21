<script setup lang="ts">
import { useNotification } from '@/composables/use-notification';
import { ref } from 'vue';
const { showSaveSuccess, showSaveError } = useNotification();
const {
  preConfirmCallback,
  confirmButtonStyle,
  notes,
  checkBox = { isVisible: false, labelText: '', notes: '' },
  notificationTexts,
  enableNotifications = false,
} = defineProps<{
  confirmButtonStyle: {
    label: string;
    icon?: string;
    severity?: string;
    class?: string;
  };
  preConfirmCallback: (comment: string, checked: boolean) => Promise<void>;
  checkBox?: {
    isVisible: boolean;
    labelText: string;
  };
  notes?: string;
  enableNotifications?: boolean;
  notificationTexts?: {
    successMessage?: string;
    errorMessage?: string;
  };
}>();

const emit = defineEmits<{
  close: [];
}>();

const isProcessing = ref(false);

const comment = ref('');

const checked = ref(false);

const handleConfirm = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;
  try {
    await preConfirmCallback(comment.value, checked.value);
    if (enableNotifications) {
      showSaveSuccess(
        'Úspěch',
        notificationTexts?.successMessage || 'Záznam byl úspěšně zpracován'
      );
    }
    emit('close');
  } catch (e) {
    console.error(e);
    if (enableNotifications) {
      showSaveError('Chyba', notificationTexts?.errorMessage || 'Nepodařilo se zpracovat záznam');
    }
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="grid grid-flow-row gap-4 w-[360px]">
    <p>{{ notes }}</p>
    <div v-if="checkBox?.isVisible" class="flex items-center gap-2">
      <Checkbox id="checkbox" v-model="checked" binary />
      <label for="checkbox">
        {{ checkBox?.labelText }}
      </label>
    </div>
    <div class="flex gap-2">
      <Button class="w-18 font-bold" label="Zrušit" outlined fluid @click="$emit('close')" />
      <Button
        type="submit"
        :severity="confirmButtonStyle.severity"
        :icon="confirmButtonStyle.icon"
        :label="confirmButtonStyle.label"
        fluid
        :loading="isProcessing"
        :disabled="isProcessing"
        @click="handleConfirm"
      />
    </div>
  </div>
</template>
