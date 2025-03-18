import router from '@/router';
import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('navigation', () => {
    const menuItems = router.options.routes[0].children;

    return {
        menuItems
    };
});
