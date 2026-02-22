<template>
  <header
    class="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center gap-3 sm:gap-4 shrink-0"
  >
    <!-- Mobile: sidebar toggle -->
    <button
      type="button"
      class="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg shrink-0"
      aria-label="Open menu"
      @click="$emit('toggle-sidebar')"
    >
      <span class="material-symbols-outlined !text-[24px]">menu</span>
    </button>

    <!-- Search: full width on mobile -->
    <div class="relative flex-1 min-w-0 max-w-md">
      <span
        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[18px] pointer-events-none"
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

    <!-- Desktop nav -->
    <div class="hidden md:flex items-center gap-2 shrink-0">
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

    <!-- Mobile: dropdown menu -->
    <div ref="navMenuRef" class="md:hidden relative shrink-0">
      <button
        type="button"
        class="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
        aria-label="More options"
        aria-haspopup="true"
        :aria-expanded="navOpen"
        @click="navOpen = !navOpen"
      >
        <span class="material-symbols-outlined !text-[24px]">more_vert</span>
      </button>
      <Transition name="nav-dropdown">
        <div
          v-if="navOpen"
          class="absolute right-0 top-full mt-1 py-2 w-52 bg-white rounded-xl border border-slate-200 shadow-lg z-20"
        >
          <router-link
            v-if="authStore.isAuthenticated && !authStore.isAdmin"
            to="/admin/dashboard"
            class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            @click="navOpen = false"
          >
            <span class="material-symbols-outlined !text-[20px]">dashboard</span>
            Dashboard
          </router-link>
          <router-link
            v-if="authStore.isAdmin"
            to="/admin/dashboard"
            class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            @click="navOpen = false"
          >
            <span class="material-symbols-outlined !text-[20px]">admin_panel_settings</span>
            Admin
          </router-link>
          <router-link
            v-if="authStore.isAdmin"
            to="/upload"
            class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            @click="navOpen = false"
          >
            <span class="material-symbols-outlined !text-[20px]">upload</span>
            Upload
          </router-link>
          <router-link
            to="/about"
            class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            @click="navOpen = false"
          >
            <span class="material-symbols-outlined !text-[20px]">info</span>
            About
          </router-link>
          <div class="border-t border-slate-100 my-1" />
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
            @click="navOpen = false"
          >
            <span class="material-symbols-outlined !text-[20px]">login</span>
            Sign in
          </router-link>
          <button
            v-else
            type="button"
            class="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left"
            @click="authStore.logout(); navOpen = false"
          >
            <span class="material-symbols-outlined !text-[20px]">logout</span>
            Sign out
          </button>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'

defineProps({
  searchQuery: { type: String, default: '' },
  sidebarOpen: { type: Boolean, default: false },
})

defineEmits(['update:searchQuery', 'toggle-sidebar'])

const authStore = useAuthStore()
const navOpen = ref(false)
const navMenuRef = ref(null)

function closeNavOnClickOutside(e) {
  if (navOpen.value && navMenuRef.value && !navMenuRef.value.contains(e.target)) navOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', closeNavOnClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', closeNavOnClickOutside)
})
</script>

<style scoped>
.nav-dropdown-enter-active,
.nav-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.nav-dropdown-enter-from,
.nav-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
