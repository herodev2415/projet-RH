<template>
  <div class="alerts">
    <h2>Alertes RH</h2>
    <ul>
      <li
        v-for="(alert, i) in alertes"
        :key="i"
        :class="['alert-item', alert.level]"
        @click="handleClick(alert)"
        title="Cliquez pour voir les détails"
      >
        <span v-if="alert.level === 'critical'">❗</span>
        <span v-else-if="alert.level === 'warning'">⚠️</span>
        <span v-else>ℹ️</span>
        {{ alert.message }}
        <button class="dismiss-btn" @click.stop="dismissAlert(i)">×</button>
      </li>
      <li v-if="alertes.length === 0" class="no-alerts">Aucune alerte pour le moment.</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const alertes = ref([])

function loadData() {
  return {
    employes: JSON.parse(localStorage.getItem('employes') || '[]'),
    conges: JSON.parse(localStorage.getItem('conges') || '[]'),
    evaluations: JSON.parse(localStorage.getItem('evaluations') || '[]'),
    contrats: JSON.parse(localStorage.getItem('contrats') || '[]'),
  }
}

function addAlert(message, level = 'info') {
  alertes.value.push({ message, level })
}

function dismissAlert(index) {
  alertes.value.splice(index, 1)
}

function handleClick(alert) {
  // Exemple : selon le texte ou une propriété, router vers la page concernée
  if (alert.message.includes('contrats')) {
    // router.push('/contrats')  -- si tu importes/use router
    alert('Aller à la page Contrats (fonction à implémenter)')
  }
  // Ajoute d’autres cas selon alert.message ou alert.type
}

onMounted(() => {
  const { employes, conges, evaluations, contrats } = loadData()
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  if (employes.length < 5) {
    addAlert("Moins de 5 employés enregistrés.", "warning")
  }

  const congesToday = conges.filter(c => todayStr >= c.dateDebut && todayStr <= c.dateFin)
  if (congesToday.length > 3) {
    addAlert("Beaucoup d'absences aujourd’hui.", "critical")
  }

  if (evaluations.length === 0) {
    addAlert("Aucune évaluation enregistrée.", "warning")
  }

  // Contrats expirant dans 30 jours
  const in30Days = new Date()
  in30Days.setDate(today.getDate() + 30)
  const in30DaysStr = in30Days.toISOString().split('T')[0]

  const contratsExpirants = contrats.filter(c => c.dateFin && c.dateFin >= todayStr && c.dateFin <= in30DaysStr)
  if (contratsExpirants.length > 0) {
    addAlert(`Il y a ${contratsExpirants.length} contrats expirant dans les 30 prochains jours.`, "critical")
  }

  // Autres alertes possibles ici...
})
</script>

<style scoped>
.alerts {
  background-color: #2c2c2c;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-top: 1.5rem;
}
.alerts h2 {
  color: #ff9800;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
.alert-item {
  color: #ffcc80;
  margin: 0.5rem 0;
  cursor: pointer;
  position: relative;
  padding-right: 1.8rem;
  user-select: none;
}
.alert-item.info {
  color: #90caf9;
}
.alert-item.warning {
  color: #ffb74d;
}
.alert-item.critical {
  color: #e57373;
  font-weight: bold;
}
.dismiss-btn {
  position: absolute;
  right: 0.3rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: inherit;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  user-select: none;
}
.no-alerts {
  color: #888;
  font-style: italic;
  margin-top: 1rem;
}
</style>
