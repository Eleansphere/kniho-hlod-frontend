import type { ConfirmationOptions } from 'primevue/confirmationoptions';

export type ConfirmDialogInput = {
  text: string;
  handleConfirmCallback: () => void | Promise<void>;
};

export type ConfirmDialogOptions = {
  preset: ConfirmDialogPreset;
  dialogOptions: ConfirmationOptions;
};

export const CONFIRM_DIALOG_PRESET = {
  SAVE: 'save',
  DELETE: 'delete',
  SEND: 'send',
} as const;

export type ConfirmDialogPreset =
  (typeof CONFIRM_DIALOG_PRESET)[keyof typeof CONFIRM_DIALOG_PRESET];
