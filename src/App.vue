<template>
  <div class="min-h-screen bg-black text-white overflow-x-hidden">

    <Intro v-if="showIntro" @done="showIntro = false" />

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

// Impostato su false per saltare la intro durante lo sviluppo
const showIntro = ref(false)
</script>