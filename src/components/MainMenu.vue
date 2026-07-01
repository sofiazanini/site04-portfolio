<template>
  <!-- Nav Bar Fissa -->
  <nav class="fixed top-0 left-0 z-50 w-full px-8 h-[10vh] flex items-center justify-between">
    <router-link 
      to="/" 
      class="font-mono text-sm uppercase tracking-widest text-white mix-blend-difference py-2 block"
      @mouseenter="scramble($event.target, 'SOFIA ZANINI')"
    >
      SOFIA ZANINI
    </router-link>

    <button
      v-if="!open"
      @click="open = true"
      class="font-mono text-sm uppercase tracking-widest text-white mix-blend-difference py-2"
      @mouseenter="scramble($event.target, 'MENU')"
    >
      MENU
    </button>
  </nav>

  <!-- Titolo dinamico -->
  <div class="fixed top-[10vh] left-8 z-40 -mt-6">
    <h1 
      ref="titleRef" 
      class="font-mono text-sm uppercase tracking-widest text-zinc-500 mix-blend-difference h-6"
    >
      {{ currentTitle }}
    </h1>
  </div>

  <!-- Overlay menu -->
  <Transition
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    class="transition-opacity duration-500 ease-in-out"
  >
    <div v-if="open" class="fixed inset-0 bg-black z-100 flex flex-col justify-between px-8 text-white font-mono">
      <div class="h-[10vh] flex justify-between items-center w-full">
        <router-link to="/" class="text-sm uppercase tracking-widest text-white py-2" @click="open = false" @mouseenter="scramble($event.target, 'SOFIA ZANINI')">
          SOFIA ZANINI
        </router-link>
        <button @click="open = false" class="text-sm uppercase tracking-widest text-white py-2" @mouseenter="scramble($event.target, 'CLOSE')">
          CLOSE
        </button>
      </div>

      <div class="flex-1 grid grid-rows-3 w-full">
        <router-link
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          class="group border-b border-white/10 flex items-center justify-center transition-colors duration-300 hover:bg-white hover:text-black"
          @click="open = false"
          @mouseenter="scramble($event.target.querySelector('span'), item.label.toUpperCase())"
        >
          <span class="text-[8vw] font-bold uppercase tracking-tighter">{{ item.label.toUpperCase() }}</span>
        </router-link>
      </div>

      <div class="h-[10vh] border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-wider text-zinc-500 py-4">
        <a href="mailto:sofizanini.graphic@gmail.com" class="hover:text-white transition py-2" @mouseenter="scramble($event.target, 'SOFIZANINI.GRAPHIC@GMAIL.COM')">
          sofizanini.graphic@gmail.com
        </a>
        <div class="py-2">© {{ new Date().getFullYear() }} — all rights reserved</div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrambleTextPlugin)

const open = ref(false)
const route = useRoute()
const titleRef = ref(null)

const items = [
  { path: '/', label: 'home' },
  { path: '/work', label: 'work' },
  { path: '/about', label: 'about' },
]

const currentTitle = computed(() => {
  const titles = { '/work': '/WORKS', '/about': '/ABOUT' }
  return titles[route.path] || ''
})

const scramble = (el, text) => {
  if (!el) return
  gsap.to(el, { 
    duration: 1.2, 
    scrambleText: { 
      text: text, 
      chars: '!<>-_\\/[]{}—=+*^?#_', 
      revealDelay: 0.2 
    } 
  })
}

watch(currentTitle, async (newVal) => {
  await nextTick()
  if (titleRef.value) {
    scramble(titleRef.value, newVal)
  }
})
</script>