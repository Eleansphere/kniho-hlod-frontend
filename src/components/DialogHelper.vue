<script setup lang="ts">
import { inject, markRaw } from 'vue';
const dialogRef = inject<any>('dialogRef');
</script>

<script lang="ts">
import DialogHelper from '@/components/DialogHelper.vue';
import { useDialog } from 'primevue/usedialog';
import type { Component } from 'vue';
import type { DialogProps } from 'primevue/dialog';
import type { DynamicDialogOptions } from 'primevue/dynamicdialogoptions';
import type { ComponentProps } from 'vue-component-type-helpers';

export function usePreferredDialog() {
  const d = useDialog();

  let dialogRef: any = null;

  return {
    open<C extends Component>(
      is: C,
      props: ComponentProps<C> & { onSubmit?: (value: any) => void },
      dialog: DialogProps,
      onClose?: DynamicDialogOptions['onClose']
    ) {
      dialogRef = d.open(DialogHelper, {
        onClose,
        props: {
          style: {
            'max-width': '75%',
          },
          ...dialog,
          modal: true,
          draggable: false,
        },
        data: { is: markRaw(is), props },
      });

      return dialogRef;
    },
    close() {
      if (dialogRef) {
        dialogRef.close();
      }
    },
  };
}
</script>

<template>
  <component
    :is="dialogRef.data.is"
    v-bind="dialogRef.data.props"
    @close="dialogRef.close"
    @submit="dialogRef.data.props.onSubmit"
  />
</template>
