<template>
  <div class="min-h-screen bg-background-light font-display">
    <!-- Header -->
    <header class="h-14 bg-white border-b border-slate-200/80 flex items-center gap-3 px-6 sticky top-0 z-50">
      <button
        type="button"
        class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
        @click="$router.push('/books')"
      >
        <span class="material-symbols-outlined !text-xl">arrow_back</span>
      </button>
      <div class="h-5 w-px bg-slate-200"></div>
      <h1 class="text-sm font-semibold text-slate-800">Upload Document</h1>
    </header>

    <!-- Content -->
    <main class="max-w-lg mx-auto px-6 py-12">
      <div class="bg-white border border-slate-200/80 rounded-xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <span class="material-symbols-outlined text-primary !text-xl">upload_file</span>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-900">Upload PDF</h2>
            <p class="text-sm text-slate-500">Add a new document to your library</p>
          </div>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input
              id="title"
              v-model="title"
              type="text"
              required
              placeholder="Enter document title"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">PDF File</label>
            <label
              for="file"
              class="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-8 cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] transition-all"
              :class="file ? 'border-primary/40 bg-primary/[0.02]' : ''"
            >
              <span class="material-symbols-outlined !text-4xl" :class="file ? 'text-primary' : 'text-slate-300'">
                {{ file ? 'check_circle' : 'cloud_upload' }}
              </span>
              <p v-if="file" class="text-sm font-medium text-primary">{{ file.name }}</p>
              <template v-else>
                <p class="text-sm font-medium text-slate-500">Click to select a file</p>
                <p class="text-xs text-slate-400">PDF files only</p>
              </template>
            </label>
            <input id="file" type="file" accept=".pdf" class="hidden" @change="onFileChange" />
          </div>

          <p v-if="error" class="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {{ error }}
          </p>
          <p v-if="success" class="text-emerald-600 text-sm bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
            {{ success }}
          </p>

          <button
            type="submit"
            :disabled="loading || !file"
            class="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/25 hover:bg-primary-dark focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>{{ loading ? 'Uploading...' : 'Upload document' }}</span>
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { uploadApi } from '@/api/upload'

const router = useRouter()
const title = ref('')
const file = ref(null)
const loading = ref(false)
const error = ref('')
const success = ref('')

function onFileChange(e) {
  file.value = e.target.files?.[0] || null
}

async function onSubmit() {
  if (!file.value) return
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    await uploadApi.upload(file.value, title.value)
    success.value = 'Document uploaded successfully!'
    title.value = ''
    file.value = null
    document.getElementById('file').value = ''
  } catch (e) {
    error.value = e.response?.data?.detail || e.message || 'Upload failed'
  } finally {
    loading.value = false
  }
}
</script>
