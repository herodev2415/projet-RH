<template>
  <section class="dashboard">
    <h1>Tableau de bord</h1>
    <p>Bienvenue sur votre espace de gestion RH.</p>
    <div class="stats">
      <div class="stat-card" v-for="(item, index) in stats" :key="index">
        <h2>{{ item.label }}</h2>
        <p>{{ item.value }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const employes = ref([])
const presences = ref([])
const conges = ref([])
const evaluations = ref([])

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
  { label: "Employés", value: nombreEmployes.value },
  { label: "Congés en cours", value: nombreConges.value },
  { label: "Présences aujourd'hui", value: nombrePresents.value },
  { label: "Évaluations", value: nombreEvaluations.value }
])
</script>

<style scoped>
.dashboard {
  padding: 1.5rem 2rem;
  color: #e0e0e0;
}

h1 {
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.stat-card {
  background: #212121;
  border-radius: 12px;
  padding: 1.5rem;
  flex: 1 1 220px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s;
  text-align: center;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card h2 {
  color: #bbbbbb;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.stat-card p {
  color: #03dac6;
  font-size: 2.2rem;
  margin: 0;
  font-weight: bold;
}
</style>
