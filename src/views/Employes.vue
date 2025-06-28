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

    <!-- Colonne Droite : Formulaire d'ajout/modification affiché conditionnellement -->
    <div v-if="formVisible" class="employe-form" style="flex: 3; position: relative;">
      <!-- Bouton Fermer en haut à droite -->
      <button
        class="form-close"
        @click="formVisible = false"
        aria-label="Fermer le formulaire"
        title="Fermer"
      >
        ×
      </button>

      <h2>{{ editIndex === null ? 'Ajouter un employé' : 'Modifier un employé' }}</h2>
      <form @submit.prevent="ajouterEmploye">
        <!-- Identité -->
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

        <!-- Coordonnées -->
        <div class="form-section">
          <h3>Coordonnées</h3>
          <input v-model="form.email" type="email" placeholder="Email professionnel" />
          <input v-model="form.telephone" type="tel" placeholder="Téléphone" />
        </div>

        <!-- Situation professionnelle -->
        <div class="form-section">
          <h3>Situation professionnelle</h3>
          <input v-model="form.poste" type="text" placeholder="Poste" required />
          <input v-model="form.departement" type="text" placeholder="Département" />
        </div>

        <!-- Compétences -->
        <div class="form-section">
          <h3>Compétences</h3>
          <div class="skills-input">
            <input
              v-model="newSkill"
              type="text"
              placeholder="Ajouter une compétence"
              @keyup.enter="ajouterCompetence"
            />
            <button type="button" @click="ajouterCompetence">+</button>
          </div>
          <div class="skills-tags">
            <span
              v-for="(skill, i) in form.competences"
              :key="i"
              class="skill-tag"
            >
              {{ skill }}
              <button type="button" @click="supprimerCompetence(i)">✕</button>
            </span>
          </div>
        </div>

        <button type="submit">
          {{ editIndex === null ? 'Ajouter' : 'Enregistrer les modifications' }}
        </button>
        <p v-if="message" style="color: #00ff99; margin-top: 1rem;">{{ message }}</p>
      </form>
    </div>

    <!-- Modal Popup -->
<!-- Modal Popup -->
<transition name="modal-fade">
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="modal-content" tabindex="-1" ref="modalContent">
      <button class="modal-close" @click="closeModal" aria-label="Fermer la fenêtre">×</button>

      <!-- Corps de la popup -->
      <div class="modal-body">
        <!-- Nom en haut -->
        <div class="modal-header">
          <h1 id="modalTitle">{{ selectedEmploye.prenom }} {{ selectedEmploye.nom }}</h1>
        </div>

        <!-- Informations personnelles -->
        <div class="info-section">
          <p><strong>Sexe :</strong> {{ selectedEmploye.sexe || 'Non renseigné' }}</p>
          <p><strong>Date de naissance :</strong> {{ selectedEmploye.dateNaissance || 'Non renseignée' }}</p>
        </div>

        <!-- Contact -->
        <div class="info-section">
          <p><strong>Email :</strong> {{ selectedEmploye.email || 'Non renseigné' }}</p>
          <p><strong>Téléphone :</strong> {{ selectedEmploye.telephone || 'Non renseigné' }}</p>
        </div>

        <!-- Professionnel -->
        <div class="info-section">
          <p><strong>Poste :</strong> {{ selectedEmploye.poste || 'Non renseigné' }}</p>
          <p><strong>Département :</strong> {{ selectedEmploye.departement || 'Non renseigné' }}</p>
          <p><strong>Contrat :</strong> {{ selectedEmploye.contrat || 'Non renseigné' }}</p>
          <p><strong>Date d'embauche :</strong> {{ selectedEmploye.dateEmbauche || 'Non renseignée' }}</p>
        </div>

        <!-- Compétences -->
        <div class="info-section">
          <p><strong>Compétences :</strong> {{ selectedEmploye.competences.join(', ') || 'Aucune compétence renseignée' }}</p>
        </div>

        <!-- Boutons Modifier et Supprimer -->
        <div class="modal-buttons">
          <button
            type="button"
            @click="modifierDepuisModal"
            class="modal-btn edit-btn"
          >
            Modifier
          </button>
          <button
            type="button"
            @click="supprimerDepuisModal"
            class="modal-btn delete-btn"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const search = ref('')
const newSkill = ref('')
const message = ref('')
const departementFiltre = ref('')
const editIndex = ref(null)
const selectedEmploye = ref(null)
const selectedIndex = ref(null)
const showModal = ref(false)
const formVisible = ref(false) // contrôle la visibilité du formulaire

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

const employes = ref(JSON.parse(localStorage.getItem('employes') || '[]'))

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
  formVisible.value = false // cache le formulaire après ajout/modif
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
  formVisible.value = true // montre formulaire en mode modif
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

// Boutons dans la popup appelant les fonctions principales avec index stocké
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

// Génère une couleur HSL basée sur une chaîne de caractères (nom/prénom)
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
/* Styles de base */
.employe-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  background-color: #121212;
  padding: 2rem;
  border-radius: 14px;
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.2);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #eee;
}

.employe-form {
  flex: 1;
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: inset 0 0 8px #00bcd4aa;
}

.employe-liste {
  flex: 2;
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: inset 0 0 8px #00bcd4aa;
}

/* Nouvelle classe pour header de la liste avec recherche + bouton */
.liste-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

/* Conteneur recherche + filtre */
.search-filters {
  display: flex;
  gap: 1rem;
  flex: 1;
  min-width: 220px;
}

