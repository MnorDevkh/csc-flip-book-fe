<template>
  <div class="flex h-screen overflow-hidden bg-background-light font-display text-slate-800">
    <!-- Sidebar -->
    <aside class="w-56 bg-slate-900 text-slate-300 flex flex-col shrink-0">
      <div class="px-5 h-14 flex items-center gap-2.5 border-b border-slate-800">
        <div class="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
          <span class="material-symbols-outlined text-white !text-[16px]">settings</span>
        </div>
        <span class="text-sm font-bold text-white tracking-tight">Admin Portal</span>
      </div>

      <nav class="flex-1 p-3 space-y-0.5">
        <router-link
          to="/admin/dashboard"
          class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          active-class="!bg-white/10 !text-white"
        >
          <span class="material-symbols-outlined !text-[18px]">dashboard</span>
          Dashboard
        </router-link>
        <router-link
          to="/admin/books"
          class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-white/5 hover:text-white"
          active-class="!bg-white/10 !text-white"
        >
          <span class="material-symbols-outlined !text-[18px]">library_books</span>
          Books
        </router-link>
        <router-link
          to="/upload"
          class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-white/5 hover:text-white"
        >
          <span class="material-symbols-outlined !text-[18px]">upload</span>
          Upload Book
        </router-link>
        <router-link
          to="/books"
          class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-white/5 hover:text-white"
        >
          <span class="material-symbols-outlined !text-[18px]">auto_stories</span>
          View Site
        </router-link>
      </nav>

      <div class="p-3 border-t border-slate-800">
        <button
          @click="onLogout"
          class="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <span class="material-symbols-outlined !text-[18px]">logout</span>
          Sign out
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="h-14 bg-white border-b border-slate-200/80 flex items-center px-6 shrink-0">
        <h1 class="text-sm font-semibold text-slate-800">{{ route.meta?.title || 'Admin' }}</h1>
      </header>
      <main class="flex-1 overflow-y-auto custom-scrollbar p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

function onLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
