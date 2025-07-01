// store.js
import { ref, watch  } from 'vue'

export const employes = ref(JSON.parse(localStorage.getItem('employes') || '[]'))
export const contrats = ref(JSON.parse(localStorage.getItem('contrats') || '[]'))
export const conges = ref(JSON.parse(localStorage.getItem('conges') || '[]'))
export const evaluations = ref(JSON.parse(localStorage.getItem('evaluations') || '[]'))
export const presences = ref(JSON.parse(localStorage.getItem('presences') || '[]'))  // <-- Ajoute cette ligne

// Sauvegarder automatiquement dans localStorage à chaque modification
watch(employes, (val) => {
  localStorage.setItem('employes', JSON.stringify(val))
}, { deep: true })

watch(contrats, (val) => {
  localStorage.setItem('contrats', JSON.stringify(val))
}, { deep: true })

watch(conges, (val) => {
  localStorage.setItem('conges', JSON.stringify(val))
}, { deep: true })
