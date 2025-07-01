<template>
  <div class="contrat-container">
    <!-- Bouton pour afficher le formulaire d'ajout -->
    <div class="contrat-header">
      <button v-if="!formVisible && editIndex === null" @click="afficherFormulaire" class="add-contrat-btn">
        Ajouter un contrat
      </button>
    </div>

    <!-- Formulaire d'ajout -->
    <div v-if="formVisible && editIndex === null" class="contrat-form">
      <button class="form-close" @click="fermerFormulaire">×</button>
      <h2>Ajouter un contrat</h2>
      <form @submit.prevent="ajouterContrat">
        <div style="position: relative;">
          <input v-model="form.nom" @input="updateSuggestions" type="text" placeholder="Nom complet de l’employé" required autocomplete="off" />
          <ul v-if="suggestions.length" class="autocomplete-list">
            <li v-for="(s, i) in suggestions" :key="i" @click="selectSuggestion(s.nom + ' ' + s.prenom)">
              {{ s.nom }} {{ s.prenom }}
            </li>
          </ul>
        </div>

        <select v-model="form.type" required @change="onTypeChange">
          <option disabled value="">Type de contrat</option>
          <option>CDI</option>
          <option>CDD</option>
          <option>Stage</option>
        </select>

        <label>Date de début</label>
        <input v-model="form.dateDebut" type="date" required />

        <label v-if="form.type !== 'CDI'">Date de fin</label>
        <input v-if="form.type !== 'CDI'" v-model="form.dateFin" type="date" />

        <button type="submit">Ajouter</button>
        <p v-if="message" class="message-success">{{ message }}</p>
      </form>
    </div>

    <!-- Popup de modification -->
    <transition name="fade">
      <div v-if="formVisible && editIndex !== null" class="modal-overlay" @click.self="fermerFormulaire">
        <div class="modal-content" @click.stop>
          <button class="form-close" @click="fermerFormulaire">×</button>
          <h2>Modifier ou Renouveler un contrat</h2>
          <form @submit.prevent="ajouterContrat">
            <div style="position: relative;">
              <input v-model="form.nom" @input="updateSuggestions" type="text" placeholder="Nom complet de l’employé" required autocomplete="off" />
              <ul v-if="suggestions.length" class="autocomplete-list">
                <li v-for="(s, i) in suggestions" :key="i" @click="selectSuggestion(s.nom + ' ' + s.prenom)">
                  {{ s.nom }} {{ s.prenom }}
                </li>
              </ul>
            </div>

            <select v-model="form.type" required @change="onTypeChange">
              <option disabled value="">Type de contrat</option>
              <option>CDI</option>
              <option>CDD</option>
              <option>Stage</option>
            </select>

            <label>Date de début</label>
            <input v-model="form.dateDebut" type="date" required />

            <label v-if="form.type !== 'CDI'">Date de fin</label>
            <input v-if="form.type !== 'CDI'" v-model="form.dateFin" type="date" />

            <button type="submit">Enregistrer les modifications</button>
            <p v-if="message" class="message-success">{{ message }}</p>
          </form>
        </div>
      </div>
    </transition>

    <!-- Liste -->
    <div class="contrat-liste">
      <div class="contrat-bloc" v-for="type in ['CDI', 'CDD', 'Stage']" :key="type">
        <h3 class="liste-titre">{{ type }}</h3>
        <ul>
          <li v-for="c in contratsParType(type)" :key="c.globalIndex" class="employe-item">
            <div class="employee-avatar" :style="{ background: `linear-gradient(135deg, ${stringToColor(c.nom)} 0%, ${stringToColor(c.nom.split(' ')[1] || '')} 100%)` }" @click="modifierContratDepuisListe(c.globalIndex)">
              {{ getInitials(c.nom) }}
            </div>
            <div @click="modifierContratDepuisListe(c.globalIndex)" class="employe-nom">
              {{ c.nom }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { employes, contrats } from '../stores/data.js'


const form = ref({ nom: '', type: '', dateDebut: '', dateFin: '' })
const suggestions = ref([])
const editIndex = ref(null)
const message = ref('')
const formVisible = ref(false)

function resetForm() {
  form.value = { nom: '', type: '', dateDebut: '', dateFin: '' }
  suggestions.value = []
  message.value = ''
}

function ajouterContrat() {
  if (editIndex.value === null) {
    contrats.value.push({ ...form.value })
    message.value = 'Contrat ajouté ✅'
  } else {
    contrats.value[editIndex.value] = { ...form.value }
    message.value = 'Contrat modifié ✅'
    editIndex.value = null
  }
  // Mise à jour de l'employé
  const [nom, prenom] = form.value.nom.split(' ')
  const indexEmp = employes.value.findIndex(e => e.nom === nom && e.prenom === prenom)
  if (indexEmp !== -1) {
    employes.value[indexEmp].contrat = form.value.type
    employes.value[indexEmp].dateEmbauche = form.value.dateDebut
    localStorage.setItem('employes', JSON.stringify(employes.value))
  }

  localStorage.setItem('contrats', JSON.stringify(contrats.value))
  resetForm()
  formVisible.value = false
  setTimeout(() => (message.value = ''), 3000)
}

function modifierContratDepuisListe(globalIndex) {
  form.value = { ...contrats.value[globalIndex] }
  editIndex.value = globalIndex
  formVisible.value = true
}

function updateSuggestions() {
  const query = form.value.nom.toLowerCase()
  suggestions.value = query
    ? employes.value.filter(e => (`${e.nom} ${e.prenom}`).toLowerCase().includes(query)).slice(0, 5)
    : []
}

function selectSuggestion(fullName) {
  form.value.nom = fullName
  suggestions.value = []
}

function afficherFormulaire() {
  resetForm()
  editIndex.value = null
  formVisible.value = true
}

function fermerFormulaire() {
  formVisible.value = false
  resetForm()
  editIndex.value = null
}

function contratsParType(type) {
  return contrats.value
    .map((c, index) => ({ ...c, globalIndex: index }))
    .filter(c => c.type === type)
    .sort((a, b) => a.nom.localeCompare(b.nom))
}

function onTypeChange() {
  if (form.value.type === 'CDI') form.value.dateFin = ''
}

function stringToColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 70%, 60%)`
}

function getInitials(nomComplet) {
  const [nom, prenom] = nomComplet.split(' ')
  return (prenom?.charAt(0) || '') + (nom?.charAt(0) || '')
}
</script>
<style scoped>
.contrat-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #121212;
  border-radius: 14px;
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.2);
  color: #eee;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.contrat-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.add-contrat-btn {
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  background-color: #00bcd4;
  color: white;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 12px #00bcd4aa;
  transition: background-color 0.3s ease;
}

.add-contrat-btn:hover {
  background-color: #0097a7;
}

.contrat-form {
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: inset 0 0 8px #00bcd4aa;
  position: relative;
}

.form-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #00bcd4;
  cursor: pointer;
}

input,
select {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: none;
  background-color: #292929;
  color: white;
  font-size: 1rem;
  box-shadow: inset 0 0 6px #00bcd4aa;
}

button[type='submit'] {
  width: 100%;
  padding: 1rem;
  background-color: #00bcd4;
  color: white;
  font-weight: 700;
  border-radius: 14px;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type='submit']:hover {
  background-color: #0097a7;
}

.message-success {
  color: #00ff99;
  margin-top: 1rem;
  text-align: center;
}

.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #2c2c2c;
  border: 1px solid #00bcd4;
  border-radius: 8px;
  max-height: 160px;
  overflow-y: auto;
  z-index: 10;
}

.autocomplete-list li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #eee;
}

.autocomplete-list li:hover {
  background-color: #00bcd4;
  color: #000;
}

.contrat-liste {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.contrat-bloc {
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 1.5rem;
  flex: 1;
  min-width: 280px;
  box-shadow: inset 0 0 8px #00bcd4aa;
}

.liste-titre {
  color: #00bcd4;
  font-weight: 700;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #00bcd4;
  padding-bottom: 0.3rem;
  text-align: center;
}

.employe-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
  background: #1e1e1e;
  padding: 10px;
  border-radius: 12px;
  justify-content: flex-start;
}

.employe-item:hover {
  background-color: #374151;
}

.employee-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 0 6px #00bcd4aa;
  cursor: pointer;
}

.employe-nom {
  font-weight: 600;
  font-size: 1.1rem;
  user-select: none;
  cursor: pointer;
  flex-grow: 1;
}

/* Animation fade popup */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Styles pour popup modal (modification) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: inset 0 0 8px #00bcd4aa;
  position: relative;
}
</style>
