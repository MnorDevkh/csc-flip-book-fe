<template>
  <div class="flex h-screen overflow-hidden bg-background-light font-display text-slate-800">
    <AppSidebar v-model="sidebarOpen" />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto custom-scrollbar flex flex-col min-w-0">
      <AppNavbar v-model:search-query="searchQuery" :sidebar-open="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <div class="p-4 sm:p-6 md:p-8 flex-1">
        <div class="mb-6 md:mb-8">
          <h2 class="text-lg sm:text-xl font-bold text-slate-900">Documents</h2>
          <p class="text-sm text-slate-500 mt-1">Browse and read your flipbook collection</p>
        </div>

        <!-- Loading -->
        <div v-if="booksStore.loading" class="flex items-center justify-center py-20">
          <div class="flex items-center gap-3 text-slate-400">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span class="text-sm font-medium">Loading documents...</span>
          </div>
        </div>

        <!-- Error -->
        <div
          v-else-if="booksStore.error"
          class="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
        >
          <span class="material-symbols-outlined text-red-400 !text-4xl mb-2 block">error</span>
          <p class="text-red-700 font-medium text-sm">{{ booksStore.error }}</p>
        </div>

        <!-- Grid -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <div
            v-for="doc in filteredDocuments"
            :key="doc.id"
            class="group bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-200 cursor-pointer"
            @click="navigateToFlipbook(doc.id)"
          >
            <div class="relative aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
              <img
                v-if="doc.coverImage && !failedCoverIds[doc.id]"
                :src="doc.coverImage"
                :alt="doc.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                @error="onCoverError(doc.id)"
              />
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined !text-5xl text-slate-300">description</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div class="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                <span class="inline-flex items-center gap-1 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-xs font-semibold text-slate-700 rounded-md shadow-sm">
                  <span class="material-symbols-outlined !text-[14px]">auto_stories</span>
                  Read now
                </span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-sm text-slate-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {{ doc.title }}
              </h3>
              <div class="flex items-center justify-between text-xs text-slate-400">
                <span>{{ doc.modified }}</span>
                <span class="font-medium">{{ doc.total_pages }} pages</span>
              </div>
            </div>
          </div>

          <!-- Upload card (admin) -->
          <router-link
            v-if="authStore.isAdmin"
            to="/upload"
            class="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-primary hover:border-primary/40 hover:bg-primary/[0.03] transition-all min-h-[260px] sm:min-h-[320px]"
          >
            <div class="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <span class="material-symbols-outlined !text-3xl">add</span>
            </div>
            <span class="text-xs font-semibold tracking-wide">Upload document</span>
          </router-link>
        </div>

        <!-- Empty -->
        <div
          v-if="!booksStore.loading && !booksStore.error && filteredDocuments.length === 0"
          class="text-center py-20"
        >
          <span class="material-symbols-outlined !text-6xl text-slate-200 mb-4 block">folder_open</span>
          <p class="text-slate-500 font-medium">No documents found</p>
          <p class="text-slate-400 text-sm mt-1">Upload a PDF to get started</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useBooksStore } from '@/stores/books'
import { booksApi } from '@/api/books'

const router = useRouter()
const authStore = useAuthStore()
const booksStore = useBooksStore()
const searchQuery = ref('')
const failedCoverIds = ref({})
const sidebarOpen = ref(false)

function onCoverError(id) {
  failedCoverIds.value = { ...failedCoverIds.value, [id]: true }
}

const documents = computed(() =>
  (booksStore.books || []).map((book) => ({
    id: book.id,
    title: book.title,
    department: 'General',
    modified: book.created_at
      ? new Date(book.created_at).toLocaleDateString()
      : '—',
    total_pages: book.total_pages ?? 0,
    coverImage: booksApi.pageImageUrl(book.id, 1),
  }))
)

const filteredDocuments = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return documents.value
  return documents.value.filter((doc) =>
    doc.title.toLowerCase().includes(q)
  )
})

function navigateToFlipbook(id) {
  router.push(`/books/${id}`)
}

onMounted(() => {
  booksStore.fetchBooks()
})
</script>
