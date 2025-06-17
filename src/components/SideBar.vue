<template>
  <aside class="sidebar">
    <ul>
      <li v-for="link in links" :key="link.path">
        <router-link :to="link.path" class="sidebar-link" active-class="active-link">
          {{ link.label }}
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script setup>
const links = [
  { path: "/dashboard", label: "DASHBOARD" },
  { path: "/employes", label: "EMPLOYÉS" },
  { path: "/contrats", label: "CONTRATS" },
  { path: "/conges", label: "CONGÉS" },
  { path: "/presences", label: "PRÉSENCES" },
  { path: "/evaluations", label: "ÉVALUATIONS" },
]
</script>

<style scoped>
.sidebar {
  width: 180px; /* largeur réduite de 240px à 180px */
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 1.2rem 0.8rem; /* padding réduit */
  height: 100vh;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center; /* centre le contenu */
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.sidebar li {
  margin-bottom: 1rem;
}

.sidebar-link {
  display: block;
  padding: 10px 12px; /* padding réduit */
  color: #bbbbbb;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem; /* taille de police réduite */
  transition: background-color 0.3s, color 0.3s;
  text-align: center; /* centre le texte */
  white-space: nowrap; /* évite le retour à la ligne */
  overflow: hidden;
  text-overflow: ellipsis; /* coupe texte trop long */
}

.sidebar-link:hover {
  background-color: #292929;
  color: #ffffff;
}

.active-link {
  background-color: #03dac6;
  color: #000000 !important;
  font-weight: 700;
}
</style>
