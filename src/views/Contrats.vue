<template>
  <section class="page contrats">
    <h1>Gestion des Contrats</h1>

    <form @submit.prevent="ajouterContrat" class="form">
      <input v-model="nouveauContrat.employe" placeholder="Employé" required />

      <select v-model="nouveauContrat.type" required>
        <option value="">-- Sélectionner le type --</option>
        <option>CDI</option>
        <option>CDD</option>
        <option>Stage</option>
        <option>Autre</option>
      </select>
      <input
        v-if="nouveauContrat.type === 'Autre'"
        v-model="nouveauContrat.type"
        placeholder="Précisez le type"
        required
      />

      <input v-model="nouveauContrat.dateDebut" type="date" required />
      <input v-model="nouveauContrat.dateFin" type="date" required />

      <select v-model="nouveauContrat.statut" required>
        <option value="">-- Sélectionner le statut --</option>
        <option>Actif</option>
        <option>En cours</option>
        <option>Terminé</option>
        <option>Autre</option>
      </select>
      <input
        v-if="nouveauContrat.statut === 'Autre'"
        v-model="nouveauContrat.statut"
        placeholder="Précisez le statut"
        required
      />

      <button type="submit">Ajouter</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>Employé</th>
          <th>Type</th>
          <th>Date début</th>
          <th>Date fin</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contrat in contrats" :key="contrat.id">
          <td>{{ contrat.employe }}</td>
          <td>{{ contrat.type }}</td>
          <td>{{ contrat.dateDebut }}</td>
          <td>{{ contrat.dateFin }}</td>
          <td>{{ contrat.statut }}</td>
          <td class="actions">
            <button class="btn-modifier" @click="modifierContrat(contrat)">Modifier</button>
            <button class="btn-supprimer" @click="supprimerContrat(contrat.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const contrats = ref([]);
const nouveauContrat = ref({
  id: null,
  employe: '',
  type: '',
  dateDebut: '',
  dateFin: '',
  statut: ''
});

onMounted(() => {
  const sauvegarde = localStorage.getItem('contrats');
  contrats.value = sauvegarde ? JSON.parse(sauvegarde) : [];
});

watch(contrats, (val) => {
  localStorage.setItem('contrats', JSON.stringify(val));
}, { deep: true });

function ajouterContrat() {
  if (nouveauContrat.value.id !== null) {
    const index = contrats.value.findIndex(c => c.id === nouveauContrat.value.id);
    if (index !== -1) contrats.value[index] = { ...nouveauContrat.value };
  } else {
    nouveauContrat.value.id = Date.now();
    contrats.value.push({ ...nouveauContrat.value });
  }
  resetForm();
}

function modifierContrat(contrat) {
  nouveauContrat.value = { ...contrat };
}

function supprimerContrat(id) {
  contrats.value = contrats.value.filter(c => c.id !== id);
}

function resetForm() {
  nouveauContrat.value = {
    id: null,
    employe: '',
    type: '',
    dateDebut: '',
    dateFin: '',
    statut: ''
  };
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

.form input,
.form select {
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
  background-color: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgb(0 64 112 / 0.1);
  overflow: hidden;
}

thead {
  background-color: #004070;
  color: white;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #b0c4de;
}

tbody tr:hover {
  background-color: #dde7f3;
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-modifier {
  background-color: #2a82da;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-modifier:hover {
  background-color: #1f6db5;
}

.btn-supprimer {
  background-color: #d9364f;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-supprimer:hover {
  background-color: #b32b3f;
}
</style>
