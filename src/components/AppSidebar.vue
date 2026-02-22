<template>
  <!-- Mobile overlay when sidebar is open -->
  <div
      v-if="modelValue"
      class="fixed inset-0 z-40 bg-black/40 md:hidden"
      aria-hidden="true"
      @click="$emit('update:modelValue', false)"
    />

    <!-- Sidebar: drawer on mobile (burger), static on md+ -->
    <aside
      class="fixed md:relative inset-y-0 left-0 z-50 w-60 border-r border-slate-200/80 bg-white flex flex-col shrink-0 transform transition-transform duration-200 ease-out md:transform-none"
      :class="modelValue ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <div class="px-5 h-16 flex items-center justify-between gap-2.5 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span class="material-symbols-outlined text-white !text-lg">menu_book</span>
          </div>
          <span class="text-base font-bold tracking-tight text-slate-900">DocPortal</span>
        </div>
        <button
          type="button"
          class="md:hidden p-2 -mr-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          aria-label="Close menu"
          @click="$emit('update:modelValue', false)"
        >
          <span class="material-symbols-outlined !text-xl">close</span>
        </button>
      </div>

      <nav class="flex-1 p-3 space-y-0.5">
        <router-link
          to="/books"
          class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg bg-primary/8 text-primary"
          @click="$emit('update:modelValue', false)"
        >
          <span class="material-symbols-outlined !text-[20px]">description</span>
          Documents
        </router-link>
        <router-link
          v-if="authStore.isAdmin"
          to="/admin"
          class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          @click="$emit('update:modelValue', false)"
        >
          <span class="material-symbols-outlined !text-[20px]">admin_panel_settings</span>
          Administration
        </router-link>
      </nav>

      <div class="p-4 border-t border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary !text-[18px]">person</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-slate-700 truncate">
              {{ authStore.isAuthenticated ? 'Signed in' : 'Guest' }}
            </p>
          </div>
        </div>
      </div>
    </aside>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

defineProps({
  modelValue: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const authStore = useAuthStore()
</script>
