import type { FormDefinition } from '@/components/form/types';
import { Book } from '@/types/entities';

export const bookForm: FormDefinition<Book> = {
  fields: [
    {
      name: 'title',
      label: 'Název',
      type: 'text',
      required: true,
      placeholder: 'Zadejte název knihy',
      validators: [
        (value) => (value && value.length < 3 ? 'Název musí mít alespoň 3 znaky' : null),
        (value) => (value && value.length > 100 ? 'Název nesmí být delší než 100 znaků' : null),
      ],
    },
    {
      name: 'author',
      label: 'Autor',
      type: 'text',
      required: true,
      placeholder: 'Zadejte jméno autora',
      validators: [
        (value) => (value && value.length < 2 ? 'Jméno autora musí mít alespoň 2 znaky' : null),
      ],
    },
    {
      name: 'description',
      label: 'Popis',
      type: 'textarea',
      placeholder: 'Zadejte popis knihy',
      hint: 'Nepovinný popis knihy pro lepší identifikaci',
    },
    {
      name: 'publicationYear',
      label: 'Rok vydání',
      type: 'number',
      placeholder: 'Zadejte rok vydání',
      validators: [
        (value) =>
          value && (value < 1000 || value > new Date().getFullYear())
            ? `Rok musí být mezi 1000 a ${new Date().getFullYear()}`
            : null,
      ],
    },
    {
      name: 'isAvailable',
      label: 'Dostupná k zapůjčení',
      type: 'select',
      options: [
        { label: 'Ano', value: true },
        { label: 'Ne', value: false },
      ],
      required: true,
      validators: [(value) => (value === undefined ? 'Musíte vybrat dostupnost' : null)],
    },
  ],
  submitLabel: 'Uložit knihu',
  cancelLabel: 'Zrušit',
  showCancel: true,
};
