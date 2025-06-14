import type { FormDefinition, FormState } from '@/components/form/types';
import { computed, reactive, watch } from 'vue';

export function useFormState<T extends Record<string, any>>(
  definition: FormDefinition<T>,
  initialModel: T
) {
  const state = reactive<FormState<T>>({
    model: { ...initialModel },
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
  });

  function validateField(fieldName: keyof T & string) {
    const field = definition.fields.find((f) => f.name === fieldName);
    if (!field || !field.validators) {
      (state.errors as Record<keyof T, string | null>)[fieldName] = null;
      return true;
    }

    const value = (state.model as T)[fieldName];

    if (field.required && (value === undefined || value === null || value === '')) {
      (state.errors as Record<keyof T, string | null>)[fieldName] =
        `Pole ${field.label} je povinné`;
      return false;
    }

    for (const validator of field.validators) {
      const error = validator(value);
      if (error) {
        (state.errors as Record<keyof T, string | null>)[fieldName] = error;
        return false;
      }
    }

    (state.errors as Record<keyof T, string | null>)[fieldName] = null;
    return true;
  }

  function validateForm() {
    let isValid = true;

    for (const field of definition.fields) {
      (state.touched as Partial<Record<keyof T, boolean>>)[field.name] = true;
      const fieldIsValid = validateField(field.name);
      isValid = isValid && fieldIsValid;
    }

    state.isValid = isValid;
    return isValid;
  }

  // Označení pole jako "touched" při změně
  function touchField(fieldName: keyof T & string) {
    (state.touched as Partial<Record<keyof T, boolean>>)[fieldName] = true;
    validateField(fieldName);
  }

  function resetForm(newModel?: T) {
    Object.assign(state.model as Record<string, any>, { ...(newModel || initialModel) });
    Object.keys(state.errors as Record<string, any>).forEach(
      (key) => delete (state.errors as Record<string, any>)[key]
    );
    Object.keys(state.touched as Record<string, any>).forEach(
      (key) => delete (state.touched as Record<string, any>)[key]
    );
    state.isSubmitting = false;
  }

  for (const field of definition.fields) {
    if (field.dependsOn && field.dependsOn.length) {
      const deps = field.dependsOn;
      watch(
        () => deps.map((dep) => (state.model as T)[dep]),
        () => {
          validateField(field.name);
        }
      );
    }
  }

  const isFieldInvalid = computed(() => (fieldName: keyof T & string) => {
    return (
      !!(state.errors as Partial<Record<keyof T, string>>)[fieldName] &&
      !!(state.touched as Partial<Record<keyof T, boolean>>)[fieldName]
    );
  });

  return {
    state,
    validateField,
    validateForm,
    touchField,
    resetForm,
    isFieldInvalid,
  };
}
