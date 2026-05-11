import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const user = ref({
    name: 'Jj Daulong',
    role: 'PDRRMO Officer',
    initials: 'JJ',
    username: 'pdrrmo.admin',
  });

  function login() {
    isLoggedIn.value = true;
  }
  function logout() {
    isLoggedIn.value = false;
  }

  return { isLoggedIn, user, login, logout };
});
