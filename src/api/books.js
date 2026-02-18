import { api } from './index'

const baseURL = import.meta.env.VITE_API_URL || '/api/v1'

export const booksApi = {
  list() {
    return api.get('/books')
  },
  get(id) {
    return api.get(`/books/${id}`)
  },
  streamUrl(id) {
    return `${baseURL}/books/${id}/stream`
  },
  pageImageUrl(id, pageNumber) {
    return `${baseURL}/books/${id}/pages/${pageNumber}`
  },
  delete(id) {
    return api.delete(`/books/${id}`)
  },
}
