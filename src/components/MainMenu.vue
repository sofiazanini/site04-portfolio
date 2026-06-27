<template>
  <nav v-if="!open" class="fixed top-0 left-0 z-50 w-full flex justify-between items-center px-8 h-[10vh] pointer-events-none"> <!-- navbar fissa, nascosta quando menu è aperto -->
    
    <div class="pointer-events-auto">
      <router-link 
        to="/" 
        class="font-mono text-sm uppercase tracking-widest text-white select-none mix-blend-difference inline-block py-2"
        @mouseenter="scrambleText($event, 'sofia zanini')" >
        <span>sofia zanini</span>
      </router-link>
    </div>

    <div class="pointer-events-auto">
      <button
        @click="open = true"
        class="font-mono text-sm uppercase tracking-widest text-white hover:text-zinc-400 transition mix-blend-difference py-2"
        @mouseenter="scrambleText($event, 'menu')" >
        menu
      </button>
    </div>
  </nav>

  <!-- menu full-screen overlay con fade transition -->
  <Transition
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    class="transition-opacity duration-300"
  >

    <div
      v-if="open"
      class="fixed inset-0 bg-black z-50 flex flex-col justify-between select-none px-8 text-white font-mono"
    >

    <!-- header: logo + close btn (router link è automatico) -->
      <div class="h-[10vh] min-h-[10vh] flex justify-between items-center w-full">
        <router-link 
          to="/" 
          class="text-sm uppercase tracking-widest text-white py-2"
          @click="open = false"
          @mouseenter="scrambleText($event, 'sofia zanini')"
        >
          sofia zanini
        </router-link>
        
        <button
          @click="open = false"
          class="text-sm uppercase tracking-widest text-white hover:text-zinc-400 transition py-2"
          @mouseenter="scrambleText($event, 'close')"
        >
          close
        </button>
      </div>

      <!-- 3 routes in grid di uguale altezza -->
      <div class="flex-1 grid grid-rows-3 w-full">
        <router-link
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          class="group relative border-b border-white/10 last:border-b-0 hover:bg-white text-white hover:text-black transition-colors duration-300 flex items-center justify-center overflow-hidden w-full h-full"
          @click="open = false"
          @mouseenter="scrambleText($event, item.label)"
        >
          <span class="text-center text-[8vw] leading-none font-bold uppercase tracking-tighter whitespace-nowrap z-10 pointer-events-none inline-block">
            {{ item.label }}
          </span>
        </router-link>
      </div>

      <!-- footer: social links + email + copyright -->
      <div class="h-[10vh] min-h-[10vh] border-t border-white/10 flex justify-between items-center text-[11px] uppercase tracking-wider text-zinc-500 w-full">
        <div class="flex gap-6">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-white transition py-2"
            @mouseenter="scrambleText($event, social.name)"
          >
            {{ social.name }}
          </a>
        </div>
        
        <div>
          <a 
            href="mailto:sofizanini.graphic@gmail.com" 
            class="hover:text-white transition font-sans lowercase text-[12px] py-2 inline-block"
            @mouseenter="scrambleText($event, 'sofizanini.graphic@gmail.com')"
          >
            sofizanini.graphic@gmail.com
          </a>
        </div>

        <div class="text-right text-zinc-500 select-none py-2">
          © {{ new Date().getFullYear() }} — all rights reserved
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

const socials = [
  { name: 'instagram', url: 'https://www.instagram.com/_sofizanini.graphic_/' },
  { name: 'behance', url: 'https://www.behance.net/sofizanini_graphic' },
  { name: 'pinterest', url: 'https://it.pinterest.com/sofizaninigraphic/' }
]

const open = ref(false)
const items = [
  { path: '/', label: 'home' },
  { path: '/work', label: 'work' },
  { path: '/about', label: 'about' },
]

const chars = '!<>-_\\/[]{}—=+*^?#________'
const activeTweens = new Map() // mappa per non sovrapporre più animazioni
const scrambleText = (e, originalText) => { // scramle per tutti i testi
  const el = e.target.querySelector('span') || e.target
  if (!el) return
  if (activeTweens.has(el)) {
    activeTweens.get(el).kill()
  }

  const obj = { progress: 0 }
  const tween = gsap.to(obj, {
    progress: 1,
    duration: 0.5,
    ease: 'power1.inOut',
    onUpdate: () => {
      const decodeCount = Math.floor(obj.progress * originalText.length)
      let currentText = ''
      for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] === ' ' || originalText[i] === '.' || originalText[i] === '@') {
          currentText += originalText[i]
        } else if (i < decodeCount) {
          currentText += originalText[i]
        } else {
          currentText += chars[Math.floor(Math.random() * chars.length)]
        }
      }
      el.textContent = currentText
    },
    onComplete: () => {
      el.textContent = originalText
      activeTweens.delete(el)
    }
  })
  activeTweens.set(el, tween)
}
</script>