<template>
  <div class="employe-container">
    <!-- Colonne Gauche : Formulaire -->
    <div class="employe-form">
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
          <select v-model="form.contrat" required>
            <option value="" disabled>Type de contrat</option>
            <option>CDI</option>
            <option>CDD</option>
            <option>Stage</option>
          </select>
          <input v-model="form.dateEmbauche" type="date" />
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

    <!-- Colonne Droite : Liste des employés -->
    <div class="employe-liste">
      <input type="text" v-model="search" placeholder="Rechercher..." class="search-input" />
      <select v-model="departementFiltre" class="search-input">
        <option value="">Tous les départements</option>
        <option v-for="dep in departementsDisponibles" :key="dep">{{ dep }}</option>
      </select>
      <h3 class="liste-titre">Liste des employés</h3>
      <ul>
        <li v-for="(emp, index) in filteredEmployes" :key="index">
          <strong>{{ emp.nom }} {{ emp.prenom }}</strong><br />
          {{ emp.poste }} — {{ emp.departement }}<br />
          Contrat : {{ emp.contrat }} | Embauché le : {{ emp.dateEmbauche }}
          <br />
          <button type="button" @click="modifierEmploye(index)">Modifier</button>
          <button type="button" @click="supprimerEmploye(index)">Supprimer</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const newSkill = ref('')
const message = ref('')
const departementFiltre = ref('')
const editIndex = ref(null) // null = ajout, sinon index modifié

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
  return employes.value.filter(emp => {
    const fullName = `${emp.nom} ${emp.prenom}`.toLowerCase()
    const matchSearch = fullName.includes(search.value.toLowerCase())
    const matchDep = departementFiltre.value ? emp.departement === departementFiltre.value : true
    return matchSearch && matchDep
  })
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
    // ajout
    employes.value.push({ ...form.value })
    message.value = 'Employé ajouté avec succès ✅'
  } else {
    // modification
    employes.value[editIndex.value] = { ...form.value }
    message.value = 'Employé modifié avec succès ✅'
    editIndex.value = null
  }
  localStorage.setItem('employes', JSON.stringify(employes.value))
  resetForm()
  setTimeout(() => (message.value = ''), 3000)
}

function modifierEmploye(index) {
  const emp = employes.value[index]
  Object.keys(form.value).forEach(k => {
    form.value[k] = Array.isArray(emp[k]) ? [...emp[k]] : emp[k]
  })
  editIndex.value = index
  message.value = ''
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
  }
}
</script>

<style scoped>
/* Ton style inchangé */
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
  flex: 2; /* <-- liste 2x plus large */
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: inset 0 0 8px #00bcd4aa;
}

.employe-form h2,
.liste-titre {
  color: #00bcd4;
  text-align: center;
  text-transform: uppercase;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  margin-bottom: 1rem;
  color: #00bcd4;
  border-bottom: 1px solid #00bcd4;
  padding-bottom: 0.3rem;
}

input,
select {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  background-color: #3a3a3a;
  color: #eee;
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #00bcd4;
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: #2b2b2b;
  color: #ddd;
}

.employe-liste ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 600px;
  overflow-y: auto;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  scrollbar-width: thin;
  scrollbar-color: #00bcd4 transparent;
}

.employe-liste li {
  padding: 0.7rem 1rem;
  border-bottom: 1px solid #444;
  color: #ccc;
}

.skills-input {
  display: flex;
  gap: 0.5rem;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background-color: #00bcd4;
  color: #121212;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
}

.skill-tag button {
  background: none;
  border: none;
  margin-left: 0.4rem;
  cursor: pointer;
  color: #121212;
  font-weight: bold;
}

.employe-liste button {
  width: auto;
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  border-radius: 8px;
}

@media (max-width: 900px) {
  .employe-container {
    flex-direction: column;
  }
}
</style>
