<template>
  <section class="dashboard">
    <h1>Tableau de bord</h1>
    <p>Bienvenue sur votre espace de gestion RH.</p>

    <div class="stats">
      <CardStat
        v-for="(item, index) in stats"
        :key="index"
        :title="item.label"
        :value="item.value"
        :color="item.color"
      />
    </div>

    <div class="widgets">
      <CongesChart />
      <AlertsRH />
      <QuickActions />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import cardStat from '@/components/cardStat.vue'
import CongesChart from '@/components/CongesChart.vue'
import AlertsRH from '@/components/AlertsRH.vue'
import QuickActions from '@/components/QuickActions.vue'
import { conges, employes, presences, evaluations } from '../stores/data.js'




function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim()
}

const today = new Date().toISOString().split('T')[0]

onMounted(() => {
  employes.value = JSON.parse(localStorage.getItem('employes') || '[]')
  presences.value = JSON.parse(localStorage.getItem('presences') || '[]')
  conges.value = JSON.parse(localStorage.getItem('conges') || '[]')
  evaluations.value = JSON.parse(localStorage.getItem('evaluations') || '[]')
})

const nombreEmployes = computed(() => employes.value.length)
const nombrePresents = computed(() =>
  presences.value.filter(p => {
    if (!p.date || !p.statut) return false
    const presenceDate = p.date.split('T')[0]
    return presenceDate === today && normalize(p.statut) === 'present'
  }).length
)
const nombreConges = computed(() =>
  conges.value.filter(c => today >= c.dateDebut && today <= c.dateFin).length
)
const nombreEvaluations = computed(() => evaluations.value.length)

const stats = computed(() => [
  { label: "Employés", value: nombreEmployes.value, color: "#1e88e5" },
  { label: "Congés en cours", value: nombreConges.value, color: "#f4511e" },
  { label: "Présences aujourd'hui", value: nombrePresents.value, color: "#43a047" },
  { label: "Évaluations", value: nombreEvaluations.value, color: "#9c27b0" }
])
</script>

<style scoped>
.dashboard {
  padding: 1rem 1rem 0.5rem 1rem;
  color: #e0e0e0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* plus de scroll global */
  box-sizing: border-box;
}

h1 {
  color: #ffffff;
  font-size: 1.8rem;
  margin-bottom: 0.3rem;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #bbbbbb;
  font-size: 1rem;
}

.stats {
  display: flex;
  gap: 0.8rem;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.stats >>> .stat-card {
  flex: 1 1 150px;
  padding: 1rem 1rem;
  font-size: 0.85rem;
  min-height: 80px;
}

.stats >>> .stat-card h2 {
  font-size: 1rem;
}

.stats >>> .stat-card p {
  font-size: 1.5rem;
}

.widgets {
  display: flex;
  gap: 1rem;
  flex: 1;
  overflow: hidden; /* plus de scroll dans widgets */
  min-height: 0;
  flex-direction: column;
}

@media (min-width: 900px) {
  .widgets {
    flex-direction: row;
  }
}

.widgets > * {
  flex: 1;
  height: 240px; /* hauteur fixe réduite */
  overflow: hidden;
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
}

/* Limite la taille du canvas dans CongesChart */
.widgets canvas {
  max-height: 200px !important;
  max-width: 100% !important;
}
</style>
