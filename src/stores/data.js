import { ref } from 'vue'

// Données partagées
export const contrats = ref([])
export const employes = ref([])


// Méthodes
export const loadData = async () => {
  // Simulation de chargement
  contrats.value = [{id: 1, nom: "Contrat 1"}]
  employes.value = [{id: 1, nom: "Employé 1"}]
}

export const saveContrats = () => {
  console.log("Contrats sauvegardés")
}