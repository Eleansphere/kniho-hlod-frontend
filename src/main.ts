import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Aura from '@primeuix/themes/aura';
import Primevue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';
import 'primeicons/primeicons.css';

import App from '@/App.vue';
import router from '@/router';
import '@/assets/main.css';
const app = createApp(App);
app.use(Primevue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false || 'none'
        }
    }
});
app.use(router);
app.use(createPinia());

app.use(ToastService);
app.use(DialogService);

app.mount('#app');
