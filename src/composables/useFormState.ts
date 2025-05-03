import { reactive, computed, watch } from 'vue';
import type { FormDefinition, FormState } from '@/components/form/FormTypes';

export function useFormState<T extends Record<string, any>>(
    definition: FormDefinition<T>,
    initialModel: T
) {
    const state = reactive<FormState<T>>({
        model: { ...initialModel },
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: false
    });

    // Validace hodnoty jednoho pole
    function validateField(fieldName: keyof T & string) {
        const field = definition.fields.find((f) => f.name === fieldName);
        if (!field || !field.validators) {
            state.errors[fieldName] = null;
            return true;
        }

        const value = state.model[fieldName];

        // Kontrola povinného pole
        if (field.required && (value === undefined || value === null || value === '')) {
            state.errors[fieldName] = `Pole ${field.label} je povinné`;
            return false;
        }

        // Aplikace validátorů
        for (const validator of field.validators) {
            const error = validator(value);
            if (error) {
                state.errors[fieldName] = error;
                return false;
            }
        }

        state.errors[fieldName] = null;
        return true;
    }

    // Validace celého formuláře
    function validateForm() {
        let isValid = true;

        for (const field of definition.fields) {
            state.touched[field.name] = true;
            const fieldIsValid = validateField(field.name);
            isValid = isValid && fieldIsValid;
        }

        state.isValid = isValid;
        return isValid;
    }

    // Označení pole jako "touched" při změně
    function touchField(fieldName: keyof T & string) {
        state.touched[fieldName] = true;
        validateField(fieldName);
    }

    // Reset formuláře
    function resetForm(newModel?: T) {
        Object.assign(state.model, newModel || initialModel);
        state.errors = {};
        state.touched = {};
        state.isSubmitting = false;
    }

    // Sledování závislostí mezi poli
    for (const field of definition.fields) {
        if (field.dependsOn && field.dependsOn.length) {
            const deps = field.dependsOn;
            watch(
                () => deps.map((dep) => state.model[dep]),
                () => {
                    validateField(field.name);
                }
            );
        }
    }

    const isFieldInvalid = computed(() => (fieldName: keyof T & string) => {
        return !!state.errors[fieldName] && !!state.touched[fieldName];
    });

    return {
        state,
        validateField,
        validateForm,
        touchField,
        resetForm,
        isFieldInvalid
    };
}
