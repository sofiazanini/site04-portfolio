<template>
  <main class="w-full min-h-screen bg-black text-white p-6 md:p-20 flex items-center justify-center">
    <GridHover />

    <div class="flex flex-col md:flex-row gap-8 md:gap-24 max-w-5xl w-full items-center text-center md:text-left z-10">
      
      <div class="w-64 h-64 md:w-96 md:h-96 shrink-0 shadow-2xl">
        <img :src="profileImg" alt="Sofia Zanini" class="w-full h-full object-cover transition-all duration-500" />
      </div>

      <div class="flex flex-col items-center md:items-start">
        <span class="text-[0.65rem] uppercase tracking-[0.2em] text-white/50 mb-2">Brescia, IT</span>
        <h1 class="text-4xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-4">Sofia Zanini</h1>
        <p class="text-sm md:text-base text-white/60 uppercase tracking-widest mb-6">Graphic Design & Multimedia</p>
        
        <p class="text-sm md:text-lg text-white/80 leading-relaxed max-w-md mb-8">
          Studentessa all'ultimo anno del corso di Graphic Design & Multimedia alla LABA a Brescia.
        </p>

        <ul class="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs uppercase tracking-widest">
          <li v-for="link in links" :key="link.label">
            <a 
              :href="link.href" 
              target="_blank" 
              class="hover:text-white text-white/50 underline underline-offset-4 block" 
              @mouseenter="applyScramble($event, link.label)"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script setup>
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import GridHover from '../components/GridHover.vue'
import profileImg from '../assets/about/profile-picture.jpg'

gsap.registerPlugin(ScrambleTextPlugin)

const links = [
  { label: 'Instagram', href: '#' },
  { label: 'Behance', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Email', href: 'mailto:sofizanini.graphic@gmail.com' }
]

const applyScramble = (e, text) => {
  gsap.to(e.target, { 
    duration: 0.8, 
    scrambleText: { text: text, chars: "upperAndLower", revealDelay: 0.5, speed: 0.3 } 
  })
}
</script>