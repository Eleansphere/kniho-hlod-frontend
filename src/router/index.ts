import { createRouter, createWebHashHistory } from 'vue-router';
import { routes } from './routes';
import { authorizationStore } from '@/stores/authorizationStore';
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { getToken, isTokenExpired, isAuthInitialized, initializeAuth } = authorizationStore();

  if (!isAuthInitialized) {
    await initializeAuth();
  }

  const token = getToken();

  if (to.meta.requiresAuth) {
    if (!token || isTokenExpired()) {
      console.log('🚫 Není přihlášený nebo expirovaný token');
      return next('/login');
    }
  }

  if (to.path === '/login' && token && !isTokenExpired()) {
    return next('/home');
  }

  next();
});
export default router;
