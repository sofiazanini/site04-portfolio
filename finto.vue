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
import WorkCard from '../components/WorkCard.vue'
import GridHover from '../components/GridHover.vue'

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






<template>
  <nav v-if="!open" class="fixed top-0 left-0 z-50 w-full flex justify-between items-center px-8 h-[10vh]">
    <div class="pointer-events-auto">
      <router-link 
        to="/" 
        class="font-mono text-sm uppercase tracking-widest text-white mix-blend-difference py-2"
        @mouseenter="scramble($event.target, 'SOFIA ZANINI')"
      >SOFIA ZANINI</router-link>
    </div>

    <div class="pointer-events-auto">
      <button
        @click="open = true"
        class="font-mono text-sm uppercase tracking-widest text-white mix-blend-difference py-2"
        @mouseenter="scramble($event.target, 'MENU')"
      >MENU</button>
    </div>
  </nav>

  <!-- menu full-screen overlay con fade transition -->
  <Transition
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    class="transition-opacity duration-500 ease-in-out"
  >
    <div v-if="open" class="fixed inset-0 bg-black z-50 flex flex-col justify-between px-8 text-white font-mono">
      
      <div class="h-[10vh] flex justify-between items-center w-full">
        <router-link to="/" class="text-sm uppercase tracking-widest text-white py-2" @click="open = false" @mouseenter="scramble($event.target, 'SOFIA ZANINI')">
          SOFIA ZANINI
        </router-link>
        <button @click="open = false" class="text-sm uppercase tracking-widest text-white py-2" @mouseenter="scramble($event.target, 'CLOSE')">
          CLOSE
        </button>
      </div>

      <div class="flex-1 grid grid-rows-3 w-full">
        <router-link
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          class="group border-b border-white/10 flex items-center justify-center transition-colors duration-300 hover:bg-white hover:text-black"
          @click="open = false"
          @mouseenter="scramble($event.target.querySelector('span'), item.label.toUpperCase())"
        >
          <span class="text-[8vw] font-bold uppercase tracking-tighter">{{ item.label.toUpperCase() }}</span>
        </router-link>
      </div>

      <div class="h-[10vh] border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-wider text-zinc-500 py-4">
        <a href="mailto:sofizanini.graphic@gmail.com" class="hover:text-white transition py-2" @mouseenter="scramble($event.target, 'SOFIZANINI.GRAPHIC@GMAIL.COM')">
          sofizanini.graphic@gmail.com
        </a>
        <div class="py-2">© {{ new Date().getFullYear() }} — all rights reserved</div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrambleTextPlugin)

const open = ref(false)
const items = [
  { path: '/', label: 'home' },
  { path: '/work', label: 'work' },
  { path: '/about', label: 'about' },
]

const scramble = (el, text) => {
  gsap.to(el, { 
    duration: 1.2, 
    scrambleText: { 
      text: text, 
      chars: '!<>-_\\/[]{}—=+*^?#_', 
      revealDelay: 0.2 
    } 
  })
}
</script>