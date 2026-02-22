<template>
  <div ref="containerRef" class="pdf-flipbook">
    <div ref="bookRef" class="book-container" :class="alignmentClass" />
  </div>
</template>

<script setup>
/**
 * Image-based flipbook: each page is fetched independently as a server-rendered
 * PNG via /books/:id/pages/:pageNumber. No full-PDF download required — the user
 * sees pages as soon as each small image loads.
 */
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { PageFlip } from 'page-flip'
import { booksApi } from '@/api/books'

const props = defineProps({
  bookId: { type: String, required: true },
  totalPages: { type: Number, required: true },
})

const containerRef = ref(null)
const bookRef = ref(null)
const alignmentClass = ref('align-cover')

let pageFlip = null
let pageElements = []
let destroyed = false
const loadedPages = new Set()
const PREFETCH_BATCH = 3

const PAGE_WIDTH = 400
const PAGE_HEIGHT = 566

function createPageElements() {
  if (!bookRef.value) return
  bookRef.value.innerHTML = ''
  pageElements = []

  for (let i = 0; i < props.totalPages; i++) {
    const div = document.createElement('div')
    div.className = 'page'
    div.dataset.page = String(i + 1)
    div.style.width = `${PAGE_WIDTH}px`
    div.style.height = `${PAGE_HEIGHT}px`
    div.style.backgroundColor = '#fff'
    div.style.display = 'flex'
    div.style.alignItems = 'center'
    div.style.justifyContent = 'center'

    const spinner = document.createElement('div')
    spinner.className = 'page-spinner'
    div.appendChild(spinner)

    bookRef.value.appendChild(div)
    pageElements.push(div)
  }
}

function loadPage(pageNum) {
  const el = pageElements[pageNum - 1]
  if (!el || loadedPages.has(pageNum) || destroyed) return
  loadedPages.add(pageNum)

  return new Promise((resolve) => {
    const img = new Image()
    img.style.maxWidth = '100%'
    img.style.maxHeight = '100%'
    img.style.objectFit = 'contain'
    img.onload = () => {
      if (!destroyed) {
        el.innerHTML = ''
        el.appendChild(img)
      }
      resolve()
    }
    img.onerror = () => {
      loadedPages.delete(pageNum)
      resolve()
    }
    img.src = booksApi.pageImageUrl(props.bookId, pageNum)
  })
}

async function prefetchAll() {
  for (let i = 1; i <= props.totalPages; i += PREFETCH_BATCH) {
    if (destroyed) return
    const batch = []
    for (let j = i; j < i + PREFETCH_BATCH && j <= props.totalPages; j++) {
      batch.push(loadPage(j))
    }
    await Promise.all(batch)
  }
}

function initPageFlip() {
  if (!bookRef.value || pageFlip) return
  pageFlip = new PageFlip(bookRef.value, {
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    size: 'stretch',
    minWidth: 300,
    maxWidth: 500,
    minHeight: 424,
    maxHeight: 707,
    showCover: true,
    usePortrait: true,
    startPage: 0,
    flippingTime: 600,
  })
  pageFlip.loadFromHTML(document.querySelectorAll('.page'))

  const isBackCover = props.totalPages % 2 === 0
  pageFlip.on('flip', (e) => {
    const pageIndex = e.data
    const page = pageIndex + 1

    if (pageIndex === 0) {
      alignmentClass.value = 'align-cover'
    } else if (isBackCover && pageIndex >= props.totalPages - 1) {
      alignmentClass.value = 'align-back'
    } else {
      alignmentClass.value = ''
    }

    loadPage(page)
    if (page < props.totalPages) loadPage(page + 1)
    if (page > 1) loadPage(page - 1)
  })
}

function initFlipbook() {
  if (!containerRef.value || !bookRef.value || !props.bookId) return
  destroyed = false

  createPageElements()
  initPageFlip()

  prefetchAll()
}

function destroyFlipbook() {
  destroyed = true
  if (pageFlip) {
    pageFlip.destroy()
    pageFlip = null
  }
  pageElements = []
  loadedPages.clear()
}

onMounted(initFlipbook)
onBeforeUnmount(destroyFlipbook)
watch(() => props.bookId, () => {
  destroyFlipbook()
  initFlipbook()
})
</script>

<style scoped>
.pdf-flipbook {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.book-container {
  width: 100%;
  max-width: 900px;
  min-height: 500px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.book-container.align-cover {
  transform: translateX(-25%);
}
.book-container.align-back {
  transform: translateX(25%);
}

@media (max-width: 640px) {
  .book-container.align-cover {
    transform: translateX(-8%);
  }
  .book-container.align-back {
    transform: translateX(8%);
  }
  .pdf-flipbook {
    padding: 0.5rem 0;
  }
}
.book-container :deep(.page) {
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.06);
  border-radius: 2px;
}
.book-container :deep(.page-spinner) {
  width: 28px;
  height: 28px;
  border: 2.5px solid #e2e8f0;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.book-container :deep(img) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
