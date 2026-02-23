<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AccountInformation from '@/components/tabs/account/AccountInformation.vue';
import AccountPreferences from '@/components/tabs/account/AccountPreferences.vue';
import AccountSecurity from '@/components/tabs/account/AccountSecurity.vue';
import UserCard from '@/components/overview/UserCard.vue';

const { t } = useI18n();
</script>

<template>
  <div class="grid gap-4 max-w-2xl">
    <div>
      <h1 class="text-2xl font-bold text-surface-800">{{ t('account.title') }}</h1>
      <p class="text-surface-500 text-sm">{{ t('account.subtitle') }}</p>
    </div>

    <UserCard />

    <Accordion :value="['0']" multiple>
      <AccordionPanel value="0">
        <AccordionHeader>
          <div class="flex items-center gap-2">
            <i class="pi pi-user text-primary-500"></i>
            <span class="font-medium">{{ t('account.tabInfo') }}</span>
          </div>
        </AccordionHeader>
        <AccordionContent>
          <account-information />
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="1">
        <AccordionHeader>
          <div class="flex items-center gap-2">
            <i class="pi pi-shield text-primary-500"></i>
            <span class="font-medium">{{ t('account.tabSecurity') }}</span>
          </div>
        </AccordionHeader>
        <AccordionContent>
          <account-security />
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="2">
        <AccordionHeader>
          <div class="flex items-center gap-2">
            <i class="pi pi-cog text-primary-500"></i>
            <span class="font-medium">{{ t('account.tabPreferences') }}</span>
          </div>
        </AccordionHeader>
        <AccordionContent>
          <account-preferences />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>
