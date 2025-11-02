<script setup lang="ts">
import AccountInformation from '@/components/tabs/account/AccountInformation.vue';
import AccountPreferences from '@/components/tabs/account/AccountPreferences.vue';
import AccountSecurity from '@/components/tabs/account/AccountSecurity.vue';
import GenericHeader from '@/components/tabs/account/GenericHeader.vue';
</script>

<template>
  <Accordion value="0">
    <AccordionPanel value="0">
      <AccordionHeader>
        <generic-header icon="user" label="Osobní údaje" />
      </AccordionHeader>
      <AccordionContent>
        <account-information />
      </AccordionContent>
    </AccordionPanel>

    <AccordionPanel value="1">
      <AccordionHeader>
        <generic-header icon="shield" label="Zabezpečení" />
      </AccordionHeader>
      <AccordionContent>
        <account-security />
      </AccordionContent>
    </AccordionPanel>

    <AccordionPanel value="2">
      <AccordionHeader>
        <generic-header icon="cog" label="Předvolby" />
      </AccordionHeader>
      <AccordionContent>
        <account-preferences />
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>
