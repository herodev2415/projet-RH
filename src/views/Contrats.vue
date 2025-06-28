<template>
  <div class="contrat-container">
    <!-- Formulaire -->
    <div class="contrat-form">
      <h2>{{ editIndex === null ? 'Ajouter un contrat' : 'Modifier le contrat' }}</h2>
      <form @submit.prevent="ajouterContrat">
        <div style="position: relative;">
          <input
            v-model="form.nom"
            @input="updateSuggestions"
            type="text"
            placeholder="Nom de l’employé"
            autocomplete="off"
            required
          />
          <ul v-if="suggestions.length" class="autocomplete-list">
            <li
              v-for="(s, i) in suggestions"
              :key="i"
              @click="selectSuggestion(s.nom)"
            >
              {{ s.nom }}
            </li>
          </ul>
        </div>

        <input v-model="form.type" type="text" placeholder="Type de contrat (CDI, CDD...)" required />
        <input v-model="form.dateDebut" type="date" placeholder="Date de début" />
        <input v-model="form.dateFin" type="date" placeholder="Date de fin" />
        <input v-model="form.salaire" type="number" placeholder="Salaire" />

        <button type="submit">
          {{ editIndex === null ? 'Ajouter' : 'Enregistrer les modifications' }}
        </button>
        <p v-if="message" style="color: #00ff99; margin-top: 1rem;">{{ message }}</p>
      </form>
    </div>

    <!-- Liste -->
    <div class="contrat-liste">
      <h3 class="liste-titre">Liste des contrats</h3>
      <ul>
        <li v-for="(c, index) in contrats" :key="index">
          <strong>{{ c.nom }}</strong><br />
          Type : {{ c.type }}<br />
          Du {{ c.dateDebut }} au {{ c.dateFin }}<br />
          Salaire : {{ c.salaire }} Ar<br />
          <button @click="modifierContrat(index)">Modifier</button>
          <button @click="supprimerContrat(index)">Supprimer</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  nom: '',
  type: '',
  dateDebut: '',
  dateFin: '',
  salaire: ''
})

const contrats = ref(JSON.parse(localStorage.getItem('contrats') || '[]'))
const employes = ref(JSON.parse(localStorage.getItem('employes') || '[]'))
const suggestions = ref([])

const editIndex = ref(null)
const message = ref('')

function resetForm() {
  form.value = { nom: '', type: '', dateDebut: '', dateFin: '', salaire: '' }
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
  localStorage.setItem('contrats', JSON.stringify(contrats.value))
  resetForm()
  setTimeout(() => (message.value = ''), 3000)
}

function modifierContrat(index) {
  form.value = { ...contrats.value[index] }
  editIndex.value = index
  message.value = ''
}

function supprimerContrat(index) {
  if (confirm('Supprimer ce contrat ?')) {
    contrats.value.splice(index, 1)
    localStorage.setItem('contrats', JSON.stringify(contrats.value))
    message.value = 'Contrat supprimé ✅'
    resetForm()
    editIndex.value = null
    setTimeout(() => (message.value = ''), 3000)
  }
}

function updateSuggestions() {
  const query = form.value.nom.toLowerCase()
  suggestions.value = query
    ? employes.value.filter(e =>
        e.nom.toLowerCase().includes(query)
      ).slice(0, 5)
    : []
}

function selectSuggestion(nom) {
  form.value.nom = nom
  suggestions.value = []
}
</script>

<style scoped>
/* Fond global foncé */
body {
  background-color: #121212;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #eee;
}

.contrat-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  background-color: #121212;
  padding: 2rem;
  border-radius: 14px;
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.2);
  color: #eee;
}

.contrat-form {
  flex: 1;
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: inset 0 0 8px #00bcd4aa;
}

.contrat-liste {
  flex: 2;
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: inset 0 0 8px #00bcd4aa;
}

h2,
.liste-titre {
  color: #00bcd4;
  text-align: center;
  text-transform: uppercase;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
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

.contrat-liste ul {
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

.contrat-liste li {
  padding: 0.7rem 1rem;
  border-bottom: 1px solid #444;
  color: #ccc;
}

.contrat-liste button {
  width: auto;
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  border-radius: 8px;
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

@media (max-width: 900px) {
  .contrat-container {
    flex-direction: column;
  }
}
</style>