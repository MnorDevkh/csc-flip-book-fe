<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-slate-900">Books</h2>
      <router-link
        to="/upload"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-sm shadow-primary/25 hover:bg-primary-dark transition-all"
      >
        <span class="material-symbols-outlined !text-[18px]">add</span>
        Add Book
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center gap-3 text-slate-400 py-8">
      <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span class="text-sm font-medium">Loading...</span>
    </div>

    <!-- Error -->
    <p v-else-if="error" class="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">{{ error }}</p>

    <!-- Table -->
    <div v-else class="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-100">
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pages</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
            <th class="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="book in books" :key="book.id" class="hover:bg-slate-50/50 transition-colors">
            <td class="px-5 py-3.5">
              <router-link :to="`/books/${book.id}`" class="text-sm font-medium text-slate-900 hover:text-primary transition-colors">
                {{ book.title }}
              </router-link>
            </td>
            <td class="px-5 py-3.5 text-sm text-slate-500">{{ book.total_pages }}</td>
            <td class="px-5 py-3.5 text-sm text-slate-500">{{ formatDate(book.created_at) }}</td>
            <td class="px-5 py-3.5 text-right">
              <button
                @click="onDelete(book.id)"
                class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
              >
                <span class="material-symbols-outlined !text-[14px]">delete</span>
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="books.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined !text-5xl text-slate-200 mb-3 block">library_books</span>
        <p class="text-sm text-slate-400">No books yet</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { booksApi } from '@/api/books'

const books = ref([])
const loading = ref(false)
const error = ref('')

async function fetchBooks() {
  loading.value = true
  error.value = ''
  try {
    const data = await booksApi.list()
    books.value = data ?? []
  } catch (e) {
    error.value = e.response?.data?.detail || e.message || 'Failed to fetch books'
    books.value = []
  } finally {
    loading.value = false
  }
}

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleString()
  } catch {
    return '—'
  }
}

async function onDelete(id) {
  if (!confirm('Delete this book?')) return
  try {
    await booksApi.delete(id)
    await fetchBooks()
  } catch (e) {
    alert(e.response?.data?.detail || e.message || 'Failed to delete')
  }
}

onMounted(fetchBooks)
</script>
