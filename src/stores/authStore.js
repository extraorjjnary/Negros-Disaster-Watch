import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Restore session from storage on init
  const isLoggedIn = ref(sessionStorage.getItem('nw_auth') === '1');

  const user = ref({
    name: 'Jj Daulong',
    role: 'System Operator',
    initials: 'JJ',
    username: 'admin',
  });

  function login() {
    isLoggedIn.value = true;
    sessionStorage.setItem('nw_auth', '1');
  }
  function logout() {
    isLoggedIn.value = false;
    sessionStorage.removeItem('nw_auth');
  }

  return { isLoggedIn, user, login, logout };
});
