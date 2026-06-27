<template>
  <main class="w-full bg-black min-h-screen text-white relative">
    <GridHover />


    <div class="relative z-10 pt-32 pb-16 px-6 md:px-16 max-w-5xl mx-auto">
        
      <p v-if="loading" class="text-center text-white/50 uppercase tracking-widest text-sm">Caricamento...</p>
      <p v-else-if="error || !project" class="text-center text-red-400 uppercase tracking-widest text-sm">Progetto non trovato.</p>

      <div v-else>
        <router-link  to="/work" class="inline-block mb-10 text-xs uppercase tracking-widest text-white/60 hover:text-white transition">
          ← torna ai progetti
        </router-link>

        <h1 class="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-2">
          {{ project.title }}
        </h1>
        <p class="text-xs uppercase tracking-widest text-white/50 mb-8">
          {{ project.year }} // {{ project.tools }}
        </p>

        <div v-if="project.tags?.length" class="flex flex-wrap gap-2 mb-10">
          <span
            v-for="(tag, i) in project.tags"
            :key="i"
            class="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/80"
          >
            {{ tag }}
          </span>
        </div>

        <p class="text-base text-white/70 leading-relaxed mb-12 max-w-2xl">
          {{ project.description }}
        </p>

        <!-- galleria masonry: columns invece di grid, ogni item mantiene il suo formato originale e si impila riempiendo i buchi, niente crop forzato -->
        <div v-if="project.gallery?.length" class="masonry-gallery">
          <template v-for="(item, i) in project.gallery" :key="i">
            <video
              v-if="isVideo(item)"
              :src="item"
              class="w-full mb-4 block"
              autoplay
              loop
              muted
              playsinline
            ></video>
            <img
              v-else
              :src="item"
              :alt="`${project.title} immagine ${i + 1}`"
              class="w-full mb-4 block"
            />
          </template>
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
const loading = ref(true)
const error = ref(false)

// controllo estensione file per decidere se mostrare <video> o <img>
function isVideo(path) {
  return /\.(mp4|webm|mov)$/i.test(path)
}

async function fetchProject() {
  loading.value = true
  error.value = false
  project.value = null

  try {
    const res = await fetch('/data/projects.json')
    if (!res.ok) throw new Error('Risposta non ok')
    const projects = await res.json()

    // params.id arriva sempre come stringa dall'url, per questo Number() prima del confronto
    project.value = projects.find(p => p.id === Number(route.params.id))
  } catch (err) {
    error.value = true
    console.error('Errore fetch dettaglio progetto:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProject)

// se navigo da un dettaglio a un altro (es. tramite link interni futuri)
// il componente non viene smontato/rimontato, quindi serve il watch sul param
watch(() => route.params.id, fetchProject)
</script>

<style scoped>
/* masonry via CSS columns: 1 colonna su mobile, 2 da desktop in su*/
.masonry-gallery {
  column-count: 1;
  column-gap: 1rem;
}

@media (min-width: 768px) {
  .masonry-gallery {
    column-count: 2;
  }
}
</style>