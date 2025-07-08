<template>
  <div class="evaluation-container">
    <div class="evaluation-header">
      <div class="filters">
        <select v-model="filterScore" class="filter-select">
          <option value="">Tous scores</option>
          <option value="low">Score < 5</option>
          <option value="medium">Score 5-7</option>
          <option value="high">Score > 7</option>
        </select>
      </div>

      <button v-if="!formVisible && editId === null" @click="showForm" class="add-eval-btn">
        Ajouter une évaluation
      </button>
    </div>

    <!-- Formulaire ajout/modif -->
    <div v-if="formVisible" class="eval-form">
      <button class="form-close" @click="hideForm">×</button>
      <h2>{{ editId === null ? 'Ajouter une évaluation' : 'Modifier une évaluation' }}</h2>

      <form @submit.prevent="addOrEditEvaluation">
        <div style="position: relative;">
          <input
            v-model="form.employe"
            @input="updateSuggestions"
            @focus="updateSuggestions"
            @blur="onBlurInput"
            type="text"
            placeholder="Nom complet de l’employé"
            autocomplete="off"
            required
          />
          <ul v-if="suggestions.length" class="autocomplete-list" @mousedown.prevent>
            <li v-for="(s, i) in suggestions" :key="i" @click="selectSuggestion(s.nom + ' ' + s.prenom)">
              {{ s.nom }} {{ s.prenom }}
            </li>
          </ul>
        </div>

        <label>Date</label>
        <input v-model="form.date" type="date" required />

        <label>Score (/10)</label>
        <input v-model.number="form.score" type="number" min="0" max="10" required />

        <label>Commentaires</label>
        <textarea v-model="form.commentaires" rows="2" placeholder="Commentaires (facultatif)"></textarea>

        <button type="submit">{{ editId === null ? 'Ajouter' : 'Enregistrer' }}</button>
        <p v-if="message" class="message-success">{{ message }}</p>
      </form>
    </div>

    <!-- Liste filtrée des évaluations -->
    <div class="evaluations-list" v-if="filteredEvaluations.length">
      <table>
        <thead>
          <tr>
            <th>Employé</th>
            <th>Date</th>
            <th>Score</th>
            <th>Commentaires</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="evaluation in filteredEvaluations" :key="evaluation.id">
            <td @click="openPopup(evaluation)" style="cursor:pointer; display:flex; align-items:center; gap:8px;">
              <div
                class="employee-avatar"
                :style="{ background: `linear-gradient(135deg, ${stringToColor(evaluation.employe)} 0%, ${stringToColor(evaluation.employe.split(' ')[1] || '')} 100%)` }"
              >
                {{ getInitials(evaluation.employe) }}
              </div>
              <span class="employe-nom">{{ evaluation.employe }}</span>
            </td>
            <td>{{ evaluation.date }}</td>
            <td>{{ evaluation.score }}/10</td>
            <td>{{ evaluation.commentaires || '-' }}</td>
            <td>
              <button @click.stop="confirmDeleteEval(evaluation.id)">🗑 Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="no-data">Aucune évaluation trouvée pour ces filtres.</p>

    <!-- Modal suppression -->
    <transition name="fade">
      <div v-if="confirmDelete.visible" class="modal-overlay" @click.self="confirmDelete.visible = false">
        <div class="modal-content" @click.stop>
          <p>Confirmer la suppression de l’évaluation de <strong>{{ confirmDelete.employe }}</strong> ?</p>
          <div class="modal-actions">
            <button @click="deleteEvaluation(confirmDelete.id)">Oui, supprimer</button>
            <button @click="confirmDelete.visible = false">Annuler</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal détails -->
    <transition name="fade">
      <div v-if="popupVisible" class="modal-overlay" @click.self="closePopup">
        <div class="modal-details" @click.stop>
          <h3>Détails de l’évaluation</h3>
          <p><strong>Employé :</strong> {{ popupEval.employe }}</p>
          <p><strong>Date :</strong> {{ popupEval.date }}</p>
          <p><strong>Score :</strong> {{ popupEval.score }}/10</p>
          <p><strong>Commentaires :</strong> {{ popupEval.commentaires || '-' }}</p>

          <button class="btn-close-popup" @click="closePopup">Fermer</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { employes } from '../stores/data.js' // adapte ce chemin selon ton projet

