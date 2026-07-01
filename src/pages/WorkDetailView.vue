<template>
  <main class="w-full bg-black min-h-screen pt-40 pb-20 px-6 md:px-16 text-white relative">
    
    <GridHover class="pointer-events-none" />

    <div class="relative z-20 max-w-4xl mx-auto">
      <router-link to="/work" class="inline-block mb-10 text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition">
        ← BACK TO WORKS
      </router-link>

      <div v-if="project">
        <h1 class="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-4">{{ project.title }}</h1>
        <p class="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-10">{{ project.year }} // {{ project.tools }}</p>

        <p class="text-lg text-zinc-300 leading-relaxed mb-16 max-w-2xl">{{ project.description }}</p>

        <div class="masonry-gallery">
          <div v-for="(item, i) in project.gallery" :key="i" class="mb-6 break-inside-avoid">
            <video v-if="isVideo(item)" :src="item" autoplay loop muted playsinline class="w-full" />
            <img v-else :src="item" :alt="project.title" class="w-full" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import GridHover from '../components/GridHover.vue'

const route = useRoute()
const project = ref(null)

const isVideo = (path) => /\.(mp4|webm|mov)$/i.test(path)

async function fetchProject() {
  const res = await fetch('/data/projects.json')
  const projects = await res.json()
  project.value = projects.find(p => p.id === Number(route.params.id))
}

onMounted(fetchProject)
watch(() => route.params.id, fetchProject)
</script>

<style scoped>
.masonry-gallery { column-count: 1; column-gap: 1.5rem; }
@media (min-width: 768px) { .masonry-gallery { column-count: 2; } }
@media (min-width: 1024px) { .masonry-gallery { column-count: 3; } }
</style>