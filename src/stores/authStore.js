import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from './userStore';
import { useRouter } from 'vue-router';


export const useAuthStore = defineStore('auth', () => {
    const userStore = useUserStore();
    const router = useRouter();
    const accessToken = ref('');
    const setToken = (token) => { accessToken.value = token; };
    const resetToken = () => { accessToken.value = ''; };
    const logout = () => {
        userStore.resetUser();
        resetToken();
        router.replace({ path: '/' });
    };

    return {
        accessToken,
        setToken,
        resetToken,
        logout,

    };
}, {
    persist: true,
});