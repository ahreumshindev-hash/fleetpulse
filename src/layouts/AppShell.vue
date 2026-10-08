<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'

const menus = [
  { name: 'Dashboard', path: '/' },
  { name: 'Devices', path: '/devices' },
  { name: 'Runs', path: '/runs' },
  { name: 'Alerts', path: '/alerts' },
]

const route = useRoute()
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/devices': 'Devices',
    '/runs': 'Test Runs',
    '/alerts': 'Alerts',
  }
  return titles[route.path] ?? 'FleetPulse'
})
</script>
<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <aside
      class="w-56 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4"
    >
      <h1 class="text-xl font-bold mb-6">FleetPulse</h1>
      <nav class="flex flex-col gap-1">
        <RouterLink
          v-for="menu in menus"
          :key="menu.path"
          :to="menu.path"
          class="rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-gray-100 dark:bg-gray-700 font-semibold"
        >
          {{ menu.name }}
        </RouterLink>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <header
        class="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      >
        <h2 class="text-lg font-semibold">{{ pageTitle }}</h2>
        <ThemeToggle />
      </header>

      <main class="flex-1 p-6 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>
