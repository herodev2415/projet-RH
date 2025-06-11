import { reactive } from 'vue'

export const user = reactive({
  isAuthenticated: false,
  login() {
    this.isAuthenticated = true
    localStorage.setItem('isAuthenticated', 'true')
  },
  logout() {
    this.isAuthenticated = false
    localStorage.removeItem('isAuthenticated')
  }
})

export function initAuth() {
  const stored = localStorage.getItem('isAuthenticated')
  user.isAuthenticated = stored === 'true'
}
