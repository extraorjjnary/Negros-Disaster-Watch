<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './Sidebar.vue';
import Topbar from './Topbar.vue';
import { useSensorStore } from '@/stores/sensorStore.js';

const route = useRoute();
const collapsed = ref(false);
const mobileOpen = ref(false);
const sensorStore = useSensorStore();

let ticker = null;
onMounted(() => {
  ticker = setInterval(() => sensorStore.tick(), 5000);
});
onUnmounted(() => {
  if (ticker) clearInterval(ticker);
});

function toggleSidebar() {
  if (window.innerWidth < 1024) mobileOpen.value = !mobileOpen.value;
  else collapsed.value = !collapsed.value;
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-base">
    <!-- Mobile backdrop -->
    <Transition name="fade">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 bg-black/60 z-40 lg:hidden"
        @click="mobileOpen = false"
      />
    </Transition>

    <!-- Sidebar — fixed on mobile, inline flex on desktop -->
    <div
      class="hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden"
      :style="{ width: collapsed ? '64px' : '260px' }"
    >
      <Sidebar
        :collapsed="collapsed"
        @toggle-collapse="collapsed = !collapsed"
      />
    </div>

    <!-- Mobile sidebar drawer -->
    <div
      class="fixed inset-y-0 left-0 lg:hidden z-50 transition-transform duration-300 w-[260px]"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <Sidebar :collapsed="false" @close-mobile="mobileOpen = false" />
    </div>

    <!-- Main area -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <Topbar @toggle-sidebar="toggleSidebar" />

      <!-- ⚡ KEY FIX: route.fullPath as key forces re-mount on every navigation -->
      <main class="flex-1 overflow-y-auto bg-base">
        <div class="p-4 lg:p-6 max-w-[1600px] mx-auto">
          <RouterView :key="route.fullPath" />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
