import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

function requireAdmin(to, from, next) {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) next({ name: 'Login' })
  // else if (!auth.isAdmin) next({ name: 'Books' })
  else next()
}

import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import BooksView from '@/views/BooksView.vue'
import BookReaderView from '@/views/BookReaderView.vue'
import UploadView from '@/views/UploadView.vue'
import AboutView from '@/views/AboutView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminBooksView from '@/views/admin/AdminBooksView.vue'

const routes = [
  { path: '/', redirect: '/books' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/books', name: 'Books', component: BooksView },
  { path: '/books/:id', name: 'BookReader', component: BookReaderView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/upload', name: 'Upload', component: UploadView, beforeEnter: requireAdmin },
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: requireAdmin,
    children: [
      { path: '', redirect: { name: 'admin-dashboard' } },
      { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboardView, meta: { title: 'Dashboard' } },
      { path: 'books', name: 'admin-books', component: AdminBooksView, meta: { title: 'Books Management' } },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
