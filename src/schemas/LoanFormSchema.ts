import type { FormDefinition } from '@/components/form/FormTypes';
import { authorizationStore } from '@/stores/authorizationStore';
import { useBookStore } from '@/stores/entities/bookStore';
import { useUserStore } from '@/stores/entities/userStore';
import type { Loan } from '@/types/EntityTypes';
import { computed, onMounted } from 'vue';

const data = computed(() => {
    return useBookStore()
        .entities.filter((book) => book.owner_id === authorizationStore().loggedUser?.id)
        .map((book) => ({
            label: book.title,
            value: book.id
        }));
});

onMounted(() => {
    useBookStore().fetchEntities;
});

console.log(data.value);

export const loanFormSchema: FormDefinition<Loan> = {
    fields: [
        {
            name: 'book_id',
            label: 'Kniha',
            type: 'select',
            required: true,
            placeholder: 'Vyber knihu',
            options: data.value
        },
        {
            name: 'borrower',
            label: 'Vypůjčil si',
            type: 'text',
            required: true,
            placeholder: 'Zadejte jméno autora',
            validators: [
                (value) =>
                    value && value.length < 2 ? 'Jméno autora musí mít alespoň 2 znaky' : null
            ]
        },
        {
            name: 'loan_date',
            label: 'Datum zapujčení:',
            type: 'date',
            required: true
        },
        {
            name: 'return_date',
            label: 'Datum vrácení',
            type: 'date'
        }
    ]
};
