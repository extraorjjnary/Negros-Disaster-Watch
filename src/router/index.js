import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { public: true, label: 'Sign In' },
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue'),
        meta: { label: 'Dashboard' },
      },
      {
        path: 'monitoring',
        name: 'Monitoring',
        component: () => import('@/pages/Monitoring.vue'),
        meta: { label: 'Real-time Monitoring' },
      },
      {
        path: 'predictions',
        name: 'Predictions',
        component: () => import('@/pages/Predictions.vue'),
        meta: { label: 'AI Predictions & Warnings' },
      },
      {
        path: 'alerts',
        name: 'Alerts',
        component: () => import('@/pages/Alerts.vue'),
        meta: { label: 'Alert & Notification Log' },
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/pages/Reports.vue'),
        meta: { label: 'Analytics & Reports' },
      },
      {
        path: 'evacuation',
        name: 'Evacuation',
        component: () => import('@/pages/Evacuation.vue'),
        meta: { label: 'Evacuation Guide' },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!to.meta.public && !auth.isLoggedIn) return { name: 'Login' };
  if (to.name === 'Login' && auth.isLoggedIn) return { name: 'Dashboard' };
});

export default router;
