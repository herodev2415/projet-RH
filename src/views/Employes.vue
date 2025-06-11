<template>
  <section class="page employes">
    <h1>Gestion des Employés</h1>
    <div class="actions">
      <button @click="ajouterEmploye">➕ Ajouter un employé</button>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Poste</th>
            <th>Département</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employe, index) in employes" :key="employe.id">
            <td>{{ employe.nom }}</td>
            <td>{{ employe.poste }}</td>
            <td>{{ employe.departement }}</td>
            <td>{{ employe.email }}</td>
            <td>
              <button @click="modifierEmploye(index)">✏️ Modifier</button>
              <button @click="supprimerEmploye(index)">🗑️ Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const employes = ref([])

onMounted(() => {
  const saved = localStorage.getItem('employes')
  employes.value = saved ? JSON.parse(saved) : []
})

function enregistrer() {
  localStorage.setItem('employes', JSON.stringify(employes.value))
}

function ajouterEmploye() {
  const nom = prompt("Nom ?")
  const poste = prompt("Poste ?")
  const departement = prompt("Département ?")
  const email = prompt("Email ?")
  if (nom && poste && departement && email) {
    employes.value.push({
      id: Date.now(), nom, poste, departement, email
    })
    enregistrer()
  }
}

function modifierEmploye(index) {
  const e = employes.value[index]
  const nom = prompt("Nom ?", e.nom)
  const poste = prompt("Poste ?", e.poste)
  const departement = prompt("Département ?", e.departement)
  const email = prompt("Email ?", e.email)
  if (nom && poste && departement && email) {
    employes.value[index] = { ...e, nom, poste, departement, email }
    enregistrer()
  }
}

function supprimerEmploye(index) {
  if (confirm("Supprimer cet employé ?")) {
    employes.value.splice(index, 1)
    enregistrer()
  }
}
</script>

<style scoped>
.page {
  padding: 2rem;
  color: #e0e0e0;
  background-color: #121212;
  min-height: 100vh;
}

h1 {
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.actions {
  margin-bottom: 1rem;
}

.actions button {
  background-color: #03dac6;
  color: #121212;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.actions button:hover {
  background-color: #00bfa5;
}

.table-container {
  overflow-x: auto;
  background-color: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  padding: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  color: #e0e0e0;
}

thead {
  background-color: #2c2c2c;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #3a3a3a;
}

tbody tr:hover {
  background-color: #2a2a2a;
}

td button {
  background: none;
  border: none;
  color: #03dac6;
  font-size: 1.1rem;
  margin-right: 0.5rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

td button:hover {
  opacity: 0.6;
}
</style>
