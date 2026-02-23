import { createRouter, createWebHashHistory } from 'vue-router';
import { routes } from './routes';
import { authorizationStore } from '@/stores/authorization-store';
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
      return next('/login');
    }
  }

  if (to.meta.requiresRole) {
    const { loggedUser } = authorizationStore();
    if (loggedUser?.role !== to.meta.requiresRole) {
      return next('/home/overview');
    }
  }

  if (to.path === '/login' && token && !isTokenExpired()) {
    return next('/home/overview');
  }

  next();
});
export default router;
