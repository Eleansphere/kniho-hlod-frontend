import GenericForm from '@/components/form/GenericForm.vue';
import { usePreferredDialog } from './use-preferred-dialog';
import type { FormDefinition } from '@/components/form/types';
import { ref } from 'vue';

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

  function openFormDialog<T extends Record<string, any>>(options: FormDialogConfig<T>) {
    const { definition, modelValue, onSave, mode, submitting, header } = options;
    const data = ref({ ...modelValue });
    const dialogRef = dialog.open(
      GenericForm,
      {
        definition,
        modelValue,
        mode,
        submitting,
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
          await onSave(data.value);
          dialogRef.close();
        },
      }
    );
    return dialogRef;
  }

  return { openFormDialog };
}
