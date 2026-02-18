import { api } from './index'

export const uploadApi = {
  upload(file, title) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
