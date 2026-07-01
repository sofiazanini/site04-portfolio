<template>
  <div class="min-h-screen bg-black text-white overflow-x-hidden">
    <Intro v-if="showIntro" @done="finishIntro" /> <!-- se è true c'è l'intro, poi cambia in @done -->

    <template v-else>
      <MainMenu />
      <div class="relative z-10">
        <router-view /> <!-- fa caricare le pagine -->
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MainMenu from './components/MainMenu.vue'
import Intro from './components/Intro.vue'

const INTRO_KEY = 'intro-shown' // serve per capire se è già stata vista l'intro
const showIntro = ref(sessionStorage.getItem(INTRO_KEY) !== 'true') // se già vista salta al sito

function finishIntro() {
  sessionStorage.setItem(INTRO_KEY, 'true') // blocca l'intro per i prossimi refresh
  showIntro.value = false // nasconde l'intro e carica il sito
}
</script>