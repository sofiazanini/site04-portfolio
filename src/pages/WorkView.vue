<template>
  <main class="w-full bg-black h-screen flex flex-col overflow-hidden">
    <GridHover />  

    <div class="flex-1 overflow-y-auto pt-24 pb-8 px-6 md:px-16">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3">
        <WorkCard 
          v-for="(project, i) in projects" 
          :key="i" 
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

const projects = [
  { title: 'Project One', year: 2025, tools: 'Vue, GSAP', tags: ['Web', 'Motion'], image: 'src/assets/works/works-cover-modula.jpg' },
  { title: 'Project Two', year: 2025, tools: 'Branding', tags: ['Branding', 'Editorial'], image: 'src/assets/works/works-cover-doomsday-clock.jpg'},
  { title: 'Project Three', year: 2024, tools: 'UI Design', tags: ['UI', 'Digital'], image: 'src/assets/works/works-cover-modula.jpg' },
  { title: 'Project Four', year: 2024, tools: 'Motion', tags: ['Motion', 'Animation'], image: 'src/assets/works/works-cover-doomsday-clock.jpg'},
  { title: 'Project Five', year: 2023, tools: 'Web', tags: ['Web', 'Editorial'], image: 'src/assets/works/works-cover-modula.jpg' },
  { title: 'Project Six', year: 2023, tools: 'Art Direction', tags: ['Art Direction', 'Campaign'], image: 'src/assets/works/works-cover-doomsday-clock.jpg'},
]

// Aggiungi queste variabili nello script setup
const finalString = 'WORKS'
const displayText = ref(finalString) // Inizializza col testo reale
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
</script>
