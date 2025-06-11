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
  width: 240px;
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 2rem 1rem;
  height: 100vh;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin-bottom: 1rem;
}

.sidebar-link {
  display: block;
  padding: 12px 18px;
  color: #bbbbbb;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar-link:hover {
  background-color: #292929;
  color: #ffffff;
}

.active-link {
  background-color: #03dac6;
  color: #000000 !important;
  font-weight: bold;
}
</style>
