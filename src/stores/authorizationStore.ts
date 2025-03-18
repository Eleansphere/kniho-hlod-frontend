import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { API_ENDPOINTS } from './apiEndPoints';
import router from '@/router';
import { useUserStore } from './userStore';
import type { User } from '@/types/EntityTypes';

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
                body: JSON.stringify(userCredentials)
            });

            const userData = await response.json();
            if (!response.ok) {
                throw new Error(userData.error);
            } else {
                //            tokenKey.value = userData.token;
                //          setToken(userData.token);
                router.push('/');
                actualUsername.value = userCredentials.email;
                console.log(userCredentials);
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    function logOut() {
        router.push('/login');
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
            useUserStore().entities.find(
                (currentUser) => currentUser.email === actualUsername.value
            ) ?? null
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
        isLoggedIn
    };
});
