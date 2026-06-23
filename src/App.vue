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

// La variabile parte sempre su true, quindi ad ogni refresh la intro appare
const showIntro = ref(true)

function finishIntro() {
  showIntro.value = false
}
</script>