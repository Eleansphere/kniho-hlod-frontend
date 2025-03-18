<script setup lang="ts">
import { onMounted, type Component } from 'vue';
import BooksPage from './BooksPage.vue';
import LoansPage from './LoansPage.vue';
import OverviewPage from './OverviewPage.vue';
import AdministratorPage from './AdministratorPage.vue';
import MyAccountPage from './MyAccountPage.vue';
import { authorizationStore } from '@/stores/authorizationStore';
import { useUserStore } from '@/stores/userStore';

interface MenuTabContent {
    label: string;
    icon: string;
    content: Component | null;
    props: Record<string, null>;
    value: number;
    roles: Array<string>;
}

const { loggedUser, actualUsername } = authorizationStore();
console.log('Aktualni user', actualUsername.value);
const menuTabs: Array<MenuTabContent> = [
    {
        label: 'Přehled',
        content: OverviewPage,
        props: {},
        icon: 'pi pi-home',
        value: 0,
        roles: ['admin', 'user']
    },
    {
        label: 'Výpujčky',
        content: LoansPage,
        props: {},
        icon: 'pi pi-address-book',
        value: 1,
        roles: ['admin', 'user']
    },
    {
        label: 'Moje knihy',
        content: BooksPage,
        props: { userId: loggedUser?.id },
        icon: 'pi pi-book',
        value: 2,
        roles: ['admin', 'user']
    },
    {
        label: 'Notifikace',
        content: null,
        props: {},
        icon: 'pi pi-bell',
        value: 3,
        roles: ['admin', 'user']
    },
    {
        label: 'Můj účet',
        content: MyAccountPage,
        props: {},
        icon: 'pi pi-user',
        value: 4,
        roles: ['admin', 'user']
    },
    {
        label: 'Administrátorská správa',
        content: AdministratorPage,
        props: {},
        icon: 'pi pi-cog',
        value: 5,
        roles: ['admin']
    }
];

onMounted(() => {
    useUserStore().fetchEntities();
});
</script>

<template>
    <Card class="mx-auto h-[80vh] w-4/5 opacity-95">
        <template #content>
            <Tabs :value="0">
                <TabList>
                    <Tab v-for="tab in menuTabs" :key="tab.label" :value="tab.value">
                        <span class="flex items-center gap-2">
                            <i :class="tab.icon"></i>
                            <span>{{ tab.label }}</span>
                        </span>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel v-for="tab in menuTabs" :key="tab.label" :value="tab.value">
                        <!-- Pokud existuje komponenta, zobraz ji -->
                        <component v-if="tab.content" :is="tab.content" v-bind="tab.props" />
                        <span v-else>Obsah zatím není dostupný.</span>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </template>
    </Card>
</template>
