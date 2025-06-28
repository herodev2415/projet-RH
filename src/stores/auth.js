import { reactive } from 'vue'

export const user = reactive({
  isAuthenticated: false,
  login() {
    this.isAuthenticated = true
    localStorage.setItem('auth', 'true')
  },
  logout() {
    this.isAuthenticated = false
    localStorage.removeItem('auth')
  }
})

export function initAuth() {
  user.isAuthenticated = localStorage.getItem('auth') === 'true'
}