/* Bouton ajouter placé en haut à droite */
.add-employe-btn {
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  background-color: #00bcd4;
  color: white;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: visible;
  transition: background-color 0.3s ease;
  box-shadow: 0 0 12px #00bcd4aa;
  /* animation halo */
  animation: pulseHalo 2.5s infinite ease-in-out;
}

.add-employe-btn:hover {
  background-color: #0097a7;
  box-shadow: 0 0 25px #00e5ffcc;
}

@keyframes pulseHalo {
  0%, 100% {
    box-shadow: 0 0 10px 4px #00bcd4aa;
  }
  50% {
    box-shadow: 0 0 22px 8px #00e5ffbb;
  }
}

/* Styles des inputs de recherche et filtre */
.search-input {
  border-radius: 8px;
  border: none;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  outline: none;
  background-color: #292929;
  color: #eee;
  box-shadow: inset 0 0 6px #00bcd4aa;
}

/* Titre de la liste */
.liste-titre {
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #00bcd4;
  padding-bottom: 0.5rem;
}

/* Liste des employés */
.employe-list-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 480px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #00bcd4 #1f1f1f;
}

.employe-list-ul::-webkit-scrollbar {
  width: 10px;
}

.employe-list-ul::-webkit-scrollbar-track {
  background: #1f1f1f;
  border-radius: 20px;
}

.employe-list-ul::-webkit-scrollbar-thumb {
  background-color: #00bcd4;
  border-radius: 20px;
  border: 3px solid #1f1f1f;
}

/* Chaque item de la liste */
.employe-list-ul li {
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
  border-radius: 12px;
  padding: 0.3rem 0.6rem;
  display: flex;
  align-items: center;
}

.employe-list-ul li:hover {
  background-color: #007a8d;
}

/* Container autour nom + avatar */
.employe-nom-container {
  display: flex;
  align-items: center;
}

/* Style du nom */
.employe-nom {
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
  user-select: none;
  outline-offset: 2px;
}

.employe-nom:focus {
  outline: 2px solid #00e5ffcc;
  border-radius: 6px;
}

/* Avatar rond avec initiales */
.employee-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
  font-size: 1rem;
  user-select: none;
  box-shadow: 0 0 5px #00bcd4aa;
}

/* Formulaire styles */
form input,
form select {
  width: 100%;
  padding: 0.8rem;
  margin-top: 0.4rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: none;
  background-color: #292929;
  color: white;
  box-shadow: inset 0 0 6px #00bcd4aa;
  font-size: 1rem;
}

form button[type='submit'] {
  background-color: #00bcd4;
  color: white;
  padding: 1rem 2rem;
  border-radius: 18px;
  border: none;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 0 15px #00bcd4bb;
  width: 100%;
}

form button[type='submit']:hover {
  background-color: #0097a7;
}

/* Sections du formulaire */
.form-section {
  margin-bottom: 1.5rem;
}

.form-section h3 {
  margin-bottom: 0.7rem;
  font-weight: 700;
  border-bottom: 2px solid #00bcd4;
  padding-bottom: 0.3rem;
}

/* Compétences tags */
.skills-container,
.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.4rem;
}

.skill-tag {
  background-color: #00bcd4;
  color: black;
  padding: 0.4rem 0.7rem;
  border-radius: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  user-select: none;
}

.skill-tag button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 900;
  color: black;
  padding: 0;
  margin-left: 4px;
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
  color: black;
  font-weight: 700;
  font-size: 1.2rem;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  box-shadow: 0 0 8px #00bcd4bb;
}

.skills-input button:hover {
  background-color: #0097a7;
  box-shadow: 0 0 15px #00e5ffcc;
}

/* Fermeture formulaire bouton */
.form-close {
  position: absolute;
  top: 10px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 2.2rem;
  font-weight: 700;
  color: #00bcd4;
  cursor: pointer;
  line-height: 1;
}

/* Popup modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}


.modal-content {
  background-color: #1f1f1f;
  padding: 2rem;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  color: #eee;
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.3);
}
.modal-header h1 {
  margin: 0 0 1.5rem 0;
  font-size: 1.8rem;
  color: #00bcd4;
  border-bottom: 2px solid #00bcd4;
  padding-bottom: 0.5rem;
}

/* Modal close button */
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
}

/* Modal header */
.modal-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}
.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}
.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #00bcd4;
  color: black;
  font-weight: 700;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  user-select: none;
  box-shadow: 0 0 10px #00bcd4aa;
}

.header-info h3 {
  margin: 0;
  font-weight: 700;
  font-size: 1.6rem;
  color: white;
}

.header-info .position {
  font-size: 1rem;
  color: #00bcd4aa;
}

/* Modal info sections */
.info-section {
  margin-bottom: 1.2rem;
}
.info-section p {
  margin: 0.7rem 0;
  font-size: 1rem;
  line-height: 1.5;
}
.info-section strong {
  color: #00bcd4;
  font-weight: 600;
}

.info-section h4 {
  font-weight: 700;
  color: #00bcd4;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.7rem 1.2rem;
}

.info-item {
  display: flex;
  gap: 0.4rem;
}

.info-label {
  font-weight: 700;
  color: #00e5ffcc;
}

.info-value {
  color: white;
  font-style: italic;
}

/* Skills container in modal */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.skill-tag {
  background-color: #e0f7fa;
  color: #00796b;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.no-skills {
  color: #999;
  font-style: italic;
}
.modal-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}
.modal-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.edit-btn {
  background-color: #00bcd4;
  color: black;
}

.edit-btn:hover {
  background-color: #008ba3;
  box-shadow: 0 0 10px #00bcd4;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
  box-shadow: 0 0 10px #f44336;
}

/* Modal fade transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
