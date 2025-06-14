import router from '@/router';
import type { User } from '@/types/entities';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { API_ENDPOINTS } from './apiEndPoints';
import { useBookStore } from './entities/bookStore';
import { useLoanStore } from './entities/loanStore';
import { useUserStore } from './entities/userStore';

export const authorizationStore = defineStore('authorization', () => {
  const apiUrl = API_ENDPOINTS.userLogin;
  //state
  const actualRole = ref('');
  const actualUsername = ref('');
  const isAuthenticated = ref(false);
  const tokenKey = ref('');
  //actions
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

      // nastav tokenKey (důležité)
      tokenKey.value = userData.token;

      setToken(userData.token);
      isAuthenticated.value = true;
      actualUsername.value = userCredentials.email ?? '';

      console.log('✅ Token uložen do localStorage:', getToken());

      await Promise.all([
        useUserStore().fetchEntities(),
        useBookStore().fetchEntities(),
        useLoanStore().fetchEntities(),
      ]);

      router.push('/home');
    } catch (error) {
      console.error('🔥 Chyba při loginu:', error);
    }
  }

  function logOut() {
    router.push('/login');
    removeToken();
    isAuthenticated.value = false;
  }

  function setToken(token: string) {
    localStorage.setItem(tokenKey.value, token);
  }

  // Získání tokenu
  function getToken() {
    return localStorage.getItem(tokenKey.value);
  }

  // Odstranění tokenu (logout)
  function removeToken() {
    localStorage.removeItem(tokenKey.value);
  }

  //getters

  const loggedUser = computed<User | null>(() => {
    return (
      useUserStore().entities.find((currentUser) => currentUser.email === actualUsername.value) ??
      null
    );
  });
  function isLoggedIn() {
    return isAuthenticated.value;
  }

  return {
    //state
    actualRole,
    actualUsername,
    isAuthenticated,
    //actions
    handleLogin,
    logOut,
    setToken,
    getToken,
    removeToken,
    //getters
    loggedUser,
    isLoggedIn,
  };
});
