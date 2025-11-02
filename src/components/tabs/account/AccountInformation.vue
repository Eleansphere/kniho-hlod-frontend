<script setup lang="ts">
import { API_ENDPOINTS } from '@/stores/api-end-points';
import { authorizationStore } from '@/stores/authorization-store';
import { useFileStore } from '@/stores/entities/profile-file-store';
import { computed, onMounted, ref } from 'vue';
import { formatDate } from '@/utils/date';

const { loggedUser } = authorizationStore();

const fileStore = useFileStore();
const isSubmitting = ref(false);

const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isUploading = ref(false);

// 📂 při výběru souboru
function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
    previewUrl.value = URL.createObjectURL(selectedFile.value);
  }
}
const haveAvatar = computed(() => {
  const userProfileImage = Boolean(
    fileStore.entities.find((image) => image.user === loggedUser?.id)
  );
  return !previewUrl && !userProfileImage;
});
async function upload() {
  if (!selectedFile.value) return;

  isSubmitting.value = true;

  try {
    // 1️⃣ Ulož metadata o souboru
    const meta = {
      name: selectedFile.value.name,
      user: loggedUser?.id,
    };

    const savedMeta = await fileStore.saveEntity(meta);

    // 2️⃣ Nahraj samotný soubor (jako blob)
    const formData = new FormData();
    formData.append('avatar', selectedFile.value);
    formData.append('id', savedMeta.id); // spojíš s metadaty

    const response = await fetch(`${API_ENDPOINTS.files}/${savedMeta.id}/avatar`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${authorizationStore().getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Nepodařilo se nahrát soubor');
    }

    const data = await response.json();
    console.log('Soubor úspěšně nahrán:', data);
  } catch (err) {
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
}
const ava = ref();
onMounted(async () => {
  const fileStore = useFileStore();
  const imageId = fileStore.entities.find((image) => image.user === loggedUser!.id)?.id;
  const response = await fetch(`${API_ENDPOINTS.files}/${imageId}/avatar`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authorizationStore().getToken()}`,
    },
  });
  console.log(response);
  //const image = URL.createObjectURL(response.url);
  ava.value = response.url;
});
</script>

<template>
  <div class="flex align-items-center gap-3 mb-4">
    <div class="flex items-center gap-4">
      <Avatar
        size="xlarge"
        shape="circle"
        :image="previewUrl || ava"
        :icon="haveAvatar ? 'pi pi-user' : ''"
      />
      {{ selectedFile?.name }}
    </div>

    <div class="flex flex-column items-center justify-end w-full gap-2">
      <input type="file" accept="image/*" @change="onFileSelect" class="hidden" id="avatarInput" />
      <label for="avatarInput" class="cursor-pointer text-primary underline">Vybrat fotku</label>

      <Button
        label="Nahrát"
        icon="pi pi-upload"
        :loading="isUploading"
        severity="secondary"
        @click="upload"
      />
    </div>
  </div>

  <div class="grid gap-3">
    <div class="col-12 md:col-6">
      <label class="block font-medium mb-2">Jméno</label>
      <InputText :value="loggedUser?.username || '—'" disabled fluid />
    </div>
    <div class="col-12 md:col-6">
      <label class="block font-medium mb-2">E-mail</label>
      <InputText :value="loggedUser?.email || '—'" disabled fluid />
    </div>

    <div class="col-12 md:col-6">
      <label class="block font-medium mb-2">Datum registrace</label>
      <InputText :value="formatDate(loggedUser?.createdAt) || '—'" disabled fluid />
    </div>
  </div>
</template>
