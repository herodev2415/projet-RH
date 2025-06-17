<template>
  <div class="quick-actions">
    <button @click="goTo('/employes')" class="action-btn" title="Ajouter un employé">
      Ajouter Employé
    </button>
    <button @click="goTo('/conges')" class="action-btn" title="Ajouter un congé">
      Ajouter Congé
    </button>
    <button @click="goTo('/evaluations')" class="action-btn" title="Ajouter une évaluation">
      Ajouter Évaluation
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goTo(path) {
  router.push(path)
}
</script>

<style scoped>
.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #03dac6;
  color: #000;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 8px rgb(3 218 198 / 0.5);
  transition: background-color 0.3s ease;
  font-size: 1rem;
  user-select: none;
}

.action-btn:hover {
  background-color: #02b3a1;
}

.material-icons {
  font-size: 1.4rem;
  user-select: none;
}

/* Responsive */
@media (max-width: 600px) {
  .quick-actions {
    flex-direction: column;
  }
}
</style>
