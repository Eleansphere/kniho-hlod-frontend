import type { InputTypeHTMLAttribute } from 'vue';

export type InputDefinition<T> = {
    name: string;
    label: string;
    type: InputTypeHTMLAttribute | 'select';
    options?: Array<Option<string>>;
    required?: boolean;
    placeholder?: string;
};

export type Option<T> = {
    label: string;
    value: T;
};
