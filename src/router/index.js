import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/Dashboard.vue'),
        meta: { label: 'Dashboard' },
      },
      {
        path: 'monitoring',
        component: () => import('@/pages/Monitoring.vue'),
        meta: { label: 'Real-time Monitoring' },
      },
      {
        path: 'predictions',
        component: () => import('@/pages/Predictions.vue'),
        meta: { label: 'AI Predictions' },
      },
      {
        path: 'alerts',
        component: () => import('@/pages/Alerts.vue'),
        meta: { label: 'Alert Log' },
      },
      {
        path: 'reports',
        component: () => import('@/pages/Reports.vue'),
        meta: { label: 'Analytics & Reports' },
      },
      {
        path: 'evacuation',
        component: () => import('@/pages/Evacuation.vue'),
        meta: { label: 'Evacuation Guide' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!to.meta.public && !auth.isLoggedIn) return '/login';
  if (to.path === '/login' && auth.isLoggedIn) return '/dashboard';
});

export default router;
