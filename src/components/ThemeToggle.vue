<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const isDark = ref(localStorage.getItem('theme') !== 'light')

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
})

function toggleTheme() {
  isDark.value = !isDark.value
}
</script>

<template>
  <button
    @click="toggleTheme"
    class="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    :aria-label="isDark ? 'Change to Light mode' : 'Change to Dark mode'"
  >
    <span v-if="isDark">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>
