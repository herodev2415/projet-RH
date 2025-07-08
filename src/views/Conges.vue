<template>
  <div class="conges-container">
    <div class="conges-header">
      <div class="filters">
        <input
          v-model="filterEmploye"
          type="text"
          placeholder="recherche ..."
          class="filter-input"
        />
        <select v-model="filterStatut" class="filter-select">
          <option value="">Tous statuts</option>
          <option value="en attente">En attente</option>
          <option value="validé">Validé</option>
          <option value="refusé">Refusé</option>
        </select>
      </div>
      <button v-if="!formVisible && editId === null" @click="afficherFormulaire" class="add-conge-btn">
        Ajouter un congé
      </button>
    </div>

    <!-- Formulaire d'ajout / modification -->
    <div v-if="formVisible" class="conge-form">
      <button class="form-close" @click="fermerFormulaire">×</button>
      <h2>{{ editId === null ? 'Ajouter un congé' : 'Modifier un congé' }}</h2>
      <form @submit.prevent="ajouterOuModifierConge">
        <div style="position: relative;">
          <input
            v-model="form.employe"
            @input="updateSuggestions"
            type="text"
            placeholder="Nom complet de l’employé"
            autocomplete="off"
            required
          />
          <ul v-if="suggestions.length" class="autocomplete-list">
            <li v-for="(s, i) in suggestions" :key="i" @click="selectSuggestion(s.nom + ' ' + s.prenom)">
              {{ s.nom }} {{ s.prenom }}
            </li>
          </ul>
        </div>

        <label>Date de début</label>
        <input v-model="form.dateDebut" type="date" required />

        <label>Date de fin</label>
        <input v-model="form.dateFin" type="date" required />

        <label>Motif / Commentaire</label>
        <textarea v-model="form.motif" placeholder="Ex : Vacances, maladie..." rows="2" />

        <label>Statut</label>
        <select v-model="form.statut" required>
          <option disabled value="">-- Choisir un statut --</option>
          <option value="en attente">En attente</option>
          <option value="validé">Validé</option>
          <option value="refusé">Refusé</option>
        </select>

        <button type="submit">{{ editId === null ? 'Ajouter' : 'Enregistrer' }}</button>
        <p v-if="message" class="message-success">{{ message }}</p>
      </form>
    </div>

    <!-- Liste des congés filtrée et triée -->
    <div class="conges-liste" v-if="filteredConges.length">
      <table>
        <thead>
          <tr>
            <th>Employé</th>
            <th>Durée (jours)</th>
            <th>Motif</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="conge in filteredConges" :key="conge.id">
            <td @click="ouvrirPopup(conge)" style="cursor:pointer; display:flex; align-items:center; gap:8px;">
              <div
                class="employee-avatar"
                :style="{ background: `linear-gradient(135deg, ${stringToColor(conge.employe)} 0%, ${stringToColor(conge.employe.split(' ')[1] || '')} 100%)` }"
              >
                {{ getInitials(conge.employe) }}
              </div>
              <span class="employe-nom">{{ conge.employe }}</span>
            </td>
            <td>{{ calcDuree(conge.dateDebut, conge.dateFin) }}</td>
            <td>{{ conge.motif || '-' }}</td>
            <td>
              <button @click.stop="confirmerSuppression(conge.id)">🗑 Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="no-data">Aucun congé trouvé pour ces filtres.</p>

    <!-- Modal suppression -->
    <transition name="fade">
      <div v-if="confirmDelete.visible" class="modal-overlay" @click.self="confirmDelete.visible = false">
        <div class="modal-content" @click.stop>
          <p>Confirmer la suppression du congé de <strong>{{ confirmDelete.employe }}</strong> ?</p>
          <div class="modal-actions">
            <button @click="supprimerConge(confirmDelete.id)">Oui, supprimer</button>
            <button @click="confirmDelete.visible = false">Annuler</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal popup infos détaillées congé -->
    <transition name="fade">
      <div v-if="popupVisible" class="modal-overlay" @click.self="fermerPopup">
        <div class="modal-details" @click.stop>
          <h3>Détails du congé</h3>
          <p><strong>Employé :</strong> {{ popupConge.employe }}</p>
          <p><strong>Date début :</strong> {{ popupConge.dateDebut }}</p>
          <p><strong>Date fin :</strong> {{ popupConge.dateFin }}</p>
          <p><strong>Durée :</strong> {{ calcDuree(popupConge.dateDebut, popupConge.dateFin) }} jours</p>
          <p><strong>Motif :</strong> {{ popupConge.motif || '-' }}</p>
          <p><strong>Statut :</strong> {{ popupConge.statut }}</p>
          <p>
            <strong>Jours restants :</strong>
              <span v-if="joursRestants(popupConge.dateDebut, popupConge.dateFin) > 0">
                {{ joursRestants(popupConge.dateDebut, popupConge.dateFin) }} jour(s)
              </span>
            <span v-else>Congé terminé</span>
          </p>
          <button class="btn-close-popup" @click="fermerPopup">
            Fermer
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { conges, employes } from '../stores/data.js'

