<template>
  <div class="min-h-screen flex bg-background-light font-display">
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark items-center justify-center p-12">
      <div class="text-center">
        <span class="material-symbols-outlined text-white/90 !text-7xl mb-6 block">menu_book</span>
        <h2 class="text-3xl font-bold text-white mb-3">DocPortal</h2>
        <p class="text-indigo-200 text-lg max-w-sm">
          Your interactive flipbook reader for documents and publications.
        </p>
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-sm">
        <div class="lg:hidden flex items-center gap-3 mb-10">
          <div class="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <span class="material-symbols-outlined text-white !text-xl">menu_book</span>
          </div>
          <span class="text-lg font-bold text-slate-900 tracking-tight">DocPortal</span>
        </div>

        <h1 class="text-2xl font-bold text-slate-900 mb-1">Create account</h1>
        <p class="text-slate-500 text-sm mb-8">Get started with your free account</p>

        <form @submit.prevent="onSubmit" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              placeholder="At least 6 characters"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-dark focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Creating account...</span>
            <span v-else>Create account</span>
          </button>
        </form>

        <p class="mt-8 text-center text-sm text-slate-500">
          Already have an account?
          <router-link to="/login" class="text-primary font-semibold hover:text-primary-dark transition-colors">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await authStore.register(email.value, password.value)
    router.push('/books')
  } catch (e) {
    error.value = e.response?.data?.detail || e.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
