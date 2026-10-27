import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'

import { useDeviceStore } from './stores/devices'
import { useRunsStore } from './stores/runs'
import { useAlertsStore } from './stores/alerts'

import { api } from './api'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

const devicesStore = useDeviceStore(pinia)
const runsStore = useRunsStore(pinia)
const alertsStore = useAlertsStore(pinia)

Promise.all([api.getDevices(), api.getRuns(), api.getAlerts()])
  .then(([devices, runs, alerts]) => {
    devicesStore.setDevices(devices)
    runsStore.setRuns(runs)
    alertsStore.setAlerts(alerts)
  })
  .catch((err) => console.error('Failed to load initial data', err))