const formVisible = ref(false)
const editId = ref(null)
const form = ref({
  id: null,
  employe: '',
  dateDebut: '',
  dateFin: '',
  motif: '',
  statut: '',
})
const message = ref('')
const suggestions = ref([])
const filterEmploye = ref('')
const filterStatut = ref('')

const confirmDelete = ref({
  visible: false,
  id: null,
  employe: '',
})

const popupVisible = ref(false)
const popupConge = ref({})

function resetForm() {
  form.value = {
    id: null,
    employe: '',
    dateDebut: '',
    dateFin: '',
    motif: '',
    statut: '',
  }
  suggestions.value = []
  message.value = ''
}

function afficherFormulaire() {
  resetForm()
  editId.value = null
  formVisible.value = true
}

function fermerFormulaire() {
  formVisible.value = false
  resetForm()
  editId.value = null
  message.value = ''
}

function ajouterOuModifierConge() {
  if (new Date(form.value.dateFin) < new Date(form.value.dateDebut)) {
    message.value = 'La date de fin doit être postérieure ou égale à la date de début.'
    return
  }
  if (editId.value === null) {
    form.value.id = Date.now()
    conges.value.push({ ...form.value })
    message.value = 'Congé ajouté ✅'
  } else {
    const index = conges.value.findIndex(c => c.id === editId.value)
    if (index !== -1) {
      conges.value[index] = { ...form.value }
      message.value = 'Congé modifié ✅'
    }
    editId.value = null
  }
  formVisible.value = false
  resetForm()
  setTimeout(() => (message.value = ''), 3000)
}

function modifierConge(id) {
  const conge = conges.value.find(c => c.id === id)
  if (!conge) return
  form.value = { ...conge }
  editId.value = id
  formVisible.value = true
}

function confirmerSuppression(id) {
  const c = conges.value.find(c => c.id === id)
  if (!c) return
  confirmDelete.value = { visible: true, id, employe: c.employe }
}

function supprimerConge(id) {
  conges.value = conges.value.filter(c => c.id !== id)
  confirmDelete.value.visible = false
  message.value = 'Congé supprimé ✅'
  setTimeout(() => (message.value = ''), 3000)
}

