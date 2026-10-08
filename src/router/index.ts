import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import DevicesView from '@/views/DevicesView.vue'
import RunsView from '@/views/RunsView.vue'
import AlertsView from '@/views/AlertsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/devices', name: 'devices', component: DevicesView },
    { path: '/runs', name: 'runs', component: RunsView },
    { path: '/alerts', name: 'alerts', component: AlertsView },
  ],
})

export default router
