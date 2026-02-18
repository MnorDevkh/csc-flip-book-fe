import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  )

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.is_admin ?? false)

  function setAuth(accessToken, userData) {
    token.value = accessToken
    user.value = userData
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function login(email, password) {
    const { data } = await authApi.login(email, password)
    setAuth(data.access_token, { email })
    const res = await api.get('/auth/me')
    setAuth(data.access_token, res.data)
    return data
  }

  async function register(email, password) {
    await authApi.register(email, password)
    return login(email, password)
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    setAuth,
    logout,
    login,
    register,
  }
})
