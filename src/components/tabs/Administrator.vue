<script setup lang="ts">
import { userForm } from '@/components/form/definitions/user';
import { useUserStore } from '@/stores/entities/user-store';
import { useBookStore } from '@/stores/entities/book-store';
import { useLoanStore } from '@/stores/entities/loan-store';
import { User } from '@/types/entities';
import { computed, onMounted, ref } from 'vue';
import { useFormDialog } from '@/composables/use-form-dialog';
import { useConfirmDialog } from '@/composables/use-confirm-dialog';

const store = useUserStore();
const bookStore = useBookStore();
const loanStore = useLoanStore();

const users = computed(() => store.entities);

const stats = computed(() => [
  {
    label: 'Uživatelé',
    value: users.value.length,
    icon: 'pi pi-users',
    colorVar: 'var(--p-primary-600)',
    bgClass: 'bg-primary-50',
  },
  {
    label: 'Všechny knihy',
    value: bookStore.entities.length,
    icon: 'pi pi-book',
    colorVar: 'var(--p-primary-500)',
    bgClass: 'bg-primary-50',
  },
  {
    label: 'Výpujčky celkem',
    value: loanStore.entities.length,
    icon: 'pi pi-address-book',
    colorVar: 'var(--p-primary-400)',
    bgClass: 'bg-primary-50',
  },
  {
    label: 'Aktivní výpujčky',
    value: loanStore.entities.filter((l) => !l.isReturned).length,
    icon: 'pi pi-calendar-clock',
    colorVar: 'var(--p-red-500)',
    bgClass: 'bg-red-50',
  },
]);

const searchQuery = ref('');

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return users.value;
  const q = searchQuery.value.toLowerCase();
  return users.value.filter(
    (u) => u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  );
});

const { openFormDialog } = useFormDialog();

function openDialog(data?: User): void {
  openFormDialog({
    definition: userForm,
    modelValue: data ?? new User(),
    onSave: async (content) => {
      await store.saveEntity(content);
    },
    mode: data ? 'view' : 'create',
    header: data ? `Detail uživatele: ${data.username}` : 'Nový uživatel',
  });
}

const { confirmDelete } = useConfirmDialog();

function deleteUser(data: User) {
  confirmDelete({
    text: 'Smazat uživatele?',
    handleConfirmCallback: async () => {
      await store.deleteEntity(data.id);
    },
  });
}

const roleColors: Record<string, string> = {
  admin: 'bg-primary-100 text-primary-700',
  user: 'bg-surface-100 text-surface-600',
};

onMounted(() => {
  store.fetchEntities();
});
</script>

<template>
  <div class="grid gap-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-surface-800">Administrátor</h1>
        <p class="text-surface-500 text-sm">Správa uživatelů a systémový přehled</p>
      </div>
      <Button
        label="Nový uživatel"
        icon="pi pi-plus"
        size="small"
        class="self-start"
        @click="openDialog()"
      />
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-surface-0 rounded-xl p-4 shadow-sm border border-surface-100 flex items-center justify-between"
      >
        <div>
          <p class="text-surface-500 text-xs font-medium uppercase tracking-wide mb-1">
            {{ stat.label }}
          </p>
          <p class="text-2xl font-bold" :style="{ color: stat.colorVar }">{{ stat.value }}</p>
        </div>
        <div class="w-9 h-9 rounded-full flex items-center justify-center" :class="stat.bgClass">
          <i :class="stat.icon" :style="{ color: stat.colorVar }"></i>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="relative">
      <i
        class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
      ></i>
      <InputText
        v-model="searchQuery"
        placeholder="Hledej podle jména nebo emailu…"
        class="w-full pl-9"
      />
    </div>

    <!-- User cards -->
    <div v-if="filteredUsers.length === 0" class="text-center py-12 text-surface-400">
      <i class="pi pi-users text-4xl mb-3 block text-surface-200"></i>
      <p>Žádní uživatelé nenalezeni.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="bg-surface-0 rounded-xl shadow-sm border border-surface-100 p-4 flex flex-col gap-3"
      >
        <!-- User info -->
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center shrink-0"
          >
            <i class="pi pi-user text-surface-500"></i>
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-surface-800 truncate">{{ user.username }}</p>
            <p class="text-surface-400 text-xs truncate">{{ user.email }}</p>
          </div>
          <span
            class="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
            :class="roleColors[user.role] ?? 'bg-surface-100 text-surface-600'"
          >
            {{ user.role }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-1 border-t border-surface-100">
          <Button
            icon="pi pi-pencil"
            size="small"
            outlined
            severity="secondary"
            class="flex-1"
            @click="openDialog(user as User)"
          />
          <Button
            icon="pi pi-trash"
            size="small"
            outlined
            severity="danger"
            class="flex-1"
            @click="deleteUser(user as User)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
