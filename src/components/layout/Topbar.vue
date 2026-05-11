<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { Menu, Bell, X } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore.js';

defineEmits(['toggle-sidebar']);

const route = useRoute();
const auth = useAuthStore();

// Clock
const clock = ref('');
function updateClock() {
  clock.value =
    new Date().toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Manila',
    }) + ' PHT';
}
let clockInterval;
onMounted(() => {
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
});
onUnmounted(() => clearInterval(clockInterval));

// Notifications drawer
const notifOpen = ref(false);
const notifications = [
  {
    title: '⚠️ Critical flood alert issued',
    desc: 'Talisay City — Barangay Bungahin',
    time: '10:42 AM',
  },
  {
    title: '📡 Sensor anomaly detected',
    desc: 'Silay AWS-1 — rainfall spike 68mm/hr',
    time: '10:15 AM',
  },
  {
    title: '🤖 AI prediction updated',
    desc: 'Flash flood probability raised to 74%',
    time: '09:50 AM',
  },
  {
    title: '✅ System health check passed',
    desc: 'All 42 sensors operational',
    time: '09:00 AM',
  },
];

const pageLabel = () => route.meta?.label || 'Dashboard';
</script>

<template>
  <header
    class="h-[60px] min-h-[60px] bg-panel border-b border-border flex items-center px-4 gap-3 z-30 relative"
  >
    <!-- Hamburger -->
    <button
      class="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted hover:bg-hover hover:text-ink transition-all"
      @click="$emit('toggle-sidebar')"
    >
      <Menu :size="18" />
    </button>

    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-[13px] text-muted">
      <span>PDRRMO</span>
      <span class="text-faint">›</span>
      <span class="text-ink font-medium">{{ pageLabel() }}</span>
    </div>

    <!-- Right side -->
    <div class="ml-auto flex items-center gap-2">
      <!-- Clock -->
      <div
        class="hidden sm:block font-mono-custom text-[11.5px] text-muted bg-card border border-border px-3 py-1.5 rounded-lg"
      >
        {{ clock }}
      </div>

      <!-- Notifications -->
      <div class="relative">
        <button
          class="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted hover:bg-hover hover:text-ink transition-all relative"
          @click="notifOpen = !notifOpen"
        >
          <Bell :size="16" />
          <span
            class="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-panel"
          />
        </button>

        <!-- Notification drawer -->
        <Transition name="slide-down">
          <div
            v-if="notifOpen"
            class="absolute right-0 top-11 w-80 bg-panel border border-border rounded-xl shadow-2xl z-50"
          >
            <div
              class="flex items-center justify-between px-4 py-3 border-b border-border"
            >
              <p class="font-semibold text-[13px] text-ink">Notifications</p>
              <button
                class="text-muted hover:text-ink"
                @click="notifOpen = false"
              >
                <X :size="14" />
              </button>
            </div>
            <div class="max-h-72 overflow-y-auto">
              <div
                v-for="(n, i) in notifications"
                :key="i"
                class="flex gap-3 px-4 py-3 border-b border-border/50 hover:bg-hover transition-all cursor-default"
              >
                <div class="flex-1">
                  <p class="text-[12.5px] font-semibold text-ink mb-0.5">
                    {{ n.title }}
                  </p>
                  <p class="text-[11.5px] text-muted">{{ n.desc }}</p>
                </div>
                <p
                  class="text-[11px] text-faint font-mono-custom whitespace-nowrap"
                >
                  {{ n.time }}
                </p>
              </div>
            </div>
            <div class="px-4 py-2">
              <button class="text-[11.5px] text-bright hover:underline">
                Mark all as read
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
