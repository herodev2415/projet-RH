<template>
  <div class="conges-container">
    <div class="conges-header">
      <button v-if="!formVisible && editIndex === null" @click="afficherFormulaire" class="add-conge-btn">
        Ajouter un congé
      </button>
    </div>

    <!-- Formulaire d'ajout -->
    <div v-if="formVisible && editIndex === null" class="conge-form">
      <button class="form-close" @click="fermerFormulaire">×</button>
      <h2>Ajouter un congé</h2>
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
            <li
              v-for="(s, i) in suggestions"
              :key="i"
              @click="selectSuggestion(s.nom + ' ' + s.prenom)"
            >
              {{ s.nom }} {{ s.prenom }}
            </li>
          </ul>
        </div>

        <label>Date de début</label>
        <input v-model="form.dateDebut" type="date" required />

        <label>Date de fin</label>
        <input v-model="form.dateFin" type="date" required />

        <select v-model="form.statut" required>
          <option disabled value="">-- Statut --</option>
          <option value="en cours">En cours</option>
          <option value="terminé">Terminé</option>
        </select>

        <button type="submit">Ajouter</button>
        <p v-if="message" class="message-success">{{ message }}</p>
      </form>
    </div>

    <!-- Popup modal modification -->
    <transition name="fade">
      <div v-if="formVisible && editIndex !== null" class="modal-overlay" @click.self="fermerFormulaire">
        <div class="modal-content" @click.stop>
          <button class="form-close" @click="fermerFormulaire">×</button>
          <h2>Modifier un congé</h2>
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
                <li
                  v-for="(s, i) in suggestions"
                  :key="i"
                  @click="selectSuggestion(s.nom + ' ' + s.prenom)"
                >
                  {{ s.nom }} {{ s.prenom }}
                </li>
              </ul>
            </div>

            <label>Date de début</label>
            <input v-model="form.dateDebut" type="date" required />

            <label>Date de fin</label>
            <input v-model="form.dateFin" type="date" required />

            <select v-model="form.statut" required>
              <option disabled value="">-- Statut --</option>
              <option value="en cours">En cours</option>
              <option value="terminé">Terminé</option>
            </select>

            <button type="submit">Enregistrer les modifications</button>
            <p v-if="message" class="message-success">{{ message }}</p>
          </form>
        </div>
      </div>
    </transition>

    <!-- Liste des congés -->
    <div class="conges-liste">
      <table>
        <thead>
          <tr>
            <th>Employé</th>
            <th>Date début</th>
            <th>Date fin</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(conge, index) in conges" :key="conge.id" @click="modifierConge(index)">
            <td>{{ conge.employe }}</td>
            <td>{{ conge.dateDebut }}</td>
            <td>{{ conge.dateFin }}</td>
            <td>{{ conge.statut }}</td>
            <td>
              <button @click.stop="supprimerConge(conge.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

import { conges, employes } from '../stores/data.js'  // adapte chemin


function resetForm() {
  form.value = { id: null, employe: '', dateDebut: '', dateFin: '', statut: '' }
  suggestions.value = []
  message.value = ''
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

function ajouterOuModifierConge() {
  if (editIndex.value === null) {
    form.value.id = Date.now()
    conges.value.push({ ...form.value })
    message.value = 'Congé ajouté ✅'
  } else {
    conges.value[editIndex.value] = { ...form.value }
    message.value = 'Congé modifié ✅'
    editIndex.value = null
  }
  formVisible.value = false
  resetForm()
  setTimeout(() => (message.value = ''), 3000)
}

function modifierConge(index) {
  form.value = { ...conges.value[index] }
  editIndex.value = index
  formVisible.value = true
}

function supprimerConge(id) {
  conges.value = conges.value.filter(c => c.id !== id)
}

function updateSuggestions() {
  const query = form.value.employe.toLowerCase()
  suggestions.value = query
    ? employes.value.filter(e => (`${e.nom} ${e.prenom}`).toLowerCase().includes(query)).slice(0, 5)
    : []
}

function selectSuggestion(fullName) {
  form.value.employe = fullName
  suggestions.value = []
}
</script>

<style scoped>
.conges-container {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #121212;
  border-radius: 14px;
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.2);
  color: #eee;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.conges-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
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
  box-shadow: 0 0 12px #00bcd4aa;
  transition: background-color 0.3s ease;
}

.add-conge-btn:hover {
  background-color: #0097a7;
}

.conge-form {
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

input, select {
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

.conges-liste table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1f1f1f;
  border-radius: 12px;
  box-shadow: inset 0 0 8px #00bcd4aa;
  overflow: hidden;
}

.conges-liste thead {
  background-color: #00bcd4;
  color: white;
}

.conges-liste th, .conges-liste td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #00bcd4aa;
}

.conges-liste tbody tr:hover {
  background-color: #374151;
  cursor: pointer;
}

.conges-liste button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #e60826;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.conges-liste button:hover {
  background-color: #c40620;
}

/* Fade popup */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.75);
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
  max-width: 450px;
  box-shadow: inset 0 0 8px #00bcd4aa;
  position: relative;
}
</style>
