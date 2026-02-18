import { api } from './index'

export const authApi = {
  login(email, password) {
    return api.post('/auth/login', { email, password })
  },
  register(email, password) {
    return api.post('/auth/register', { email, password })
  },
}
