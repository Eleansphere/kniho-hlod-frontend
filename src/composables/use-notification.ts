import { useToast } from 'primevue';

export function useNotification() {
  const toast = useToast();

  function showSaveSuccess(
    summary: string = 'Success',
    detail: string = 'Your changes have been saved successfully.',
    life: number = 3000
  ) {
    toast.add({
      severity: 'success',
      summary,
      detail,
      life,
    });
  }

  function showSaveError(
    summary: string = 'Error',
    detail: string = 'Failed to save changes.',
    life: number = 3000
  ) {
    toast.add({
      severity: 'error',
      summary,
      detail,
      life,
    });
  }

  function showInfo(
    summary: string = 'Info',
    detail: string = 'This is an informational message.',
    life: number = 3000
  ) {
    toast.add({
      severity: 'info',
      summary,
      detail,
      life,
    });
  }

  return {
    showSaveSuccess,
    showSaveError,
    showInfo,
  };
}
