import { registerEntityClass } from '@/stores/entity-class-registry';
import { Book, Loan, User } from '@/types/entities';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import 'primeicons/primeicons.css';
import Primevue from 'primevue/config';
import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';
import { createApp } from 'vue';

import App from '@/App.vue';
import '@/assets/main.css';
import router from '@/router';
import { authorizationStore } from './stores/authorization-store';

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);

app.use(Primevue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false || 'none',
    },
  },
});

app.use(router);
app.use(ToastService);
app.use(DialogService);

const store = authorizationStore();
store.initializeAuth();
// Volat např. v main.ts nebo store/index.ts
registerEntityClass('userStore', User);
registerEntityClass('bookStore', Book);
registerEntityClass('loanStore', Loan);

app.mount('#app');
