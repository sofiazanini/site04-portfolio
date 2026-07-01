<template>
  <router-link
    :to="`/work/${project.id}`"
    class="group block relative aspect-7/5 overflow-hidden"
    @mouseenter="handleHover(true)"
    @mouseleave="handleHover(false)"
  >
    <img
      :src="project.image"
      :alt="project.title"
      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />

    <div ref="overlayRef" class="absolute inset-0 bg-black/80 opacity-0 transition-opacity duration-50"></div>

    <div ref="contentRef" class="absolute inset-0 p-10 flex flex-col justify-between opacity-0 pointer-events-none">
      
      <div v-if="project.tags?.length" class="flex flex-wrap gap-2 self-start">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white"
        >
          {{ tag }}
        </span>
      </div>

      <div class="self-start">
        <h3 class="text-xl font-bold tracking-tight text-white uppercase">{{ project.title }}</h3>
        <p class="text-xs text-zinc-300 mt-2 uppercase tracking-widest">{{ project.year }} // {{ project.tools }}</p>
      </div>
      
    </div>
  </router-link>
</template>

<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

defineProps({ project: Object })

const overlayRef = ref(null)
const contentRef = ref(null)

function handleHover(isEntering) {
  // Scurimento overlay
  gsap.to(overlayRef.value, { opacity: isEntering ? 1 : 0, duration: 0.4 })
  
  // Animazione contenuto
  gsap.to(contentRef.value, { 
    opacity: isEntering ? 1 : 0,  
    duration: 0.3,
    ease: "power2.out"
  })
}
</script>