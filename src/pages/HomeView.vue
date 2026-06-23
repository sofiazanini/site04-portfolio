<template>
  <main class="h-screen overflow-hidden bg-black text-white relative select-none">
    <GridHover />
    <section class="relative h-[70vh] w-full flex items-center justify-center z-10 pointer-events-none">
      <div class="relative w-full max-w-7xl h-auto md:h-96 flex flex-col md:flex-row items-center md:justify-between px-6 md:px-16 mt-16 md:mt-60 py-8">
      <!-- imgLeft -->
      <div ref="imgLeft" class="md:absolute md:left-24 md:top-4 w-64 md:w-150 pointer-events-auto cursor-crosshair transition-filter duration-500 ease-out style-invert">
        <img src="../assets/home/img-camera.png" class="w-full h-auto object-contain" alt="Hero Camera" draggable="false" />
      </div>

      <!-- imgRight -->
      <div ref="imgRight" class="md:absolute md:right-24 md:bottom-4 w-64 md:w-150 pointer-events-auto cursor-crosshair transition-filter duration-500 ease-out style-invert mt-6 md:mt-0">
        <img src="../assets/home/img-computer.png" class="w-full h-auto object-contain" alt="Hero Computer" draggable="false" />
      </div>
      </div>
    </section>
    <footer class="relative h-[30vh] flex items-end justify-center px-8 pb-8 z-10 overflow-hidden">
      <h1 class="w-full text-center text-[10vw] leading-none font-bold uppercase cursor-default select-none tracking-tighter whitespace-nowrap" @mouseenter="scrambleText">
        {{ displayText }}
      </h1>
    </footer>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import GridHover from '../components/home/GridHover.vue'

const imgLeft = ref(null)
const imgRight = ref(null)
const finalString = 'SOFIZANINI.GRAPHIC'
const displayText = ref('')
const chars = '!<>-=+*^?#@%$'
let isScrambling = false

function scrambleText() {
  if (isScrambling) return
  isScrambling = true
  let iterations = 0
  const totalFrames = 20
  const interval = setInterval(() => {
    displayText.value = finalString.split('').map((letter, index) => {
      if (letter === '.' || letter === ' ') return letter
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

const handleMouseMove = (e) => {
  const { clientX, clientY } = e
  const { innerWidth, innerHeight } = window
  const xPos = (clientX / innerWidth) - 0.5
  const yPos = (clientY / innerHeight) - 0.5

  gsap.to(imgLeft.value, { x: xPos * 50, y: yPos * 35, rotation: -6 + (xPos * 6), duration: 0.9, ease: 'power2.out' })
  gsap.to(imgRight.value, { x: xPos * -60, y: yPos * -45, rotation: 8 + (yPos * -8), duration: 1.3, ease: 'power2.out' })
}

onMounted(() => {
  scrambleText()
  window.addEventListener('mousemove', handleMouseMove)
  gsap.fromTo(imgLeft.value, { opacity: 0, scale: 0.9, rotation: -15 }, { opacity: 1, scale: 1, rotation: -6, duration: 1.4, ease: 'power3.out' })
  gsap.fromTo(imgRight.value, { opacity: 0, scale: 0.9, rotation: 15 }, { opacity: 1, scale: 1, rotation: 8, duration: 1.4, ease: 'power3.out', delay: 0.15 })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.style-invert { filter: invert(1); }
.style-invert:hover { filter: invert(0); }
.transition-filter { transition: filter 0.4s cubic-bezier(0.25, 1, 0.5, 1); }
</style>