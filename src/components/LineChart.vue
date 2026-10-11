<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
)

const props = defineProps<{
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'line'> | null = null

onMounted(() => {
  if (!canvasRef.value) return
  chart = new Chart(canvasRef.value, {
    type: 'line',
    data: props.data,
    options: props.options,
  })
})

watch(
  () => props.data,
  (newData) => {
    if (chart) {
      chart.data = newData
      chart.update()
    }
  },
  { deep: true },
)

onUnmounted(() => {
  chart?.destroy()
  chart = null
})
</script>

<template>
  <canvas ref="canvasRef" />
</template>
