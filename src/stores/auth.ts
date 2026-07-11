import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types';

function getUserFromStorage(): User | null {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(getUserFromStorage());
  const token = ref<string>(localStorage.getItem('token') || '');
  const isLogin = computed(() => !!(user.value && token.value));

  function saveUserInfo(data: { user: User; token: string }) {
    user.value = data.user;
    token.value = data.token;
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  }

  function deleteUserInfo() {
    user.value = null;
    token.value = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  return { user, token, isLogin, saveUserInfo, deleteUserInfo };
});
