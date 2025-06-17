<template>
  <div class="chart-card">
    <canvas ref="canvas" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart, BarElement, BarController, CategoryScale, LinearScale } from 'chart.js'

Chart.register(BarElement, BarController, CategoryScale, LinearScale)

const canvas = ref(null)

const chartData = {
  labels: ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin'],
  datasets: [{
    label: 'Congés pris',
    data: [2, 4, 6, 1, 3, 5],
    backgroundColor: '#03dac6'
  }]
}

onMounted(() => {
  new Chart(canvas.value, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false, // important pour contrôle hauteur
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: '#ffffff' } },
        y: { ticks: { color: '#ffffff' } }
      }
    }
  })
})
</script>

<style scoped>
.chart-card {
  background-color: #1f1f1f;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  height: 180px; /* Hauteur plus petite */
  max-width: 350px; /* Limiter largeur */
}

/* forcer le canvas à remplir le container */
canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
