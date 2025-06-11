import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initAuth } from './stores/auth'

initAuth() // initialise l’état d’auth au démarrage

const app = createApp(App)
app.use(router)
app.mount('#app')
