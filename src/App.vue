<template>
  <div class="min-h-screen bg-black text-white overflow-x-hidden">
    <Intro v-if="showIntro" @done="finishIntro" />
    <template v-else>
      <MainMenu />
      <div class="relative z-10">
        <router-view />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MainMenu from './components/MainMenu.vue'
import Intro from './components/Intro.vue'

// chiave sessionStorage: si resetta alla chiusura del browser/tab,
// quindi la intro torna a comparire ogni nuova sessione ma non ad ogni refresh/navigazione interna
const INTRO_KEY = 'intro-shown'

// se l'ho già vista in questa sessione, salto direttamente al sito
const showIntro = ref(sessionStorage.getItem(INTRO_KEY) !== 'true')

function finishIntro() {
  sessionStorage.setItem(INTRO_KEY, 'true')
  showIntro.value = false
}
</script>