<template>
  <section class="page evaluations">
    <h1>Gestion des Évaluations</h1>

    <form @submit.prevent="ajouterOuModifierEvaluation" class="form">
      <input v-model="evaluationCourante.employe" placeholder="Employé" required />
      <input v-model="evaluationCourante.date" type="date" required />
      <input v-model.number="evaluationCourante.score" type="number" min="0" max="10" placeholder="Score /10" required />
      <input v-model="evaluationCourante.commentaires" placeholder="Commentaires" />

      <button type="submit">{{ evaluationCourante.id === null ? 'Ajouter' : 'Modifier' }}</button>
      <button type="button" @click="resetForm" v-if="evaluationCourante.id !== null">Annuler</button>
    </form>

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
        <tr v-for="evaluation in evaluations" :key="evaluation.id">
          <td>{{ evaluation.employe }}</td>
          <td>{{ evaluation.date }}</td>
          <td>{{ evaluation.score }}/10</td>
          <td>{{ evaluation.commentaires }}</td>
          <td>
            <button @click="modifierEvaluation(evaluation)">Modifier</button>
            <button @click="supprimerEvaluation(evaluation.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const evaluations = ref([]);
const evaluationCourante = ref({
  id: null,
  employe: '',
  date: '',
  score: null,
  commentaires: ''
});

onMounted(() => {
  const sauvegarde = localStorage.getItem('evaluations');
  evaluations.value = sauvegarde ? JSON.parse(sauvegarde) : [];
});

watch(evaluations, (val) => {
  localStorage.setItem('evaluations', JSON.stringify(val));
}, { deep: true });

function ajouterOuModifierEvaluation() {
  if (evaluationCourante.value.id === null) {
    evaluationCourante.value.id = Date.now();
    evaluations.value.push({ ...evaluationCourante.value });
  } else {
    const index = evaluations.value.findIndex(e => e.id === evaluationCourante.value.id);
    if (index !== -1) evaluations.value[index] = { ...evaluationCourante.value };
  }
  resetForm();
}

function modifierEvaluation(evaluationToEdit) {
  evaluationCourante.value = { ...evaluationToEdit };
}

function supprimerEvaluation(id) {
  evaluations.value = evaluations.value.filter(e => e.id !== id);
  if (evaluationCourante.value.id === id) resetForm();
}

function resetForm() {
  evaluationCourante.value = {
    id: null,
    employe: '',
    date: '',
    score: null,
    commentaires: ''
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

.form input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  flex: 1 1 200px;
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
