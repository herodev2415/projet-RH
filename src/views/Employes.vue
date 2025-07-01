<template>
  <div class="employe-container">
    <!-- Colonne Gauche : Liste des employés -->
    <div class="employe-liste" style="flex: 2;">
      <!-- En-tête avec barre de recherche, filtre et bouton -->
      <div class="liste-header">
        <div class="search-filters">
          <input type="text" v-model="search" placeholder="Rechercher..." class="search-input" />
          <select v-model="departementFiltre" class="search-input">
            <option value="">Tous les départements</option>
            <option v-for="dep in departementsDisponibles" :key="dep">{{ dep }}</option>
          </select>
        </div>
        <button
          v-if="!formVisible"
          @click="afficherFormulaire"
          class="add-employe-btn"
          aria-label="Ajouter un employé"
        >
          Ajouter un employé
        </button>
      </div>

      <h3 class="liste-titre">Liste des employés</h3>

      <ul class="employe-list-ul">
        <li v-for="(emp, index) in filteredEmployes" :key="index">
          <div class="employe-nom-container">
            <div
              class="employee-avatar"
              :style="{
                background: `linear-gradient(135deg, ${stringToColor(emp.nom)} 0%, ${stringToColor(emp.prenom)} 100%)`
              }"
            >
              {{ emp.prenom.charAt(0) }}{{ emp.nom.charAt(0) }}
            </div>
            <strong
              @click="openModal(emp, index)"
              class="employe-nom"
              tabindex="0"
              @keyup.enter="openModal(emp, index)"
            >
              {{ emp.nom }} {{ emp.prenom }}
            </strong>
          </div>
        </li>
      </ul>
    </div>

    <!-- Colonne Droite : Formulaire d'ajout/modification -->
    <div v-if="formVisible" class="employe-form" style="flex: 3; position: relative;">
      <button class="form-close" @click="formVisible = false" aria-label="Fermer le formulaire" title="Fermer">
        ×
      </button>

      <h2>{{ editIndex === null ? 'Ajouter un employé' : 'Modifier un employé' }}</h2>
      <form @submit.prevent="ajouterEmploye">
        <div class="form-section">
          <h3>Identité</h3>
          <input v-model="form.nom" type="text" placeholder="Nom" required />
          <input v-model="form.prenom" type="text" placeholder="Prénom" required />
          <select v-model="form.sexe" required>
            <option value="" disabled>Sexe</option>
            <option>Homme</option>
            <option>Femme</option>
          </select>
          <input v-model="form.dateNaissance" type="date" />
        </div>

        <div class="form-section">
          <h3>Coordonnées</h3>
          <input v-model="form.email" type="email" placeholder="Email professionnel" />
          <input v-model="form.telephone" type="tel" placeholder="Téléphone" />
        </div>

        <div class="form-section">
          <h3>Situation professionnelle</h3>
          <input v-model="form.poste" type="text" placeholder="Poste" required />
          <input v-model="form.departement" type="text" placeholder="Département" />
        </div>

        <div class="form-section">
          <h3>Compétences</h3>
          <div class="skills-input">
            <input v-model="newSkill" type="text" placeholder="Ajouter une compétence" @keyup.enter="ajouterCompetence" />
            <button type="button" @click="ajouterCompetence">+</button>
          </div>
          <div class="skills-tags">
            <span v-for="(skill, i) in form.competences" :key="i" class="skill-tag">
              {{ skill }}
              <button type="button" @click="supprimerCompetence(i)">✕</button>
            </span>
          </div>
        </div>

        <button type="submit">{{ editIndex === null ? 'Ajouter' : 'Enregistrer les modifications' }}</button>
        <p v-if="message" style="color: #00ff99; margin-top: 1rem;">{{ message }}</p>
      </form>
    </div>

    <!-- Modal -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content" tabindex="-1" ref="modalContent">
          <button class="modal-close" @click="closeModal" aria-label="Fermer">&times;</button>
          <div class="modal-body">
            <div class="modal-header">
              <h1>{{ selectedEmploye.prenom }} {{ selectedEmploye.nom }}</h1>
            </div>

            <div class="info-section">
              <p><strong>Sexe :</strong> {{ selectedEmploye.sexe || 'Non renseigné' }}</p>
              <p><strong>Date de naissance :</strong> {{ selectedEmploye.dateNaissance || 'Non renseignée' }}</p>
            </div>

            <div class="info-section">
              <p><strong>Email :</strong> {{ selectedEmploye.email || 'Non renseigné' }}</p>
              <p><strong>Téléphone :</strong> {{ selectedEmploye.telephone || 'Non renseigné' }}</p>
            </div>

            <div class="info-section">
              <p><strong>Poste :</strong> {{ selectedEmploye.poste || 'Non renseigné' }}</p>
              <p><strong>Département :</strong> {{ selectedEmploye.departement || 'Non renseigné' }}</p>
              <p><strong>Contrat :</strong> {{ selectedEmploye.contrat || 'Non renseigné' }}</p>
              <p><strong>Date d'embauche :</strong> {{ selectedEmploye.dateEmbauche || 'Non renseignée' }}</p>
            </div>

            <div class="info-section">
              <p><strong>Compétences :</strong> {{ selectedEmploye.competences?.join(', ') || 'Aucune compétence renseignée' }}</p>
            </div>

            <div class="modal-buttons">
              <button type="button" @click="modifierDepuisModal" class="modal-btn edit-btn">Modifier</button>
              <button type="button" @click="supprimerDepuisModal" class="modal-btn delete-btn">Supprimer</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { employes, contrats } from '../stores/data.js'


