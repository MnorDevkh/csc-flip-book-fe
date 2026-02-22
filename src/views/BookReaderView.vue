<template>
  <div class="font-display bg-slate-50 text-slate-800 min-h-screen flex flex-col">
    <!-- Header -->
    <header class="h-12 sm:h-14 bg-white border-b border-slate-200/80 flex items-center justify-between gap-2 px-3 sm:px-5 sticky top-0 z-50 shrink-0">
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          aria-label="Back to documents"
          @click="router.push('/books')"
        >
          <span class="material-symbols-outlined !text-xl">arrow_back</span>
        </button>
        <div class="h-4 sm:h-5 w-px bg-slate-200 shrink-0 hidden sm:block" />
        <nav class="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm min-w-0">
          <router-link to="/books" class="text-slate-400 hover:text-primary transition-colors font-medium shrink-0 hidden sm:inline">
            Documents
          </router-link>
          <span class="material-symbols-outlined text-slate-300 !text-[14px] shrink-0 hidden sm:inline">chevron_right</span>
          <span class="text-slate-700 font-semibold truncate max-w-[140px] sm:max-w-[260px]">
            {{ book?.title || 'Loading...' }}
          </span>
        </nav>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span v-if="book" class="text-xs text-slate-400 font-medium">
          {{ book.total_pages }} pg
        </span>
      </div>
    </header>

    <!-- Reader Area: stable min-height so loading → flipbook doesn’t jump -->
    <main class="flex-1 flex flex-col overflow-hidden min-h-0">
      <div
        class="flex-1 flex items-center justify-center p-3 sm:p-6 relative min-h-0 overflow-auto reader-area"
      >
        <Transition name="reader-fade" mode="out-in">
          <!-- Loading -->
          <div
            v-if="loading"
            key="loading"
            class="reader-state w-full h-full min-h-[400px] flex flex-col items-center justify-center gap-3"
          >
            <svg class="animate-spin h-8 w-8 text-primary/60 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p class="text-sm text-slate-400 font-medium">Loading book...</p>
          </div>

          <!-- Error -->
          <div
            v-else-if="error"
            key="error"
            class="reader-state w-full h-full min-h-[400px] flex flex-col items-center justify-center text-center"
          >
            <span class="material-symbols-outlined !text-5xl text-red-300 mb-3 block">error</span>
            <p class="text-red-600 font-medium text-sm max-w-sm">{{ error }}</p>
            <button
              @click="loadBook"
              class="mt-4 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Try again
            </button>
          </div>

          <!-- Flipbook -->
          <div
            v-else-if="book"
            key="book"
            class="reader-state w-full h-full min-h-[400px] flex items-center justify-center"
          >
            <PdfFlipbook
              :key="book.id"
              :book-id="book.id"
              :total-pages="book.total_pages"
            />
          </div>
        </Transition>
      </div>

      <!-- Footer hint -->
      <div class="border-t border-slate-200/60 bg-white py-2 sm:py-3 px-4 sm:px-6 shrink-0">
        <p class="text-xs text-slate-400 text-center">
          Drag or click the page edges to turn pages
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import PdfFlipbook from '@/components/PdfFlipbook.vue'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

const book = ref(null)
const loading = ref(true)
const error = ref('')

async function loadBook() {
  const id = route.params.id
  if (!id) return
  loading.value = true
  error.value = ''
  try {
    book.value = await booksStore.fetchBook(id)
  } catch (e) {
    error.value =
      e.response?.data?.detail || e.message || 'Failed to load book'
  } finally {
    loading.value = false
  }
}

onMounted(loadBook)
watch(
  () => route.params.id,
  () => loadBook()
)
</script>

<style scoped>
.reader-area {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (min-width: 640px) {
  .reader-area {
    min-height: 65vh;
  }
}

.reader-state {
  flex: 1 1 auto;
  align-self: stretch;
}

.reader-fade-enter-active,
.reader-fade-leave-active {
  transition: opacity 0.2s ease;
}
.reader-fade-enter-from,
.reader-fade-leave-to {
  opacity: 0;
}
</style>
