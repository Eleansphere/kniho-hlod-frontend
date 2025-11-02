import ConfirmDialog from '../components/ConfirmDialog.vue';
import { usePreferredDialog } from './use-preferred-dialog';

const confirmButtonStyle = {
  label: 'Potvrdit',
  icon: 'pi pi-delete',
  severity: 'danger',
};

export function useDeleteConfirmation<T>(
  handleDelete: (item: T) => Promise<void>,
  options?: {
    confirmMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    notes?: (item: T) => string;
  }
) {
  const dialog = usePreferredDialog();

  const deleteWithConfirmation = (item: T) => {
    dialog.open(
      ConfirmDialog,
      {
        preConfirmCallback: () => handleDelete(item),
        confirmButtonStyle,
        checkBox: {
          isVisible: false,
          labelText: '',
        },
        notes: options?.notes?.(item),
        enableNotifications: true,
        notificationTexts: {
          successMessage: options?.successMessage,
          errorMessage: options?.errorMessage,
        },
      },
      {
        modal: true,
        draggable: false,
        header: options?.confirmMessage || 'Smazat záznam?',
      }
    );
  };

  return { deleteWithConfirmation };
}
