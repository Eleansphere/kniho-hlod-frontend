<script setup lang="ts">
import { onMounted, type Component } from 'vue';
import BooksPage from '../components/tabs/Books.vue';
import LoansPage from '../components/tabs/Loans.vue';
import OverviewPage from '../components/tabs/Overview.vue';
import AdministratorPage from '../components/tabs/Administrator.vue';
import MyAccountPage from '../components/tabs/MyAccount.vue';
import { authorizationStore } from '@/stores/authorizationStore';
import { useUserStore } from '@/stores/entities/userStore';
import { useNotification } from '@/composables/useNotification';

interface MenuTabContent {
  label: string;
  icon: string;
  content: Component | null;
  props: Record<string, string | null>;
  value: number;
  roles: Array<string>;
}

const { loggedUser, actualUsername, logOut } = authorizationStore();
const { showInfo } = useNotification();

function handleLogOut(): void {
  logOut();
  showInfo('Odhlášení', 'Byli jste úspěšně odhlášeni.');
}
//console.log('Aktualni user', actualUsername.value);
const menuTabs: Array<MenuTabContent> = [
  {
    label: 'Přehled',
    content: OverviewPage,
    props: {},
    icon: 'pi pi-home',
    value: 0,
    roles: ['admin', 'user'],
  },
  {
    label: 'Výpujčky',
    content: LoansPage,
    props: { userId: loggedUser?.id },
    icon: 'pi pi-address-book',
    value: 1,
    roles: ['admin', 'user'],
  },
  {
    label: 'Moje knihy',
    content: BooksPage,
    props: { userId: loggedUser?.id },
    icon: 'pi pi-book',
    value: 2,
    roles: ['admin', 'user'],
  },
  {
    label: 'Notifikace',
    content: null,
    props: {},
    icon: 'pi pi-bell',
    value: 3,
    roles: ['admin', 'user'],
  },
  {
    label: 'Můj účet',
    content: MyAccountPage,
    props: {},
    icon: 'pi pi-user',
    value: 4,
    roles: ['admin', 'user'],
  },
  {
    label: 'Administrátor',
    content: AdministratorPage,
    props: {},
    icon: 'pi pi-cog',
    value: 5,
    roles: ['admin'],
  },
];

onMounted(() => {
  useUserStore().fetchEntities();
});
</script>

<template>
  <Card class="h-[80vh] opacity-95">
    <template #content>
      <Tabs :value="0" scrollable>
        <TabList>
          <div class="flex items-center w-full">
            <Tab v-for="tab in menuTabs" :key="tab.label" :value="tab.value">
              <span class="flex items-center gap-2">
                <i :class="tab.icon"></i>
                <span>{{ tab.label }}</span>
              </span>
            </Tab>
          </div>
          <div class="flex items-center justify-self-end gap-4">
            <Avatar
              image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
              shape="circle"
            />
            <span>{{ actualUsername }}</span>
            <Button @click="handleLogOut" icon="pi pi-sign-out" rounded />
          </div>
        </TabList>
        <TabPanels>
          <TabPanel v-for="tab in menuTabs" :key="tab.label" :value="tab.value">
            <component v-if="tab.content" :is="tab.content" v-bind="tab.props" />
            <span v-else>Obsah zatím není dostupný.</span>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </template>
  </Card>
</template>
