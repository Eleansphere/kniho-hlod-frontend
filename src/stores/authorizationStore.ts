import router from '@/router';
import type { User } from '@/types/entities';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { API_ENDPOINTS } from './apiEndPoints';
import { useBookStore } from './entities/bookStore';
import { useLoanStore } from './entities/loanStore';
import { useUserStore } from './entities/userStore';
import { useTokenManager } from '@/composables/useTokenManager';
import { useNotification } from '@/composables/useNotification';

export const authorizationStore = defineStore('authorization', () => {
  const apiUrl = API_ENDPOINTS.userLogin;
  const tokenManager = useTokenManager('auth-token');
  const { showInfo } = useNotification();

  // State
  const actualRole = ref('');
  const actualUsername = ref('');
  const isAuthenticated = ref(false);
  const isAuthInitialized = ref(false);
  // Actions
  async function handleLogin(userCredentials: Partial<User>): Promise<void> {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userCredentials),
      });

      const userData = await response.json();
      console.log('📦 Data z response:', userData);

      if (!response.ok) {
        console.error('❌ Chyba v odpovědi:', userData.error);
        throw new Error(userData.error);
      }

      tokenManager.setToken(userData.token);
      tokenManager.setTokenExpiration(userData.token, () => {
        logOut();
      });

      isAuthenticated.value = true;
      actualUsername.value = userData.email;
      actualRole.value = userData.role;

      console.log('✅ Token uložen do localStorage:', tokenManager.getToken());

      await Promise.all([
        useUserStore().fetchEntities(),
        useBookStore().fetchEntities(),
        useLoanStore().fetchEntities(),
      ]);

      router.push('/home');
    } catch (error) {
      console.error('🔥 Chyba při loginu:', error);
      throw error;
    }
  }

  function logOut(): void {
    router.push('/login');
    console.log('mazu token', tokenManager.getToken());
    tokenManager.removeToken();
    isAuthenticated.value = false;
    actualRole.value = '';
    actualUsername.value = '';
    showInfo('Odhlášení', 'Byl jsi úspěšně odhlášen.');
  }

  async function initializeAuth(): Promise<void> {
    const token = tokenManager.getToken();
    if (token && !tokenManager.isTokenExpired()) {
      const tokenData = tokenManager.getTokenData();
      if (tokenData) {
        isAuthenticated.value = true;
        actualUsername.value = tokenData.email;
        tokenManager.setTokenExpiration(token, () => {
          logOut();
        });
      }
      await Promise.all([
        useUserStore().fetchEntities(),
        useBookStore().fetchEntities(),
        useLoanStore().fetchEntities(),
      ]);
    } else if (token) {
      logOut();
    }
    isAuthInitialized.value = true;
  }

  // Getters
  const loggedUser = computed<User | null>(() => {
    return useUserStore().entities.find((user) => user.email === actualUsername.value) ?? null;
  });

  function isLoggedIn(): boolean {
    return isAuthenticated.value && !tokenManager.isTokenExpired();
  }

  return {
    // State
    actualRole,
    actualUsername,
    isAuthenticated,
    // Actions
    handleLogin,
    logOut,
    initializeAuth,
    isAuthInitialized,
    getToken: tokenManager.getToken,
    isTokenExpired: tokenManager.isTokenExpired,
    // Getters
    loggedUser,
    isLoggedIn,
  };
});