const search = ref('')
const newSkill = ref('')
const message = ref('')
const departementFiltre = ref('')
const editIndex = ref(null)
const selectedEmploye = ref(null)
const selectedIndex = ref(null)
const showModal = ref(false)
const formVisible = ref(false)

const form = ref({
  nom: '',
  prenom: '',
  sexe: '',
  dateNaissance: '',
  email: '',
  telephone: '',
  poste: '',
  departement: '',
  contrat: '',
  dateEmbauche: '',
  competences: []
})

const departementsDisponibles = computed(() => {
  const deps = employes.value.map(emp => emp.departement).filter(Boolean)
  return [...new Set(deps)]
})

const filteredEmployes = computed(() => {
  return employes.value
    .filter(emp => {
      const fullName = `${emp.nom} ${emp.prenom}`.toLowerCase()
      const matchSearch = fullName.includes(search.value.toLowerCase())
      const matchDep = departementFiltre.value ? emp.departement === departementFiltre.value : true
      return matchSearch && matchDep
    })
    .sort((a, b) => a.nom.localeCompare(b.nom))
})

watch(contrats, () => {
  employes.value.forEach(emp => {
    const fullName = emp.nom + ' ' + emp.prenom
    const matchingContrat = contrats.value.find(c => c.nom === fullName)
    if (matchingContrat) {
      emp.contrat = matchingContrat.type
      emp.dateEmbauche = matchingContrat.dateDebut
    }
  })
  localStorage.setItem('employes', JSON.stringify(employes.value))
}, { immediate: true })

function ajouterCompetence() {
  const skill = newSkill.value.trim()
  if (skill && !form.value.competences.includes(skill)) {
    form.value.competences.push(skill)
    newSkill.value = ''
  }
}

function supprimerCompetence(index) {
  form.value.competences.splice(index, 1)
}

function resetForm() {
  Object.keys(form.value).forEach(k => (form.value[k] = k === 'competences' ? [] : ''))
  newSkill.value = ''
}

function ajouterEmploye() {
  if (editIndex.value === null) {
    employes.value.push({ ...form.value })
    message.value = 'Employé ajouté avec succès ✅'
  } else {
    employes.value[editIndex.value] = { ...form.value }
    message.value = 'Employé modifié avec succès ✅'
    editIndex.value = null
  }
  localStorage.setItem('employes', JSON.stringify(employes.value))
  resetForm()
  formVisible.value = false
  setTimeout(() => (message.value = ''), 3000)
}

