<template>
  <section class="page presences">
    <h1>Gestion des Présences</h1>

    <form @submit.prevent="ajouterPresence" class="form">
      <input v-model="nouvellePresence.employe" placeholder="Employé" required />

      <input v-model="nouvellePresence.date" type="date" required />

      <input 
        v-model="nouvellePresence.arrivee" 
        type="time" 
        :disabled="nouvellePresence.statut === 'Absent'" 
        :required="nouvellePresence.statut !== 'Absent'" 
        placeholder="Heure d'arrivée" 
      />

      <input 
        v-model="nouvellePresence.depart" 
        type="time" 
        :disabled="nouvellePresence.statut === 'Absent'" 
        :required="nouvellePresence.statut !== 'Absent'" 
        placeholder="Heure de départ" 
      />

      <select v-model="nouvellePresence.statut" required>
        <option value="">-- Statut --</option>
        <option>Présent</option>
        <option>Absent</option>
        <option>Retard</option>
        <option>Autre</option>
      </select>
      <input v-if="nouvellePresence.statut === 'Autre'" v-model="nouvellePresence.statut" placeholder="Précisez le statut" required />

      <button type="submit">Ajouter</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>Employé</th>
          <th>Date</th>
          <th>Heure d'arrivée</th>
          <th>Heure de départ</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="presence in presences" :key="presence.id">
          <td>{{ presence.employe }}</td>
          <td>{{ presence.date }}</td>
          <td>{{ presence.arrivee }}</td>
          <td>{{ presence.depart }}</td>
          <td>{{ presence.statut }}</td>
          <td>
            <button @click="modifierPresence(presence)">Modifier</button>
            <button @click="supprimerPresence(presence.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const presences = ref([]);
const nouvellePresence = ref({
  id: null,
  employe: '',
  date: '',
  arrivee: '',
  depart: '',
  statut: ''
});

onMounted(() => {
  const sauvegarde = localStorage.getItem('presences');
  presences.value = sauvegarde ? JSON.parse(sauvegarde) : [];
});

watch(presences, (val) => {
  localStorage.setItem('presences', JSON.stringify(val));
}, { deep: true });

function ajouterPresence() {
  if (nouvellePresence.value.statut !== 'Absent') {
    if (!nouvellePresence.value.arrivee || !nouvellePresence.value.depart) {
      alert("Veuillez renseigner l'heure d'arrivée et de départ.");
      return;
    }
  } else {
    // Si Absent, on force les champs arrivee/depart à "-" pour plus de clarté (optionnel)
    nouvellePresence.value.arrivee = '-';
    nouvellePresence.value.depart = '-';
  }

  if (nouvellePresence.value.id !== null) {
    const index = presences.value.findIndex(p => p.id === nouvellePresence.value.id);
    if (index !== -1) presences.value[index] = { ...nouvellePresence.value };
  } else {
    nouvellePresence.value.id = Date.now();
    presences.value.push({ ...nouvellePresence.value });
  }
  resetForm();
}

function modifierPresence(presence) {
  nouvellePresence.value = { ...presence };
}

function supprimerPresence(id) {
  presences.value = presences.value.filter(p => p.id !== id);
}

function resetForm() {
  nouvellePresence.value = {
    id: null,
    employe: '',
    date: '',
    arrivee: '',
    depart: '',
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
  flex-grow: 0;
  flex-shrink: 0;
  width: 120px;
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
