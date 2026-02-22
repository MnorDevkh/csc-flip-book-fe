<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-lg font-bold text-slate-900">Books Management</h2>
        <p class="text-sm text-slate-500 mt-0.5">View, open, and delete books</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative flex-1 sm:flex-initial sm:w-56">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 !text-lg text-slate-400">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title..."
            class="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>
        <router-link
          :to="{ path: '/upload', query: { from: 'admin' } }"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-sm shadow-primary/25 hover:bg-primary-dark transition-all shrink-0"
        >
          <span class="material-symbols-outlined !text-[18px]">add</span>
          Add Book
        </router-link>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center gap-3 text-slate-400 py-12">
      <svg class="animate-spin h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span class="text-sm font-medium">Loading books...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
      <span class="material-symbols-outlined text-red-400 !text-2xl">error</span>
      <p class="text-red-700 text-sm font-medium">{{ error }}</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[600px]">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/80">
              <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">Cover</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pages</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="book in filteredBooks" :key="book.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-5 py-3">
                <router-link :to="`/books/${book.id}`" class="block w-10 h-14 rounded overflow-hidden bg-slate-100 shrink-0">
                  <img
                    v-if="!failedCovers[book.id]"
                    :src="coverUrl(book.id)"
                    :alt="book.title"
                    class="w-full h-full object-cover"
                    @error="failedCovers[book.id] = true"
                  />
                  <span v-else class="w-full h-full flex items-center justify-center text-slate-300">
                    <span class="material-symbols-outlined !text-2xl">description</span>
                  </span>
                </router-link>
              </td>
              <td class="px-5 py-3.5">
                <router-link :to="`/books/${book.id}`" class="text-sm font-medium text-slate-900 hover:text-primary transition-colors">
                  {{ book.title || 'Untitled' }}
                </router-link>
              </td>
              <td class="px-5 py-3.5 text-sm text-slate-500">{{ book.total_pages ?? '—' }}</td>
              <td class="px-5 py-3.5 text-sm text-slate-500">{{ formatDate(book.created_at) }}</td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <a
                    :href="`/books/${book.id}`"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    <span class="material-symbols-outlined !text-[14px]">open_in_new</span>
                    Open
                  </a>
                  <button
                    @click="onDelete(book)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  >
                    <span class="material-symbols-outlined !text-[14px]">delete</span>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredBooks.length === 0" class="text-center py-16">
        <span class="material-symbols-outlined !text-5xl text-slate-200 mb-3 block">library_books</span>
        <p class="text-sm font-medium text-slate-500">No books found</p>
        <p class="text-xs text-slate-400 mt-1">
          {{ searchQuery ? 'Try a different search.' : 'Upload a PDF to get started.' }}
        </p>
        <router-link
          v-if="!searchQuery"
          :to="{ path: '/upload', query: { from: 'admin' } }"
          class="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <span class="material-symbols-outlined !text-[18px]">add</span>
          Add Book
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { booksApi } from '@/api/books'

const books = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const failedCovers = ref({})

function coverUrl(bookId) {
  return booksApi.pageImageUrl(bookId, 1)
}

async function fetchBooks() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await booksApi.list()
    books.value = Array.isArray(data) ? data : (data?.data ?? [])
  } catch (e) {
    error.value = e.response?.data?.detail || e.message || 'Failed to fetch books'
    books.value = []
  } finally {
    loading.value = false
  }
}

const filteredBooks = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return books.value
  return books.value.filter((b) => (b.title || '').toLowerCase().includes(q))
})

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleString()
  } catch {
    return '—'
  }
}

async function onDelete(book) {
  if (!confirm(`Delete "${book.title || 'this book'}"? This cannot be undone.`)) return
  try {
    await booksApi.delete(book.id)
    await fetchBooks()
  } catch (e) {
    alert(e.response?.data?.detail || e.message || 'Failed to delete')
  }
}

onMounted(fetchBooks)
</script>
