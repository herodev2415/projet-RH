<template>
  <section class="page conges">
    <h1>Gestion des Congés</h1>
    <form @submit.prevent="ajouterConge" class="form">
      <input v-model="nouveauConge.employe" placeholder="Employé" required />
      <input v-model="nouveauConge.dateDebut" type="date" required />
      <input v-model="nouveauConge.dateFin" type="date" required />
      <select v-model="nouveauConge.statut" required>
        <option value="">-- Statut --</option>
        <option value="en cours">En cours</option>
        <option value="terminé">Terminé</option>
      </select>
      <button type="submit">Ajouter</button>
    </form>
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
        <tr v-for="conge in conges" :key="conge.id">
          <td>{{ conge.employe }}</td>
          <td>{{ conge.dateDebut }}</td>
          <td>{{ conge.dateFin }}</td>
          <td>{{ conge.statut }}</td>
          <td>
            <button @click="modifierConge(conge)">Modifier</button>
            <button @click="supprimerConge(conge.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const conges = ref([])
const nouveauConge = ref({ id: null, employe: '', dateDebut: '', dateFin: '', statut: '' })

onMounted(() => {
  const sauvegarde = localStorage.getItem('conges')
  conges.value = sauvegarde ? JSON.parse(sauvegarde) : []
})

watch(conges, (val) => {
  localStorage.setItem('conges', JSON.stringify(val))
}, { deep: true })

function ajouterConge() {
  nouveauConge.value.statut = nouveauConge.value.statut.trim().toLowerCase()
  if (nouveauConge.value.id !== null) {
    const index = conges.value.findIndex(c => c.id === nouveauConge.value.id)
    if (index !== -1) conges.value[index] = { ...nouveauConge.value }
  } else {
    nouveauConge.value.id = Date.now()
    conges.value.push({ ...nouveauConge.value })
  }
  resetForm()
}

function modifierConge(conge) {
  nouveauConge.value = { ...conge }
}

function supprimerConge(id) {
  conges.value = conges.value.filter(c => c.id !== id)
}

function resetForm() {
  nouveauConge.value = { id: null, employe: '', dateDebut: '', dateFin: '', statut: '' }
}
</script>

<style scoped>
.page {
  padding: 2rem;
  color: #004070;
}

h1 {
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form input, .form select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  flex: 1;
}

.form button {
  background-color: #004070;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}

.form button:hover {
  background-color: #0060a0;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #e6f0fa;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgb(0 64 112 / 0.1);
  overflow: hidden;
}

thead {
  background-color: #004070;
  color: white;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #b0c4de;
}

tbody tr:hover {
  background-color: #c8dafc;
  cursor: pointer;
}

button {
  margin-right: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #e60826;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #c40620;
}
</style>
