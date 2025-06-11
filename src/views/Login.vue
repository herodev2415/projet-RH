<template>
  <section class="login-page">
    <div class="login-box">
      <h2>Connexion</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input id="username" v-model="username" type="text" placeholder="Entrez votre nom d'utilisateur" required />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input id="password" v-model="password" type="password" placeholder="Entrez votre mot de passe" required />
        </div>
        <button type="submit">Se connecter</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { user } from '../stores/auth'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

function handleLogin() {
  const cleanUsername = username.value.trim()
  const cleanPassword = password.value.trim()

  if (cleanUsername === 'Herotiana' && cleanPassword === 'admin') {
    user.login()
    errorMessage.value = ''
    router.push('/dashboard')
  } else {
    errorMessage.value = "Nom d'utilisateur ou mot de passe incorrect"
  }
}

</script>

<style scoped>
/* styles login (tu peux reprendre ceux que tu as déjà) */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #004070, #1769aa);
  color: #f0f4f8;
}

.login-box {
  background-color: #e6f0fa;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgb(0 64 112 / 0.2);
  width: 350px;
  text-align: center;
}

h2 {
  margin-bottom: 2rem;
  font-weight: 700;
  color: #004070;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #004070;
}

input {
  width: 100%;
  padding: 0.6rem 1rem;
  border: 2px solid #004070;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #1769aa;
  background-color: #f0f7ff;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #004070;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1769aa;
}

.error {
  margin-top: 1rem;
  color: #d93025;
  font-weight: 600;
}
</style>
