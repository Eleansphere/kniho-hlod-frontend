<script setup lang="ts">
import { Form, type FormSubmitEvent } from '@primevue/forms';
import {onMounted, ref} from 'vue';
import {useUserStore} from "@/stores/userStore";

const isProcessing = ref<boolean>();
const dateValue = ref();
const initialValues = {};

const onFormSubmit = ({ states }: FormSubmitEvent) => {
    const newBookLoan = {
        titleName: states.titleName.value,
        borrowerName: states.borrowerName.value,
        borrowDate: states.borrowDate.value
    };

    console.log(newBookLoan);
};


onMounted(async () => {
  await useUserStore().fetchUsers()
})

</script>

<template>
    <Card>
        <template #title>Nová zapůjčená kniha</template>
        <template #content>
            <Form :initialValues @submit="onFormSubmit" class="flex flex-col gap-4">
                <FloatLabel variant="on">
                    <InputText id="book-name" name="titleName" fluid />
                    <label for="book-name">Název titulu</label>
                </FloatLabel>

                <FloatLabel variant="on">
                    <InputText id="borrower-name" name="borrowerName" fluid />
                    <label for="borrower-name">Jméno zapůjčovatele</label>
                </FloatLabel>

                <FloatLabel variant="on">
                    <DatePicker
                        v-model="dateValue"
                        inputId="borrow-date"
                        name="borrowDate"
                        showIcon
                        fluid
                        iconDisplay="input"
                    />
                    <label for="borrow-date">Datum zapůjčení</label>
                </FloatLabel>

                <Button
                    type="submit"
                    label="Přidat záznam"
                    icon="pi pi-plus"
                    fluid
                    :loading="isProcessing"
                    :disabled="isProcessing"
                />
            </Form>
        </template>
    </Card>
</template>
