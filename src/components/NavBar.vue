<template>
  <nav class="navbar">
    <div class="logo">
      <span>RH Gestion</span>
    </div>
    <div class="user-info">
      <span class="username">
        <span class="greeting">Bienvenue, Admin</span>
      </span>
      <button class="logout-btn" @click="confirmLogout" title="Se déconnecter">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon-logout" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>Déconnexion</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { user } from '../stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

function confirmLogout() {
  if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
    user.logout()
    router.push('/')
  }
}
</script>

<style scoped>
.navbar {
  height: 70px;
  background-color: #1f1f1f;
  color: #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  font-weight: 500;
  font-size: 1.05rem;
  box-shadow: 0 4px 10px rgba(0, 188, 212, 0.1);
  border-bottom: 1px solid #333;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: #00bcd4;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2c2c2c;
  color: #00bcd4;
  border: 1px solid #00bcd4;
  padding: 8px 16px;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #00bcd4;
  color: #1f1f1f;
}

.icon-logout {
  width: 20px;
  height: 20px;
}
</style>
