<template>
  <section class="page presences">
    <h1>Gestion des Présences</h1>

    <div class="presence-lists">
      <div class="list-container">
        <h2>Présents</h2>
        <ul>
          <li v-for="p in presencesPresentes" :key="p.id" class="employee-item">
            <div
              class="employee-avatar"
              :style="{
                background: `linear-gradient(135deg, ${stringToColor(p.employe)} 0%, ${stringToColor(getSecondName(p.employe))} 100%)`
              }"
            >
              {{ getInitials(p.employe) }}
            </div>
            <span class="employee-name">{{ p.employe }}</span>
          </li>
        </ul>
        <p v-if="presencesPresentes.length === 0" class="no-data">Aucun employé présent.</p>
      </div>

      <div class="list-container">
        <h2>Absents</h2>
        <ul>
          <li v-for="p in presencesAbsents" :key="p.id" class="employee-item">
            <div
              class="employee-avatar"
              :style="{
                background: `linear-gradient(135deg, ${stringToColor(p.employe)} 0%, ${stringToColor(getSecondName(p.employe))} 100%)`
              }"
            >
              {{ getInitials(p.employe) }}
            </div>
            <span class="employee-name">{{ p.employe }}</span>
          </li>
        </ul>
        <p v-if="presencesAbsents.length === 0" class="no-data">Aucun employé absent.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const presences = ref([])

onMounted(() => {
  const sauvegarde = localStorage.getItem('presences')
  presences.value = sauvegarde ? JSON.parse(sauvegarde) : []
})

const presencesPresentes = computed(() =>
  presences.value
    .filter(p => p.statut.toLowerCase() === 'présent')
    .sort((a, b) => a.employe.localeCompare(b.employe))
)

const presencesAbsents = computed(() =>
  presences.value
    .filter(p => p.statut.toLowerCase() === 'absent')
    .sort((a, b) => a.employe.localeCompare(b.employe))
)

// Utilitaires pour avatar
function stringToColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 70%, 60%)`
}

function getInitials(fullName) {
  const parts = fullName.trim().split(' ')
  const firstInitial = parts[0]?.charAt(0).toUpperCase() || ''
  const secondInitial = parts[1]?.charAt(0).toUpperCase() || ''
  return firstInitial + secondInitial
}

function getSecondName(fullName) {
  const parts = fullName.trim().split(' ')
  return parts[1] || parts[0] || ''
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Segoe+UI&display=swap');

.page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #121212;
  border-radius: 14px;
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.25);
  color: #eee;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  margin-bottom: 2rem;
  font-weight: 700;
  color: #00bcd4;
  text-align: center;
  user-select: none;
}

.presence-lists {
  display: flex;
  gap: 3rem;
  justify-content: center;
}

.list-container {
  background-color: #1f1f1f;
  padding: 1.5rem 1.8rem;
  border-radius: 14px;
  box-shadow: inset 0 0 8px #00bcd4aa;
  flex: 1;
  max-width: 400px;
  color: #eee;
}

.list-container h2 {
  margin-bottom: 1.2rem;
  font-weight: 700;
  color: #00bcd4;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  user-select: none;
}

.list-container ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.employee-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 1rem;
  margin-bottom: 0.6rem;
  background: linear-gradient(135deg, #00bcd4 0%, #008b99 100%);
  border-radius: 12px;
  font-weight: 700;
  color: #121212;
  user-select: text;
  box-shadow: 0 3px 8px #00bcd4aa;
  cursor: default;
  transition: background-color 0.3s ease;
}

.employee-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: white;
  font-weight: 900;
  font-size: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  user-select: none;
  box-shadow: 0 0 10px #00bcd4bb;
}

.employee-name {
  flex-grow: 1;
  user-select: text;
}

.no-data {
  font-style: italic;
  color: #777;
  text-align: center;
  margin-top: 1rem;
  user-select: none;
}
</style>
