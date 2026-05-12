<script setup>
import { useRoute, useRouter } from 'vue-router';
import {
  LayoutDashboard,
  Radio,
  Bot,
  Bell,
  BarChart2,
  MapPin,
  LogOut,
  ChevronLeft,
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore.js';

const props = defineProps({
  collapsed: { type: Boolean, default: false },
});
const emit = defineEmits(['close-mobile', 'toggle-collapse']);

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const navItems = [
  { section: 'Main' },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { to: '/monitoring', label: 'Real-time Monitoring', icon: Radio, badge: 3 },
  { section: 'Intelligence' },
  { to: '/predictions', label: 'AI Predictions', icon: Bot, badge: null },
  { to: '/alerts', label: 'Alert Log', icon: Bell, badge: 7 },
  { section: 'Reports' },
  {
    to: '/reports',
    label: 'Analytics & Reports',
    icon: BarChart2,
    badge: null,
  },
  { to: '/evacuation', label: 'Evacuation Guide', icon: MapPin, badge: null },
];

// Reactive active check — re-evaluates on every render when route changes
const isActive = (to) => route.path === to;

function navigate(to) {
  router.push(to);
  emit('close-mobile'); // close drawer on mobile after tap
}

function logout() {
  auth.logout();
  router.push('/login');
}
</script>

<template>
  <aside
    class="flex flex-col h-full bg-panel border-r border-border overflow-hidden"
    :style="{ width: collapsed ? '64px' : '260px' }"
  >
    <!-- Brand -->
    <div
      class="flex items-center gap-3 px-3 py-4 border-b border-border min-h-[60px] overflow-hidden"
    >
      <div
        class="flex-shrink-0 w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-xl select-none"
      >
        🛡️
      </div>
      <Transition name="fade-text">
        <div v-if="!collapsed" class="overflow-hidden min-w-0">
          <p
            class="font-cond font-bold text-[13px] leading-tight text-ink tracking-wide uppercase whitespace-nowrap"
          >
            NegrosWatch
          </p>
          <p class="text-[10px] text-muted whitespace-nowrap">
            Disaster Early Warning System
          </p>
        </div>
      </Transition>
    </div>

    <!-- Nav items -->
    <nav class="flex-1 overflow-y-auto px-2 py-3">
      <template v-for="item in navItems" :key="item.section ?? item.to">
        <!-- Section heading -->
        <p
          v-if="item.section"
          class="text-[10px] font-semibold uppercase tracking-[1.5px] text-faint px-2 pb-1 whitespace-nowrap overflow-hidden transition-all"
          :class="collapsed ? 'opacity-0 h-0 py-0' : 'pt-3'"
        >
          {{ item.section }}
        </p>

        <!-- Nav button -->
        <button
          v-else
          class="nav-item w-full"
          :class="{ active: isActive(item.to) }"
          @click="navigate(item.to)"
        >
          <component :is="item.icon" :size="18" class="flex-shrink-0" />
          <Transition name="fade-text">
            <span
              v-if="!collapsed"
              class="flex items-center gap-2 flex-1 whitespace-nowrap overflow-hidden min-w-0"
            >
              <span class="truncate">{{ item.label }}</span>
              <span
                v-if="item.badge"
                class="ml-auto flex-shrink-0 bg-danger text-white text-[10px] font-bold rounded-full px-1.5 min-w-[18px] text-center"
              >
                {{ item.badge }}
              </span>
            </span>
          </Transition>
        </button>
      </template>
    </nav>

    <!-- Collapse toggle (desktop only) -->
    <button
      class="hidden lg:flex items-center justify-center gap-2 mx-2 mb-1 py-2 rounded-lg text-faint hover:text-muted hover:bg-hover transition-all text-[11px]"
      @click="$emit('toggle-collapse')"
    >
      <ChevronLeft
        :size="14"
        class="transition-transform duration-300"
        :class="{ 'rotate-180': collapsed }"
      />
      <span v-if="!collapsed">Collapse</span>
    </button>

    <!-- User + logout -->
    <div class="border-t border-border p-2">
      <div
        class="flex items-center gap-2.5 px-2 py-2 rounded-lg overflow-hidden"
      >
        <div
          class="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white"
        >
          {{ auth.user.initials }}
        </div>
        <Transition name="fade-text">
          <div v-if="!collapsed" class="flex-1 overflow-hidden min-w-0">
            <p class="text-[12.5px] font-semibold text-ink truncate">
              {{ auth.user.name }}
            </p>
            <p class="text-[10.5px] text-muted truncate">
              {{ auth.user.role }}
            </p>
          </div>
        </Transition>
      </div>
      <button
        class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg mt-1 text-muted text-[13px] font-medium hover:bg-hover hover:text-danger transition-all overflow-hidden"
        @click="logout"
      >
        <LogOut :size="16" class="flex-shrink-0" />
        <Transition name="fade-text">
          <span v-if="!collapsed" class="whitespace-nowrap">Sign Out</span>
        </Transition>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.fade-text-enter-active,
.fade-text-leave-active {
  transition: opacity 0.15s ease;
}
.fade-text-enter-from,
.fade-text-leave-to {
  opacity: 0;
}
</style>
