<script setup lang="ts">
import { useFormState } from '@/composables/useFormState';
import type { FormDefinition } from '@/components/form/FormTypes';
import { computed, watch } from 'vue';

const props = defineProps<{
    definition: FormDefinition<any>;
    modelValue: any;
    mode?: 'create' | 'edit' | 'view';
    submitting?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
    (e: 'submit', value: any): void;
    (e: 'close', value: []): void;
}>();

const { state, validateForm, touchField, isFieldInvalid } = useFormState(
    props.definition,
    props.modelValue
);

function handleSubmit() {
    if (validateForm()) {
        state.isSubmitting = true;
        emit('submit', { ...state.model });
    }
}

function handleFieldInput(fieldName: string) {
    touchField(fieldName);
    emit('update:modelValue', { ...state.model });
}

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal && JSON.stringify(newVal) !== JSON.stringify(state.model)) {
            Object.assign(state.model, newVal);
        }
    },
    { deep: true }
);

watch(
    () => props.submitting,
    (submitting) => {
        state.isSubmitting = !!submitting;
    }
);

const isViewOnly = computed(() => props.mode === 'view');
</script>

<template>
    <form @submit.prevent="handleSubmit" class="form-container">
        <div v-for="field in definition.fields" :key="field.name" class="form-field">
            <div
                v-if="!field.hidden && (!isViewOnly || state.model[field.name])"
                class="field-wrapper"
            >
                <!-- Text inputs -->
                <template v-if="['text', 'email', 'password'].includes(field.type)">
                    <IftaLabel>
                        <InputText
                            :id="field.name"
                            v-model="state.model[field.name]"
                            variant="filled"
                            :type="field.type"
                            :placeholder="field.placeholder"
                            :disabled="isViewOnly || field.disabled?.(state.model)"
                            :invalid="isFieldInvalid(field.name)"
                            :hidden="isViewOnly && field.type === 'password'"
                            @input="handleFieldInput(field.name)"
                            fluid
                        />
                        <label :for="field.name">{{ field.label }}</label>
                    </IftaLabel>
                    <small v-if="isFieldInvalid(field.name)" class="error-message">
                        {{ state.errors[field.name] }}
                    </small>
                    <small v-else-if="field.hint" class="hint-message">{{ field.hint }}</small>
                </template>

                <!-- Number input -->
                <template v-else-if="field.type === 'number'">
                    <IftaLabel>
                        <InputNumber
                            :id="field.name"
                            v-model="state.model[field.name]"
                            variant="filled"
                            :placeholder="field.placeholder"
                            :disabled="isViewOnly || field.disabled?.(state.model)"
                            :invalid="isFieldInvalid(field.name)"
                            @input="handleFieldInput(field.name)"
                            fluid
                        />
                        <label :for="field.name">{{ field.label }}</label>
                    </IftaLabel>
                    <small v-if="isFieldInvalid(field.name)" class="error-message">
                        {{ state.errors[field.name] }}
                    </small>
                    <small v-else-if="field.hint" class="hint-message">{{ field.hint }}</small>
                </template>

                <!-- Select input -->
                <template v-else-if="field.type === 'select'">
                    <IftaLabel>
                        <Select
                            :input-id="field.name"
                            v-model="state.model[field.name]"
                            :options="field.options"
                            option-label="label"
                            option-value="value"
                            variant="filled"
                            :placeholder="field.placeholder"
                            :disabled="isViewOnly || field.disabled?.(state.model)"
                            :invalid="isFieldInvalid(field.name)"
                            @change="handleFieldInput(field.name)"
                            fluid
                        />
                        <label :for="field.name">{{ field.label }}</label>
                    </IftaLabel>
                    <small v-if="isFieldInvalid(field.name)" class="error-message">
                        {{ state.errors[field.name] }}
                    </small>
                    <small v-else-if="field.hint" class="hint-message">{{ field.hint }}</small>
                </template>

                <!-- Textarea input -->
                <template v-else-if="field.type === 'textarea'">
                    <IftaLabel>
                        <Textarea
                            :id="field.name"
                            v-model="state.model[field.name]"
                            variant="filled"
                            :placeholder="field.placeholder"
                            :disabled="isViewOnly || field.disabled?.(state.model)"
                            :invalid="isFieldInvalid(field.name)"
                            @input="handleFieldInput(field.name)"
                            fluid
                        />
                        <label :for="field.name">{{ field.label }}</label>
                    </IftaLabel>
                    <small v-if="isFieldInvalid(field.name)" class="error-message">
                        {{ state.errors[field.name] }}
                    </small>
                    <small v-else-if="field.hint" class="hint-message">{{ field.hint }}</small>
                </template>

                <!-- Checkbox input -->
                <template v-else-if="field.type === 'checkbox'">
                    <div class="checkbox-wrapper">
                        <Checkbox
                            :id="field.name"
                            v-model="state.model[field.name]"
                            :disabled="isViewOnly || field.disabled?.(state.model)"
                            @change="handleFieldInput(field.name)"
                        />
                        <label :for="field.name">{{ field.label }}</label>
                    </div>
                    <small v-if="isFieldInvalid(field.name)" class="error-message">
                        {{ state.errors[field.name] }}
                    </small>
                    <small v-else-if="field.hint" class="hint-message">{{ field.hint }}</small>
                </template>

                <!-- Date input -->
                <template v-else-if="field.type === 'date'">
                    <IftaLabel>
                        <Calendar
                            :id="field.name"
                            v-model="state.model[field.name]"
                            variant="filled"
                            dateFormat="dd.mm.yy"
                            :placeholder="field.placeholder"
                            :disabled="isViewOnly || field.disabled?.(state.model)"
                            :invalid="isFieldInvalid(field.name)"
                            @date-select="handleFieldInput(field.name)"
                            fluid
                        />
                        <label :for="field.name">{{ field.label }}</label>
                    </IftaLabel>
                    <small v-if="isFieldInvalid(field.name)" class="error-message">
                        {{ state.errors[field.name] }}
                    </small>
                    <small v-else-if="field.hint" class="hint-message">{{ field.hint }}</small>
                </template>
            </div>
        </div>

        <div class="form-actions">
            <Button
                v-if="definition.showCancel !== false"
                type="button"
                icon="pi pi-times"
                severity="secondary"
                :label="definition.cancelLabel || 'Zrušit'"
                @click="$emit('close', [])"
            />
            <Button
                v-if="!isViewOnly"
                type="submit"
                icon="pi pi-save"
                :label="definition.submitLabel || 'Uložit'"
                :loading="state.isSubmitting"
                :disabled="state.isSubmitting"
            />
        </div>
    </form>
</template>

<style scoped>
.form-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.form-field {
    margin-bottom: 0.5rem;
}
.field-wrapper {
    margin-bottom: 0.25rem;
}
.error-message {
    color: var(--error-color, #ff0000);
    font-size: 0.75rem;
}
.hint-message {
    color: var(--hint-color, #666666);
    font-size: 0.75rem;
}
.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
}
.checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