function updateSuggestions() {
  const query = form.value.employe.toLowerCase()
  suggestions.value = query
    ? employes.value
        .filter(e => (`${e.nom} ${e.prenom}`).toLowerCase().includes(query))
        .slice(0, 5)
    : []
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

function getInitials(nomComplet) {
  const [nom, prenom] = nomComplet.split(' ')
  return (prenom?.charAt(0) || '') + (nom?.charAt(0) || '')
}

function calcDuree(dateDebut, dateFin) {
  const debut = new Date(dateDebut)
  const fin = new Date(dateFin)
  const diffTime = fin - debut
  if (diffTime < 0) return 0
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
}

// ✅ Correction ici : on ignore l'heure pour les comparaisons
function joursRestants(dateDebut, dateFin) {
  const today = new Date()
  const debut = new Date(dateDebut)
  const fin = new Date(dateFin)

  today.setHours(0, 0, 0, 0)
  debut.setHours(0, 0, 0, 0)
  fin.setHours(0, 0, 0, 0)

  if (today > fin) return 0
  if (today < debut) return calcDuree(dateDebut, dateFin)

  const diffTime = fin - today
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function ouvrirPopup(conge) {
  popupConge.value = { ...conge }
  popupVisible.value = true
}

function fermerPopup() {
  popupVisible.value = false
}

const filteredConges = computed(() => {
  let result = conges.value.slice()

  if (filterEmploye.value.trim() !== '') {
    const q = filterEmploye.value.toLowerCase()
    result = result.filter(c => c.employe.toLowerCase().includes(q))
  }
  if (filterStatut.value !== '') {
    result = result.filter(c => c.statut === filterStatut.value)
  }

  return result.sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut))
})
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Segoe+UI&display=swap');

.conges-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #121212;
  border-radius: 14px;
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.25);
  color: #eee;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.conges-header {
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

.filter-input,
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

.add-conge-btn {
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

.add-conge-btn:hover {
  background-color: #0097a7;
}

.conge-form {
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

.conges-liste table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1f1f1f;
  border-radius: 12px;
  box-shadow: inset 0 0 8px #00bcd4aa;
  overflow: hidden;
  color: #eee;
}



.conges-liste thead {
  background-color: transparent;
  color: #64b5f6;
}

.conges-liste th,
.conges-liste td {
  padding: 1rem;
  /* Suppression des bordures pour un style uniforme */
  border-bottom: none;
  text-align: left;
}

.conges-liste tbody tr {
  border-bottom: 1px solid transparent;
  transition: background-color 0.3s ease;
}
.conges-liste button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: #ff0055;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.conges-liste button:hover {
  background-color: #cc0044;
}
.conges-liste thead th {
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #00bcd4;
  font-size: 1.05rem;
  font-weight: bold;
  color: #64b5f6;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  text-transform: capitalize;
  font-size: 0.9rem;
  user-select: none;
  display: inline-block;
}

.badge-warning {
  background-color: #ffb74d;
  color: #111;
}

.badge-success {
  background-color: #81c784;
  color: #111;
}

.badge-danger {
  background-color: #e57373;
  color: #111;
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

/* Modal suppression reste inchangé */
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

/* Modal détails du congé (popup infos) */
.modal-details {
  width: 100%;
  max-width: 450px;
  background: linear-gradient(145deg, #181818, #1f1f1f);
  border-radius: 20px;
  padding: 2.5rem 3rem;
  box-shadow: 0 8px 24px rgba(0, 188, 212, 0.45);
  color: #e0e0e0;
  font-size: 1.1rem;
  line-height: 1.6;
  user-select: none;
  text-align: left;
  position: relative;
  font-weight: 600;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.modal-details h3 {
  margin-bottom: 1.2rem;
  font-size: 1.8rem;
  color: #00bcd4;
  text-align: center;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.modal-details p {
  margin-bottom: 0.9rem;
}

.btn-close-popup {
  margin-top: 2rem;
  width: 100%;
  padding: 1rem;
  background-color: #00bcd4;
  color: #121212;
  font-weight: 700;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  box-shadow: 0 6px 16px #00bcd4aa;
  transition: background-color 0.3s ease;
}

.btn-close-popup:hover {
  background-color: #008b99;
}

/* Avatar employé */
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

/* Texte si pas de données */
.no-data {
  color: #888;
  font-style: italic;
  text-align: center;
  margin-top: 3rem;
}
</style>
