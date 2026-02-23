import type { DialogProps } from 'primevue';

export const DEFAULT_DIALOG_CONFIG: Partial<DialogProps> = {
  modal: true,
  draggable: false,
  dismissableMask: false,
  blockScroll: true,
};

export const DIALOG_SIZE_PRESETS = {
  /** detail s taby, zachovat rozmery kvuli odlisnosti obsahu jednotlivych tabs, takze definovat vysku */
  detail_with_tabs: {
    width: 'clamp(1000px, 80vw, 1400px)',
    height: 'clamp(900px, 80vh, 1200px)',
  },
  /** detail - použít nejlepe u vnitr details with tabs nebo jako samostatny detail */
  detail: {
    width: 'clamp(900px, 80vw, 1100px)',
    height: 'auto',
    maxHeight: '80vh',
  },
  /** formular - vysku bude podle obsahu */
  form: {
    width: 'clamp(500px, 70vw, 800px)',
    height: 'auto',
    maxHeight: '80vh',
  },
  /** na male potvrzovaci modaly nebo ty kde jsou jen ze dva inputy atd.. */
  compact: {
    width: 'clamp(350px, 50vw, 450px)',
    height: 'auto',
    maxHeight: '65vh',
  },
} as const;

export type DialogSizePreset = keyof typeof DIALOG_SIZE_PRESETS;
