export type FieldType =
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'select'
    | 'date'
    | 'checkbox'
    | 'radio'
    | 'textarea';

export interface FormFieldDefinition<T> {
    name: keyof T & string;
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    hint?: string;
    options?: Array<{ label: string; value: any }>;
    validators?: Array<(value: any) => string | null>;
    hidden?: boolean;
    disabled?: (model: T) => boolean;
    dependsOn?: Array<keyof T & string>;
}

export interface FormDefinition<T> {
    fields: Array<FormFieldDefinition<T>>;
    submitLabel?: string;
    cancelLabel?: string;
    showCancel?: boolean;
}

export interface FormState<T> {
    model: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isSubmitting: boolean;
    isValid: boolean;
}
