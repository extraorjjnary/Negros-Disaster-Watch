<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';
import { Eye, EyeOff } from 'lucide-vue-next';

const router = useRouter();
const auth = useAuthStore();
const username = ref('admin');
const password = ref('password');
const remember = ref(true);
const showPw = ref(false);
const loading = ref(false);
const error = ref('');

async function doLogin() {
  error.value = '';
  if (!username.value || !password.value) {
    error.value = 'Please enter your credentials.';
    return;
  }
  loading.value = true;
  await new Promise((r) => setTimeout(r, 800));
  loading.value = false;

  // Demo credentials
  if (
    (username.value === 'admin' || username.value === 'pdrrmo.admin') &&
    password.value === 'password'
  ) {
    auth.login();
    router.push('/dashboard');
  } else {
    error.value = 'Invalid credentials. Use admin / password.';
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-base flex items-center justify-center p-4"
    style="
      background-image:
        radial-gradient(
          ellipse at 20% 50%,
          rgba(30, 64, 175, 0.18) 0%,
          transparent 60%
        ),
        radial-gradient(
          ellipse at 80% 20%,
          rgba(220, 38, 38, 0.08) 0%,
          transparent 50%
        );
    "
  >
    <div class="w-full max-w-md">
      <!-- Header mark -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 text-3xl shadow-xl"
        >
          🛡️
        </div>
        <p class="text-[11px] text-muted uppercase tracking-[2px] mb-1">
          Republic of the Philippines
        </p>
        <p class="text-[11px] text-muted uppercase tracking-[1.5px]">
          Province of Negros Occidental
        </p>
      </div>

      <!-- Card -->
      <div class="bg-panel border border-border rounded-2xl p-8 shadow-2xl">
        <h1 class="font-cond font-bold text-3xl text-gradient-blue mb-1">
          NegrosWatch
        </h1>
        <p class="text-[13.5px] font-medium text-muted mb-1">
          AI & IoT Disaster Early Warning System
        </p>
        <p class="text-[12px] text-faint mb-7">
          Negros Occidental — Authorized Access Only
        </p>

        <!-- Error -->
        <div
          v-if="error"
          class="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 mb-4 text-[12.5px] text-danger"
        >
          {{ error }}
        </div>

        <!-- Username -->
        <div class="mb-4">
          <label
            class="block text-[11.5px] font-semibold text-muted uppercase tracking-wide mb-1.5"
            >Username</label
          >
          <input
            v-model="username"
            type="text"
            placeholder="admin"
            class="w-full bg-card border border-border text-ink px-4 py-2.5 rounded-lg text-[13.5px] placeholder-faint focus:outline-none focus:border-bright focus:bg-hover transition-all"
            @keyup.enter="doLogin"
          />
        </div>

        <!-- Password -->
        <div class="mb-5">
          <label
            class="block text-[11.5px] font-semibold text-muted uppercase tracking-wide mb-1.5"
            >Password</label
          >
          <div class="relative">
            <input
              v-model="password"
              :type="showPw ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full bg-card border border-border text-ink px-4 py-2.5 pr-10 rounded-lg text-[13.5px] placeholder-faint focus:outline-none focus:border-bright focus:bg-hover transition-all"
              @keyup.enter="doLogin"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-muted transition-colors"
              @click="showPw = !showPw"
            >
              <component :is="showPw ? EyeOff : Eye" :size="16" />
            </button>
          </div>
        </div>

        <!-- Remember / Forgot -->
        <div class="flex items-center justify-between mb-6">
          <label
            class="flex items-center gap-2 text-[12.5px] text-muted cursor-pointer"
          >
            <input v-model="remember" type="checkbox" class="accent-bright" />
            Remember me
          </label>
          <button class="text-[12.5px] text-bright hover:underline">
            Forgot password?
          </button>
        </div>

        <!-- Submit -->
        <button
          :disabled="loading"
          class="w-full py-3 bg-primary border border-mid text-white font-semibold text-[14px] rounded-lg hover:bg-mid transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="doLogin"
        >
          <span
            v-if="loading"
            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
          />
          {{ loading ? 'Signing in…' : 'Sign In to System' }}
        </button>

        <p class="text-center text-[11px] text-faint mt-6 leading-relaxed">
          Authorized personnel only. All sessions are logged and monitored.<br />
        </p>
      </div>
    </div>
  </div>
</template>
