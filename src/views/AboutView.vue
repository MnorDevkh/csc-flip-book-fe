<template>
  <div class="min-h-screen bg-background-light font-display flex flex-col">
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
      <h1 class="text-sm font-semibold text-slate-800">About</h1>
    </header>

    <!-- Content -->
    <main class="flex-1 flex items-center justify-center p-6">
      <div class="max-w-md w-full text-center">
        <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span class="material-symbols-outlined text-primary !text-4xl">menu_book</span>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">DocPortal</h2>
        <p class="text-slate-500 mb-8 leading-relaxed">
          Your interactive flipbook reader for documents and publications.
          Browse, read, and enjoy a seamless digital reading experience.
        </p>

        <div class="bg-white border border-slate-200/80 rounded-xl p-5 text-left space-y-3 mb-8">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-500">Version</span>
            <span class="font-medium text-slate-900">1.0.0</span>
          </div>
          <div class="border-t border-slate-100"></div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-500">Framework</span>
            <span class="font-medium text-slate-900">Vue 3</span>
          </div>
          <div class="border-t border-slate-100"></div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-500">Reader</span>
            <span class="font-medium text-slate-900">Page-flip</span>
          </div>
        </div>

        <router-link
          to="/books"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          <span class="material-symbols-outlined !text-[18px]">arrow_back</span>
          Back to Documents
        </router-link>
      </div>
    </main>
  </div>
</template>
