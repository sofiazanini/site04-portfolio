<template>
  <div class="relative group aspect-7/5 overflow-hidden" 
       @mouseenter="togglePixels(true)" 
       @mouseleave="togglePixels(false)">
    
    <div class="absolute inset-0 w-full h-full p-2">
      <img 
        :src="project.image" 
        :alt="project.title" 
        ref="imgRef"
        class="w-full h-full object-cover transition-all duration-500" 
      />
    </div>

    <div class="absolute inset-0 grid grid-cols-8 grid-rows-6 pointer-events-none">
      <div v-for="i in 48" :key="i" class="pixel bg-black opacity-0"></div>
    </div>

    <div v-if="project.tags?.length" ref="tagsRef" class="absolute inset-x-0 top-0 flex flex-wrap items-center gap-2 p-10 opacity-0 pointer-events-none">
      <span
        v-for="(tag, index) in project.tags"
        :key="index"
        class="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/80"
      >
        {{ tag }}
      </span>
    </div>

    <div ref="detailsRef" class="absolute inset-x-0 bottom-0 flex flex-col justify-end p-10 opacity-0 pointer-events-none">
      <h3 class="text-xl font-bold tracking-tight text-white uppercase">
        {{ project.title }}
      </h3>
      <p class="text-xs text-zinc-300 mt-2 uppercase tracking-widest">
        {{ project.year }} // {{ project.tools }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

const props = defineProps({ project: Object })
const detailsRef = ref(null)
const tagsRef = ref(null)

function togglePixels(isEntering) {
  // Seleziona i pixel di questa specifica card
  const pixels = detailsRef.value.parentElement.querySelectorAll('.pixel')
  
  // Animazione Pixel
  gsap.to(pixels, {
    opacity: isEntering ? 1 : 0,
    stagger: {
      grid: [6, 8],
      from: "random",
      amount: 0.3
    },
    duration: 0.2
  })

  // Animazione Testo
  gsap.to(detailsRef.value, {
    opacity: isEntering ? 1 : 0,
    duration: 0.3,
    delay: isEntering ? 0.1 : 0
  })

  if (tagsRef.value) {
    gsap.to(tagsRef.value, {
      opacity: isEntering ? 1 : 0,
      duration: 0.3,
      delay: isEntering ? 0.1 : 0
    })
  }
}
</script>