<script setup>
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import Topbar from './Topbar.vue';

const collapsed = ref(false);
const mobileOpen = ref(false);

function toggleSidebar() {
  if (window.innerWidth < 1024) mobileOpen.value = !mobileOpen.value;
  else collapsed.value = !collapsed.value;
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-base">
    <Sidebar
      :collapsed="collapsed"
      :mobile-open="mobileOpen"
      @close-mobile="mobileOpen = false"
      @toggle-collapse="collapsed = !collapsed"
    />
    <div class="flex flex-col flex-1 overflow-hidden min-w-0">
      <Topbar @toggle-sidebar="toggleSidebar" />
      <main class="flex-1 overflow-y-auto bg-base">
        <div class="p-4 lg:p-6 max-w-[1600px] mx-auto">
          <RouterView v-slot="{ Component }">
            <Transition name="page-fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </main>
    </div>
  </div>
</template>
