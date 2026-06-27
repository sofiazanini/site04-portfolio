<template>
  <div ref="introRef" class="fixed inset-0 z-999 bg-black text-white flex items-center justify-center px-8" >
    <GridHover />

    <div class="relative z-10 flex flex-col items-center gap-10 md:gap-6 w-full"> 
      <span class="font-mono text-4xl md:text-5xl font-bold tracking-tight text-white/90">
        <!-- counter --> {{ String(loadingPercent).padStart(3, '0') }}%
      </span>

      <div class="relative w-full min-h-28 md:h-36 flex items-center justify-center px-4">
        <h1
          v-for="(line, i) in lines"
          :key="i"
          ref="lineRefs"
          class="absolute text-center font-bold opacity-0 font-mono will-change-transform whitespace-normal md:whitespace-nowrap leading-tight"
          style="font-size: clamp(2.25rem, 9vw, 5.5rem);"
        >
          {{ displayLines[i] }}
        </h1>
      </div>

    </div>

    <div
      ref="progressBarRef"
      class="absolute bottom-0 left-0 w-full h-1.5 bg-white origin-left scale-x-0 z-10"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import GridHover from './home/GridHover.vue'

const emit = defineEmits(['done']) // avvisa App.vue quando l'intro finisce

const introRef = ref(null)
const lineRefs = ref([])
const progressBarRef = ref(null)


const lines = [
  'Hi',
  "I'm Sofia",
  'Graphic Design Student',
  'Nice to meet you!',
]

const displayLines = ref(lines.map(() => ''))

const loadingPercent = ref(0)

const chars = '!<>-_\\/[]{}—=+*^?#________' // caratteri per l'effetto

// fa l'effetto testo glitch/scramble riga per riga
function scrambleLine(index, originalText, duration = 0.6) {
  return new Promise((resolve) => {
    const obj = { progress: 0 }
    gsap.to(obj, {
      progress: 1,
      duration,
      ease: 'power1.inOut',
      onUpdate: () => {
        const decodeCount = Math.floor(obj.progress * originalText.length)
        let currentText = ''
        for (let i = 0; i < originalText.length; i++) {
          if (originalText[i] === ' ' || originalText[i] === "'") {
            currentText += originalText[i]
          } else if (i < decodeCount) {
            currentText += originalText[i]
          } else {
            currentText += chars[Math.floor(Math.random() * chars.length)]
          }
        }
        displayLines.value[index] = currentText
      },
      onComplete: () => {
        displayLines.value[index] = originalText
        resolve()
      }
    })
  })
}

// tempistiche fisse della sequenza per sincronizzare counter e barra
const ENTER_DURATION = 0.6
const SCRAMBLE_DURATION = 0.6
const PAUSE_DURATION = 0.5
const EXIT_DURATION = 0.5
const LINE_DURATION = ENTER_DURATION + SCRAMBLE_DURATION + PAUSE_DURATION + EXIT_DURATION

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // se l'utente ha le animazioni disattivate nel sistema operativo, fa solo un fade rapido
  if (prefersReducedMotion) {
    displayLines.value = [...lines]
    loadingPercent.value = 100

    const tl = gsap.timeline({ onComplete: () => emit('done') })
    lineRefs.value.forEach((el) => {
      tl.to(el, { opacity: 1, duration: 0.4 })
      tl.to(el, { opacity: 0, duration: 0.4, delay: 0.6 })
    })
    tl.to(introRef.value, { opacity: 0, duration: 0.4 })
    return
  }

  const totalDuration = lines.length * LINE_DURATION // calcola la durata totale reale

  // fa avanzare il counter da 0 a 100 in sincrono con le righe
  const progressObj = { value: 0 }
  gsap.to(progressObj, {
    value: 100,
    duration: totalDuration,
    ease: 'none',
    onUpdate: () => {
      loadingPercent.value = Math.floor(progressObj.value)
    }
  })

  gsap.to(progressBarRef.value, { // allunga la barra in basso da 0 a 1
    scaleX: 1,
    duration: totalDuration,
    ease: 'none'
  })

  // loop asincrono per gestire la sequenza delle frasi
  async function playSequence() {
    for (let i = 0; i < lines.length; i++) {
      const el = lineRefs.value[i]

      gsap.set(el, { scale: 0.85, filter: 'blur(8px)' }) // 1. entra col blur
      await gsap.to(el, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: ENTER_DURATION,
        ease: 'power2.out'
      }).then()

      await scrambleLine(i, lines[i], SCRAMBLE_DURATION)       // 2. fa l'effetto scramble

      await new Promise((r) => setTimeout(r, PAUSE_DURATION * 1000)) // 3. resta ferma leggibile

      await gsap.to(el, { // 4. esce col blur ingrandendosi
        opacity: 0,
        scale: 1.1,
        filter: 'blur(8px)',
        duration: EXIT_DURATION,
        ease: 'power2.in'
      }).then()
    }

    loadingPercent.value = 100
    gsap.set(progressBarRef.value, { scaleX: 1 })


    await new Promise((r) => setTimeout(r, 150)) // breve pausa col 100% fisso

    // 5. effetto sipario: la barra riempie lo schermo e tutto sale su
    await gsap.to(progressBarRef.value, {
      height: '100vh',
      duration: 0.3,
      ease: 'power3.in'
    }).then()

    await gsap.to(introRef.value, {
      y: '-100%',
      duration: 0.45,
      ease: 'power3.inOut'
    }).then()

    emit('done')
  }

  playSequence()
})
</script>