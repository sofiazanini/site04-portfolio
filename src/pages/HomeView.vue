<template>
  <main class="h-screen overflow-hidden bg-black text-white relative select-none">
    <GridHover />
    
    <section class="h-[80vh] w-full flex items-center justify-center z-10 pointer-events-none pt-[5vw]">
      <div ref="heroImg" class="pointer-events-auto cursor-crosshair transition-filter duration-50 ease-out hover:invert px-6">
        <img src="../assets/home/hero-img-mobile.webp" class="md:hidden w-[75vw] max-w-sm h-auto object-contain" alt="Hero Sofia Zanini Mobile" draggable="false" />
        <img src="../assets/home/hero-img-desktop.webp" class="hidden md:block w-[60vw] max-w-4xl h-auto object-contain" alt="Hero Sofia Zanini Desktop" draggable="false" />
      </div>
    </section>

    <footer class="relative h-[20vh] flex items-end justify-center px-8 pb-8 z-10 overflow-hidden">
      <h1 ref="textRef" @mouseenter="triggerScramble"
      class="text-center text-[10vw] leading-none font-bold uppercase cursor-default select-none tracking-tighter whitespace-nowrap">
        SOFIZANINI.GRAPHIC
      </h1>
    </footer>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import GridHover from '../components/GridHover.vue'

gsap.registerPlugin(ScrambleTextPlugin)

const heroImg = ref(null)
const textRef = ref(null)

// Scramble hover
const triggerScramble = () => {
  gsap.to(textRef.value, { 
    duration: 1, 
    scrambleText: { text: "SOFIZANINI.GRAPHIC", chars: "!<>-=+*^?#@%$", revealDelay: 0 } 
})
}

const handleMouseMove = (e) => {
  const { clientX, clientY } = e
  const xPos = (clientX / window.innerWidth) - 0.5
  const yPos = (clientY / window.innerHeight) - 0.5

  gsap.to(heroImg.value, { 
    x: xPos * 40, 
    y: yPos * 25, 
    scale: 1.03, 
    rotation: xPos * 4, 
    duration: 1, 
    ease: 'power2.out' 
  })
}

const handleMouseLeave = () => {
  gsap.to(heroImg.value, { x: 0, y: 0, scale: 1, rotation: 0, duration: 1.2, ease: 'power3.out' })
}

onMounted(() => {
  // Scramble iniziale
  gsap.to(textRef.value, { 
    duration: 1.5, 
    scrambleText: { text: "SOFIZANINI.GRAPHIC", chars: "!<>-=+*^?#@%$", revealDelay: 0.5 } 
  })

  // Animazione entrata img
  gsap.fromTo(heroImg.value, 
    { opacity: 0, scale: 0.95 }, 
    { opacity: 1, scale: 1, duration: 1.6, ease: 'power4.out' }
  )

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
})
</script>