<template>
  <main class="w-full bg-black h-screen flex flex-col overflow-hidden">
    <GridHover />

    <div class="flex-1 overflow-y-auto pt-24 pb-8 px-6 md:px-16">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <WorkCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>

    <footer class="relative h-[15vh] md:h-[25vh] flex items-end justify-center px-8 pb-8 z-10 overflow-hidden">
      <h1 
        ref="textRef"
        class="text-[10vw] leading-none font-bold uppercase cursor-default select-none tracking-tighter whitespace-nowrap"
        @mouseenter="scrambleText"
      >
        WORKS
      </h1>
    </footer>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import WorkCard from '../components/WorkCard.vue'
import GridHover from '../components/GridHover.vue'

gsap.registerPlugin(ScrambleTextPlugin)

const projects = ref([])
const textRef = ref(null)

async function fetchProjects() {
  try {
    const res = await fetch('/data/projects.json')
    projects.value = await res.json()
  } catch (err) {
    console.error('Errore fetch progetti:', err)
  }
}

function scrambleText() {
  gsap.to(textRef.value, { 
    duration: 0.6, 
    scrambleText: { 
      text: "WORKS", 
      chars: "!<>-=+*^?#@%$", 
      revealDelay: 0.2 
    } 
  })
}

onMounted(fetchProjects)
</script>