// store.js
import { ref } from 'vue'

export const employes = ref(JSON.parse(localStorage.getItem('employes') || '[]'))
export const contrats = ref(JSON.parse(localStorage.getItem('contrats') || '[]'))

// Sauvegarde automatique dans localStorage à chaque modification
function saveToLocalStorage() {
  localStorage.setItem('employes', JSON.stringify(employes.value))
  localStorage.setItem('contrats', JSON.stringify(contrats.value))
}

// Surveiller les changements (simple watcher)
employes.value = new Proxy(employes.value, {
  set(target, property, value) {
    target[property] = value
    saveToLocalStorage()
    return true
  }
})
contrats.value = new Proxy(contrats.value, {
  set(target, property, value) {
    target[property] = value
    saveToLocalStorage()
    return true
  }
})

// Une autre solution plus simple : appeler manuellement saveToLocalStorage() après chaque modification dans tes composants

