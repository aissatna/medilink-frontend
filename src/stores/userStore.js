import { defineStore } from 'pinia';
import { reactive } from 'vue';
import UserService from '@/api/services/UserService';

export const useUserStore = defineStore('user', () => {

  const userInfo = reactive({
    id: '',
    lastName: '',
    firstName: '',
    email: '',
    roleName: '',
    photoUrl: '',
    cabinetName: '',
    cabinetAddress: '',


  });

  const getUserInfo = async () => {
    try {
      const data = (await UserService.getCurrentUser()).data;
      Object.assign(userInfo, { ...data });

    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const resetUser = () => {
    Object.keys(userInfo).forEach(key => {
      userInfo[key] = '';
    });
  };
  return {
    userInfo,
    getUserInfo,
    resetUser,
  };
}, {
  persist: true,// Enables persistence
});