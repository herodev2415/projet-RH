import { createRouter, createWebHistory } from 'vue-router'
import Login from '../Views/Login.vue'
import Dashboard from '../Views/Dashboard.vue'
import Employes from '../Views/Employes.vue'
import Contrats from '../Views/Contrats.vue'
import Conges from '../Views/Conges.vue'
import Presences from '../Views/Presences.vue'
import Evaluations from '../Views/Evaluations.vue'

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