function modifierEmploye(index) {
  const emp = employes.value[index]
  Object.keys(form.value).forEach(k => {
    form.value[k] = Array.isArray(emp[k]) ? [...emp[k]] : emp[k]
  })
  editIndex.value = index
  message.value = ''
  selectedEmploye.value = null
  formVisible.value = true
  closeModal()
}

function supprimerEmploye(index) {
  if (confirm('Confirmer la suppression de cet employé ?')) {
    employes.value.splice(index, 1)
    localStorage.setItem('employes', JSON.stringify(employes.value))
    if (editIndex.value === index) {
      resetForm()
      editIndex.value = null
    }
    message.value = 'Employé supprimé ✅'
    setTimeout(() => (message.value = ''), 3000)
    closeModal()
  }
}

function openModal(emp, index) {
  selectedEmploye.value = emp
  selectedIndex.value = index
  showModal.value = true
  nextTick(() => {
    const modalContent = document.querySelector('.modal-content')
    if (modalContent) modalContent.focus()
  })
}

function closeModal() {
  showModal.value = false
  selectedEmploye.value = null
  selectedIndex.value = null
}

function afficherFormulaire() {
  resetForm()
  editIndex.value = null
  formVisible.value = true
}

function modifierDepuisModal() {
  if (selectedIndex.value !== null) {
    modifierEmploye(selectedIndex.value)
  }
}

function supprimerDepuisModal() {
  if (selectedIndex.value !== null) {
    supprimerEmploye(selectedIndex.value)
  }
}

function stringToColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 70%, 60%)`
}
</script>

<style scoped>
.employe-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #121212;
  border-radius: 14px;
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.2);
  color: #eee;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.employe-liste {
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 1.5rem;
  flex: 2;
  min-width: 280px;
  box-shadow: inset 0 0 8px #00bcd4aa;
  max-height: 720px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.liste-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  align-items: center;
  gap: 1rem;
}

.search-filters {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.search-input {
  padding: 0.6rem;
  border-radius: 8px;
  border: none;
  background-color: #292929;
  color: white;
  font-size: 1rem;
  box-shadow: inset 0 0 6px #00bcd4aa;
  flex-grow: 1;
}

.add-employe-btn {
  font-size: 1rem;
  font-weight: 700;
  padding: 0.8rem 1.5rem;
  background-color: #00bcd4;
  color: white;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 12px #00bcd4aa;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
}

.add-employe-btn:hover {
  background-color: #0097a7;
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

.employe-list-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
}

.employe-list-ul li {
  margin-bottom: 10px;
}

.employe-nom-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
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
  flex-shrink: 0;
  box-shadow: 0 0 6px #00bcd4aa;
}

.employe-nom {
  font-weight: 600;
  font-size: 1.1rem;
  user-select: none;
}

.employe-nom:focus {
  outline: 2px solid #00bcd4;
  outline-offset: 2px;
}

.employe-form {
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: inset 0 0 8px #00bcd4aa;
  position: relative;
  flex: 3;
  max-width: 480px;
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

.form-section {
  margin-bottom: 1.5rem;
}

.skills-input {
  display: flex;
  gap: 0.5rem;
}

.skills-input input {
  flex-grow: 1;
}

.skills-input button {
  background-color: #00bcd4;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 0 1rem;
  cursor: pointer;
  font-weight: 700;
}

.skills-input button:hover {
  background-color: #0097a7;
}

.skills-tags {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background-color: #00bcd4;
  color: #000;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.skill-tag button {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 700;
  color: #000;
  font-size: 1rem;
  line-height: 1;
}

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
  max-width: 480px;
  box-shadow: inset 0 0 8px #00bcd4aa;
  position: relative;
  outline: none;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  color: #00bcd4;
  background: none;
  border: none;
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.modal-header h1 {
  color: #00bcd4;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.info-section p {
  margin: 0.2rem 0;
  font-size: 1rem;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-btn {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}

.edit-btn {
  background-color: #00bcd4;
  color: #000;
}

.edit-btn:hover {
  background-color: #0097a7;
}

.delete-btn {
  background-color: #ff5252;
  color: white;
}

.delete-btn:hover {
  background-color: #e53935;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
