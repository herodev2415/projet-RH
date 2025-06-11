<template>
  <div id="app">
    <NavBar v-if="isLoggedIn" />
    <div class="main-layout" v-if="isLoggedIn">
      <SideBar />
      <main class="container">
        <router-view />
      </main>
    </div>
    <router-view v-else /> <!-- Login -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'
import { user, initAuth } from './stores/auth'

initAuth()
const isLoggedIn = computed(() => user.isAuthenticated)
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #121212;
  color: #e0e0e0;
}

.main-layout {
  display: flex;
  height: 100vh;
}

.container {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: #1e1e1e;
}
</style>
