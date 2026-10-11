import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import DevicesView from '@/views/DevicesView.vue'
import RunsView from '@/views/RunsView.vue'
import AlertsView from '@/views/AlertsView.vue'
import DeviceDetailView from '@/views/DeviceDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/devices', name: 'devices', component: DevicesView },
    { path: '/devices/:id', name: 'device-detail', component: DeviceDetailView },
    { path: '/runs', name: 'runs', component: RunsView },
    { path: '/alerts', name: 'alerts', component: AlertsView },
  ],
})

export default router