// Évaluations persistées en localStorage
const evaluations = ref([])

onMounted(() => {
  const saved = localStorage.getItem('evaluations')
  if (saved) {
    try {
      evaluations.value = JSON.parse(saved)
    } catch {
      evaluations.value = []
    }
  }
})

// Sauvegarde automatique à chaque changement de evaluations
watch(evaluations, (newVal) => {
  localStorage.setItem('evaluations', JSON.stringify(newVal))
}, { deep: true })

const formVisible = ref(false)
const editId = ref(null)
const message = ref('')
const suggestions = ref([])

const filterScore = ref('')

const confirmDelete = ref({
  visible: false,
  id: null,
  employe: '',
})

const popupVisible = ref(false)
const popupEval = ref({})

const form = ref({
  id: null,
  employe: '',
  date: '',
  score: null,
  commentaires: '',
})

function resetForm() {
  form.value = {
    id: null,
    employe: '',
    date: '',
    score: null,
    commentaires: '',
  }
  suggestions.value = []
  message.value = ''
}

function showForm() {
  resetForm()
  editId.value = null
  formVisible.value = true
}

function hideForm() {
  formVisible.value = false
  resetForm()
  editId.value = null
  message.value = ''
}

function addOrEditEvaluation() {
  if (form.value.score < 0 || form.value.score > 10) {
    alert('Le score doit être entre 0 et 10.')
    return
  }
  if (editId.value === null) {
    form.value.id = Date.now()
    evaluations.value.push({ ...form.value })
    message.value = 'Évaluation ajoutée ✅'
  } else {
    const idx = evaluations.value.findIndex(e => e.id === editId.value)
    if (idx !== -1) {
      evaluations.value[idx] = { ...form.value }
      message.value = 'Évaluation modifiée ✅'
    }
    editId.value = null
  }
  formVisible.value = false
  resetForm()
  setTimeout(() => (message.value = ''), 3000)
}

function updateSuggestions() {
  const q = form.value.employe.trim().toLowerCase()
  suggestions.value = q.length >= 1
    ? employes.value.filter(e =>
        (`${e.nom} ${e.prenom}`.toLowerCase().includes(q) ||
         `${e.prenom} ${e.nom}`.toLowerCase().includes(q))
      ).slice(0, 5)
    : []
}

function onBlurInput() {
  setTimeout(() => {
    suggestions.value = []
  }, 150)
}

function selectSuggestion(fullName) {
  form.value.employe = fullName
  suggestions.value = []
}

function stringToColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 70%, 60%)`
}

function getInitials(fullName) {
  const [nom, prenom] = fullName.split(' ')
  return (prenom?.charAt(0) || '') + (nom?.charAt(0) || '')
}

function confirmDeleteEval(id) {
  const e = evaluations.value.find(ev => ev.id === id)
  if (!e) return
  confirmDelete.value = { visible: true, id, employe: e.employe }
}

function deleteEvaluation(id) {
  evaluations.value = evaluations.value.filter(e => e.id !== id)
  confirmDelete.value.visible = false
  message.value = 'Évaluation supprimée ✅'
  setTimeout(() => (message.value = ''), 3000)
}

function openPopup(evaluation) {
  popupEval.value = { ...evaluation }
  popupVisible.value = true
}

function closePopup() {
  popupVisible.value = false
}

const filteredEvaluations = computed(() => {
  let result = evaluations.value.slice()
  if (filterScore.value === 'low') {
    result = result.filter(e => e.score < 5)
  } else if (filterScore.value === 'medium') {
    result = result.filter(e => e.score >= 5 && e.score <= 7)
  } else if (filterScore.value === 'high') {
    result = result.filter(e => e.score > 7)
  }
  return result.sort((a, b) => new Date(b.date) - new Date(a.date)) // tri date décroissant
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Segoe+UI&display=swap');

.evaluation-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #121212;
  border-radius: 14px;
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.25);
  color: #eee;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.evaluation-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  flex-grow: 1;
  min-width: 200px;
}

.filter-select {
  background-color: #292929;
  border: none;
  border-radius: 8px;
  color: #eee;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  box-shadow: inset 0 0 6px #00bcd4aa;
  flex-grow: 1;
  min-width: 150px;
}

.add-eval-btn {
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  background-color: #00bcd4;
  color: white;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 12px #00bcd4cc;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.add-eval-btn:hover {
  background-color: #0097a7;
}

.eval-form {
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: inset 0 0 8px #00bcd4aa;
  position: relative;
  color: #eee;
  max-width: 600px;
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
select,
textarea {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: none;
  background-color: #292929;
  color: white;
  font-size: 1rem;
  box-shadow: inset 0 0 6px #00bcd4aa;
  resize: vertical;
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
  font-weight: 600;
}

.autocomplete-list {
  position: absolute;
  width: 100%;
  max-height: 160px;
  overflow-y: auto;
  background-color: #1c1c2b;
  border: 1px solid #00bcd4;
  border-radius: 10px;
  z-index: 15;
  color: #eee;
}

.autocomplete-list li {
  padding: 0.7rem 1rem;
  cursor: pointer;
}

.autocomplete-list li:hover {
  background-color: #00bcd4;
  color: #111;
}

.evaluations-list table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1f1f1f;
  border-radius: 12px;
  box-shadow: inset 0 0 8px #00bcd4aa;
  overflow: hidden;
  color: #eee;
}

.evaluations-list thead {
  background-color: transparent;
  color: #64b5f6;
}

.evaluations-list th,
.evaluations-list td {
  padding: 1rem;
  border-bottom: none;
  text-align: left;
}

.evaluations-list tbody tr {
  border-bottom: 1px solid transparent;
  transition: background-color 0.3s ease;
}

.evaluations-list button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: #ff0055;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.evaluations-list button:hover {
  background-color: #cc0044;
}

.evaluations-list thead th {
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #00bcd4;
  font-size: 1.05rem;
  font-weight: bold;
  color: #64b5f6;
}

.employee-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  text-shadow: 0 0 4px rgba(0,0,0,0.4);
}

.employe-nom {
  user-select: text;
  font-weight: 600;
}

.no-data {
  color: #888;
  font-style: italic;
  text-align: center;
  margin-top: 3rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 420px;
  background: linear-gradient(145deg, #181818, #1f1f1f);
  color: #eee;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 6px 18px rgba(0, 188, 212, 0.4);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  position: relative;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.modal-actions button {
  padding: 0.8rem 1.6rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-actions button:first-child {
  background-color: #ff3d57;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 61, 87, 0.3);
}

.modal-actions button:first-child:hover {
  background-color: #d32f2f;
}

.modal-actions button:last-child {
  background-color: #424242;
  color: #ccc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.modal-actions button:last-child:hover {
  background-color: #333;
}

.modal-details {
  width: 100%;
  max-width: 450px;
  background: linear-gradient(145deg, #181818, #1f1f1f);
  border-radius: 20px;
  padding: 2.5rem 3rem;
  box-shadow: 0 8px 24px rgba(0, 188, 212, 0.6);
  color: #eee;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  user-select: none;
}

.modal-details h3 {
  margin-bottom: 1.5rem;
  font-weight: 800;
  font-size: 1.8rem;
  text-align: center;
}

.modal-details p {
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.3;
}

.btn-close-popup {
  margin-top: 1rem;
  display: block;
  margin-left: auto;
  padding: 0.8rem 1.6rem;
  border: none;
  border-radius: 14px;
  background-color: #00bcd4;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 0 10px #00bcd4cc;
  transition: background-color 0.3s ease;
  user-select: none;
}

.btn-close-popup:hover {
  background-color: #0097a7;
}
</style>
