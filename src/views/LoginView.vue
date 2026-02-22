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

        <h1 class="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
        <p class="text-slate-500 text-sm mb-8">Sign in to your account to continue</p>

        <!-- Success state after sign-in -->
        <div v-if="signedIn" class="space-y-4">
          <p class="text-slate-600 text-sm">You're signed in. Where would you like to go?</p>
          <div class="flex flex-col gap-3">
            <router-link
              to="/books"
              class="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-dark focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-all text-center"
            >
              Go to Books
            </router-link>
            <router-link
              v-if="authStore.isAdmin"
              to="/admin/dashboard"
              class="w-full py-2.5 bg-slate-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-800 focus:ring-2 focus:ring-slate-500/40 focus:ring-offset-2 transition-all text-center flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined !text-[18px]">admin_panel_settings</span>
              Go to Admin Dashboard
            </router-link>
          </div>
        </div>

        <form v-else @submit.prevent="onSubmit" class="space-y-5">
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
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-dark focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <p v-if="!signedIn" class="mt-8 text-center text-sm text-slate-500">
          Don't have an account?
          <router-link to="/register" class="text-primary font-semibold hover:text-primary-dark transition-colors">Create one</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const signedIn = ref(false)

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(email.value, password.value)
    signedIn.value = true
  } catch (e) {
    error.value = e.response?.data?.detail || e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
