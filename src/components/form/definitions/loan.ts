import type { FormDefinition } from '@/components/form/types';
import type { Loan } from '@/types/entities';

export const loanForm: FormDefinition<Loan> = {
  fields: [
    {
      name: 'borrower',
      label: 'Vypůjčil si',
      type: 'text',
      required: true,
      placeholder: 'Zadejte jméno autora',
      validators: [
        (value) => (value && value.length < 2 ? 'Jméno autora musí mít alespoň 2 znaky' : null),
      ],
    },
    {
      name: 'loanDate',
      label: 'Datum zapujčení:',
      type: 'date',
      required: true,
    },
    {
      name: 'returnDate',
      label: 'Datum vrácení',
      type: 'date',
    },
  ],
  submitLabel: 'Uložit výpujčku',
  cancelLabel: 'Zrušit',
  showCancel: true,
};
