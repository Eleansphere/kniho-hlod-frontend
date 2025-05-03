import type { FormDefinition } from '@/components/form/FormTypes';
import { Book } from '@/types/EntityTypes';

export const bookFormSchema: FormDefinition<Book> = {
    fields: [
        {
            name: 'title',
            label: 'Název',
            type: 'text',
            required: true,
            placeholder: 'Zadejte název knihy',
            validators: [
                (value) => (value && value.length < 3 ? 'Název musí mít alespoň 3 znaky' : null),
                (value) =>
                    value && value.length > 100 ? 'Název nesmí být delší než 100 znaků' : null
            ]
        },
        {
            name: 'author',
            label: 'Autor',
            type: 'text',
            required: true,
            placeholder: 'Zadejte jméno autora',
            validators: [
                (value) =>
                    value && value.length < 2 ? 'Jméno autora musí mít alespoň 2 znaky' : null
            ]
        }
        // {
        //     name: 'description',
        //     label: 'Popis',
        //     type: 'textarea',
        //     placeholder: 'Zadejte popis knihy',
        //     hint: 'Nepovinný popis knihy pro lepší identifikaci'
        // },
        // {
        //     name: 'publicationYear',
        //     label: 'Rok vydání',
        //     type: 'number',
        //     placeholder: 'Zadejte rok vydání',
        //     validators: [
        //         (value) =>
        //             value && (value < 1000 || value > new Date().getFullYear())
        //                 ? `Rok musí být mezi 1000 a ${new Date().getFullYear()}`
        //                 : null
        //     ]
        // },
        // {
        //     name: 'genre',
        //     label: 'Žánr',
        //     type: 'select',
        //     options: [
        //         { label: 'Román', value: 'roman' },
        //         { label: 'Sci-fi', value: 'scifi' },
        //         { label: 'Fantasy', value: 'fantasy' },
        //         { label: 'Detektivka', value: 'detective' },
        //         { label: 'Literatura faktu', value: 'nonfiction' },
        //         { label: 'Jiné', value: 'other' }
        //     ]
        // },
        // {
        //     name: 'isAvailable',
        //     label: 'Dostupná k zapůjčení',
        //     type: 'checkbox'
        // }
    ],
    submitLabel: 'Uložit knihu',
    cancelLabel: 'Zrušit',
    showCancel: true
};
