<template>
  <header
    class="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 h-16 flex items-center justify-between shrink-0"
  >
    <div class="relative w-80">
      <span
        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[18px]"
      >
        search
      </span>
      <input
        :value="searchQuery"
        type="text"
        placeholder="Search documents..."
        class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 transition-all focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15"
        @input="$emit('update:searchQuery', ($event.target).value)"
      />
    </div>
    <div class="flex items-center gap-2">
      <router-link
        v-if="authStore.isAuthenticated && !authStore.isAdmin"
        to="/admin/dashboard"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-all"
      >
        <span class="material-symbols-outlined !text-[18px]">dashboard</span>
        Dashboard
      </router-link>
      <router-link
        v-if="authStore.isAdmin"
        to="/admin/dashboard"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all"
      >
        <span class="material-symbols-outlined !text-[18px]">admin_panel_settings</span>
        Admin Dashboard
      </router-link>
      <router-link
        v-if="authStore.isAdmin"
        to="/upload"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-sm shadow-primary/25 hover:bg-primary-dark transition-all"
      >
        <span class="material-symbols-outlined !text-[18px]">upload</span>
        Upload
      </router-link>
      <router-link
        to="/about"
        class="px-3 py-2 text-slate-500 text-sm font-medium hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
      >
        About
      </router-link>
      <div class="h-5 w-px bg-slate-200 mx-1" />
      <router-link
        v-if="!authStore.isAuthenticated"
        to="/login"
        class="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
      >
        Sign in
      </router-link>
      <button
        v-else
        type="button"
        class="px-3 py-2 text-slate-500 text-sm font-medium hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
        @click="authStore.logout"
      >
        Sign out
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

defineProps({
  searchQuery: { type: String, default: '' },
})

defineEmits(['update:searchQuery'])

const authStore = useAuthStore()
</script>
