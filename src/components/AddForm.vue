<script setup lang="ts">
import type { InputDefinition } from '@/types/AddFormTypes';
import type { Entity, EntityWithIndex } from '@/types/EntityTypes';

import { reactive, ref } from 'vue';

const props = defineProps<{
    modelValue: Entity;
    fields: Array<InputDefinition<Entity>>;
    detailOnly: boolean;
}>();

const emit = defineEmits<{
    (e: 'submit', value: Entity): void;
    (e: 'close', value: []): void;
}>();

const fieldModels = reactive<EntityWithIndex>({ ...props.modelValue });

const submitIsAttempted = ref(false);

function onSubmitForm() {
    submitIsAttempted.value = true;
    emit('submit', fieldModels as Entity);
    //pridat emit close
}
</script>

<template>
    <form @submit.prevent="onSubmitForm" class="flex flex-col gap-4">
        <div v-for="field in props.fields" :key="field.name">
            <IftaLabel>
                <InputText
                    v-if="['text', 'email', 'password'].includes(field.type)"
                    :id="field.name"
                    v-model="fieldModels[field.name]"
                    variant="filled"
                    :type="field.type"
                    :invalid="field.required && !fieldModels[field.name] && submitIsAttempted"
                    :disabled="props.detailOnly"
                    :hidden="props.detailOnly && field.type === 'password'"
                    fluid
                />
                <InputNumber
                    v-if="field.type === 'number'"
                    :id="field.name"
                    v-model="fieldModels[field.name]"
                    variant="filled"
                    :type="field.type"
                    :invalid="field.required && !fieldModels[field.name] && submitIsAttempted"
                    :disabled="props.detailOnly"
                    fluid
                />
                <Select
                    v-if="field.type === 'select'"
                    :input-id="field.name"
                    v-model="fieldModels[field.name]"
                    :options="field.options"
                    option-label="label"
                    option-value="value"
                    variant="filled"
                    :invalid="field.required && !fieldModels[field.name] && submitIsAttempted"
                    :disabled="props.detailOnly"
                    fluid
                />
                <label :for="field.name" :hidden="props.detailOnly && field.type === 'password'">{{
                    field.label
                }}</label>
            </IftaLabel>
        </div>

        <template v-if="detailOnly">
            <Button label="Zrušit" @click="$emit('close')" />
        </template>
        <template v-else>
            <Button type="submit" label="Odeslat" />
        </template>
    </form>
</template>
