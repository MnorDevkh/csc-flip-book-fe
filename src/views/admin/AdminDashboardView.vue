<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white border border-slate-200/80 rounded-xl p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
            <span class="material-symbols-outlined text-primary !text-[20px]">library_books</span>
          </div>
          <span class="text-sm font-medium text-slate-500">Total Books</span>
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ bookCount }}</p>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-xl p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
            <span class="material-symbols-outlined text-emerald-600 !text-[20px]">check_circle</span>
          </div>
          <span class="text-sm font-medium text-slate-500">System Status</span>
        </div>
        <p class="text-2xl font-bold text-emerald-600">Online</p>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-xl p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
            <span class="material-symbols-outlined text-blue-600 !text-[20px]">info</span>
          </div>
          <span class="text-sm font-medium text-slate-500">Version</span>
        </div>
        <p class="text-2xl font-bold text-slate-900">1.0.0</p>
      </div>
    </div>

    <div class="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-100">
        <h3 class="text-sm font-semibold text-slate-900">System Information</h3>
      </div>
      <div class="divide-y divide-slate-100">
        <div class="px-5 py-3 flex items-center justify-between">
          <span class="text-sm text-slate-500">Database</span>
          <span class="text-sm font-medium text-slate-900">Connected</span>
        </div>
        <div class="px-5 py-3 flex items-center justify-between">
          <span class="text-sm text-slate-500">Storage</span>
          <span class="text-sm font-medium text-slate-900">Cloudflare R2</span>
        </div>
        <div class="px-5 py-3 flex items-center justify-between">
          <span class="text-sm text-slate-500">Frontend</span>
          <span class="text-sm font-medium text-slate-900">Vue 3 + Vite</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { booksApi } from '@/api/books'

const bookCount = ref(0)

onMounted(async () => {
  try {
    const data = await booksApi.list()
    bookCount.value = data?.length ?? 0
  } catch {
    bookCount.value = 0
  }
})
</script>
