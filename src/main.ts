import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'

import { useDeviceStore } from './stores/devices'
import { useRunsStore } from './stores/runs'
import { createMockDevices, createMockRuns } from './data/mocks'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

useDeviceStore(pinia).setDevices(createMockDevices())
useRunsStore(pinia).setRuns(createMockRuns())

app.mount('#app')
