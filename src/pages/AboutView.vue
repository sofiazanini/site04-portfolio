<template>
  <main class="w-full bg-black h-screen flex flex-col overflow-hidden">
    <GridHover />  

    <div class="flex-1 flex items-center justify-center">
      <ProfileCard :avatar="avatarImg" />
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
import GridHover from '../components/home/GridHover.vue'
import ProfileCard from '../components/ProfileCard.vue'
import avatarImg from '../assets/about/profile-picture.jpg'


// Aggiungi queste variabili nello script setup
const finalString = 'ABOUT'
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
