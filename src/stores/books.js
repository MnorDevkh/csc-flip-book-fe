import { defineStore } from 'pinia'
import { ref } from 'vue'
import { booksApi } from '@/api/books'

export const useBooksStore = defineStore('books', () => {
  const books = ref([])
  const currentBook = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchBooks() {
    loading.value = true
    error.value = null
    try {
      const { data } = await booksApi.list()
      books.value = data
      return data
    } catch (e) {
      error.value = e.response?.data?.detail || e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchBook(id) {
    loading.value = true
    error.value = null
    try {
      const { data } = await booksApi.get(id)
      currentBook.value = data
      return data
    } catch (e) {
      error.value = e.response?.data?.detail || e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  function clearCurrentBook() {
    currentBook.value = null
  }

  return {
    books,
    currentBook,
    loading,
    error,
    fetchBooks,
    fetchBook,
    clearCurrentBook,
  }
})
