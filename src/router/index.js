import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Employes from '../views/Employes.vue'
import Contrats from '../views/Contrats.vue'
import Conges from '../views/Conges.vue'
import Presences from '../views/Presences.vue'
import Evaluations from '../views/Evaluations.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/employes', component: Employes },
  { path: '/contrats', component: Contrats },
  { path: '/conges', component: Conges },
  { path: '/presences', component: Presences },
  { path: '/evaluations', component: Evaluations },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
