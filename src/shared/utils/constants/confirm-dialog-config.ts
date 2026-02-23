import { CONFIRM_DIALOG_PRESET, type ConfirmDialogPreset } from '@/types/confirm-dialog-types';
import type { ConfirmationOptions } from 'primevue/confirmationoptions';

export const DEFAULT_CONFIRM_DIALOG_CONFIG: Partial<ConfirmationOptions> = {
  blockScroll: true,
  modal: true,
};

export const CONFIRM_DIALOG_PRESETS: Record<ConfirmDialogPreset, Partial<ConfirmationOptions>> = {
  [CONFIRM_DIALOG_PRESET.SAVE]: {
    header: 'do.confirm.save',
    acceptLabel: 'do.save',
    acceptProps: { icon: 'pi pi-save' },
    rejectProps: { style: { display: 'none' } },
  },
  [CONFIRM_DIALOG_PRESET.DELETE]: {
    header: 'do.confirm.delete',
    acceptLabel: 'do.clear',
    acceptProps: { severity: 'danger', icon: 'pi pi-trash' },
    rejectProps: { style: { display: 'none' } },
  },
  [CONFIRM_DIALOG_PRESET.SEND]: {
    header: 'do.confirm.send',
    acceptLabel: 'do.send',
    acceptProps: { icon: 'pi pi-envelope' },
    rejectProps: { style: { display: 'none' } },
  },
};
