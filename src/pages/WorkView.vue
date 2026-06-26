<template>
  <main class="w-full bg-black h-screen flex flex-col overflow-hidden">
    <GridHover />

    <div class="flex-1 overflow-y-auto pt-24 pb-8 px-6 md:px-16">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3">
        <WorkCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>

    <footer class="relative h-[15vh] md:h-[25vh] flex items-end justify-center px-8 pb-8 z-10 overflow-hidden">
      <h1 class="w-full text-center text-[10vw] leading-none font-bold uppercase cursor-default select-none tracking-tighter whitespace-nowrap" @mouseenter="scrambleText">
        {{ displayText }}
      </h1>
    </footer>

  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import WorkCard from '../components/work/WorkCard.vue'
import GridHover from '../components/home/GridHover.vue'

// dati progetti caricati via fetch (API JSON locale)
const projects = ref([])
const loading = ref(true)
const error = ref(false)

async function fetchProjects() {
  try {
    const res = await fetch('/data/projects.json');   // Avvia la richiesta HTTP
    if (!res.ok) throw new Error('Risposta non ok');  // Verifica stato successo
    projects.value = await res.json();                // Estrae e salva i dati
  } catch (err) {
    error.value = true;                               // Gestisce lo stato errore
    console.error('Errore fetch progetti:', err);     // Log per il debug
  } finally {
    loading.value = false;                            // Disattiva il loading
  }
}

const finalString = 'WORKS'
const displayText = ref(finalString)
const chars = '!<>-=+*^?#@%$'
let isScrambling = false

function scrambleText() {
  if (isScrambling) return
  isScrambling = true
  let iterations = 0
  const totalFrames = 20

  const interval = setInterval(() => {
    displayText.value = finalString.split('').map((letter, index) => {
      if (index < (iterations / totalFrames) * finalString.length) return finalString[index]
      return chars[Math.floor(Math.random() * chars.length)]
    }).join('')

    if (iterations >= totalFrames) {
      clearInterval(interval)
      displayText.value = finalString
      isScrambling = false
    }
    iterations++
  }, 30)
}

onMounted(() => {
  fetchProjects()
})
</script>