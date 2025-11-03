import GenericForm from '@/components/form/GenericForm.vue';
import { usePreferredDialog } from './use-preferred-dialog';
import type { FormDefinition } from '@/components/form/types';
import { ref } from 'vue';
import { useNotification } from './use-notification';

interface FormDialogConfig<T> {
  definition: FormDefinition<T>;
  modelValue: T;
  onSave: (data: T) => Promise<void>;
  mode?: 'create' | 'edit' | 'view';
  submitting?: boolean;
  header: string;
}

export function useFormDialog() {
  const dialog = usePreferredDialog();
  const { showSaveError, showSaveSuccess } = useNotification();

  function openFormDialog<T extends Record<string, any>>(options: FormDialogConfig<T>) {
    const { definition, modelValue, onSave, mode, header } = options;
    const data = ref({ ...modelValue });
    const isSubmitting = ref(false);
    const dialogRef = dialog.open(
      GenericForm,
      {
        definition,
        modelValue,
        mode,
        submitting: isSubmitting.value,
      },
      {
        header,
        dialogSize: 'form',
      },
      () => {},
      {
        'update:modelValue': (updatedData) => {
          data.value = {
            ...updatedData,
          };
        },
        submit: async () => {
          isSubmitting.value = true;
          try {
            await onSave(data.value);
            showSaveSuccess();
          } catch (error) {
            showSaveError(error as string);
          } finally {
            dialogRef.close();
            isSubmitting.value = false;
          }
        },
      }
    );
    return dialogRef;
  }

  return { openFormDialog };
}
