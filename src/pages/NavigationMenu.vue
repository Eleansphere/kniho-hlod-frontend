<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigationRoutesStore';
import { ref } from 'vue';

const store = useNavigationStore();
const items = ref(store.menuItems);
</script>

<template>
  <div class="w-60 min-h-full flex flex-col bg-white shadow-md">
      <Menu :model="items">
        <template #start>

        </template>
        <template #submenulabel="{ item }">
          <span class="text-primary font-bold">{{ item.name }}</span>
        </template>
        <template #item="{ item, props }">
          <router-link v-if="item.path" v-slot="{ href, navigate }" :to="item.path" custom>
            <a v-ripple :href="href" class="flex items-center" v-bind="props.action" @click="navigate">
              <span :class="item?.meta.icon" />
              <span>{{ item.name }}</span>
              <Badge v-if="item.meta.badge" class="ml-auto" :value="item.meta.badge" />
            </a>
          </router-link>
        </template>
        <template #end>
        </template>
      </Menu>
          <div class="w-full mt-auto">
            <button
              v-ripple
              class="relative overflow-hidden w-full border-0 bg-transparent flex items-center p-2 pl-4 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200"
            >
              <Avatar
                image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                class="mr-2"
                shape="circle"
              />
              <span class="inline-flex flex-col items-start">
                                <span class="font-bold">Karel Vorel</span>
                                <span class="text-sm">Uživatel</span>
                            </span>
            </button>
          </div>
  </div>
</template>


