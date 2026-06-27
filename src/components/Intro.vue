<template>
  <div ref="introRef" class="fixed inset-0 z-[999] bg-black text-white flex items-center justify-center px-8">
    <GridHover />

    <div class="relative z-10 flex flex-col items-center gap-10 md:gap-6 w-full">
      <span class="font-mono text-4xl md:text-5xl font-bold tracking-tight text-white/90">
        {{ String(loadingPercent).padStart(3, '0') }}% <!-- counter a 3 cifre -->
      </span>

      <div class="relative w-full min-h-28 md:h-36 flex items-center justify-center px-4">
        <h1
          v-for="(line, i) in lines"
          :key="line"
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
import GridHover from './GridHover.vue'

const emit = defineEmits(['done']) // avvisa App.vue quando l'intro finisce

const introRef = ref(null) // contenitore principale da far uscire verso l'alto
const lineRefs = ref([]) // array degli h1 generati dal v-for, usato da GSAP
const progressBarRef = ref(null) // barra in basso: prima progresso, poi effetto sipario

const lines = [
  'Hi',
  "I'm Sofia",
  'Graphic Design Student',
  'Nice to meet you!',
]

const displayLines = ref(lines.map(() => '')) // il testo parte vuoto poi scramble
const loadingPercent = ref(0)
const chars = '!<>-_\\/[]{}—=+*^?#________' // caratteri per l'effetto

// fa l'effetto testo glitch/scramble riga per riga
function scrambleLine(index, originalText, duration = 0.6) {
  return new Promise((resolve) => {
    const obj = { progress: 0 } // GSAP anima questo numero da 0 a 1

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
        displayLines.value[index] = originalText // alla fine mostra sempre la frase corretta
        resolve()
      }
    })
  })
}

// tempistiche fisse della sequenza per sincronizzare counter e barra
const ENTER_DURATION = 0.6
const SCRAMBLE_DURATION = 0.6
const PAUSE_DURATION = 0.3 // ridotto da 0.5 per velocizzare
const EXIT_DURATION = 0.5
const LINE_DURATION = ENTER_DURATION + SCRAMBLE_DURATION + PAUSE_DURATION + EXIT_DURATION

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) { // versione rapida per chi ha ridotto le animazioni nel sistema
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

  const totalDuration = lines.length * LINE_DURATION // durata di tutta la sequenza

  const progressObj = { value: 0 }
  gsap.to(progressObj, { // counter numerico sincronizzato con le frasi
    value: 100,
    duration: totalDuration,
    ease: 'none',
    onUpdate: () => {
      loadingPercent.value = Math.floor(progressObj.value)
    }
  })

  gsap.to(progressBarRef.value, { // barra inferiore che cresce da sinistra a destra
    scaleX: 1,
    duration: totalDuration,
    ease: 'none'
  })

  async function playSequence() { // sequenza principale dell'intro
    for (let i = 0; i < lines.length; i++) {
      const el = lineRefs.value[i]

      gsap.set(el, { opacity: 0 })
      await gsap.to(el, {
        opacity: 1,
        duration: ENTER_DURATION,
        ease: 'power2.out'
      }).then()

      await scrambleLine(i, lines[i], SCRAMBLE_DURATION) // decodifica la frase corrente
      await new Promise((r) => setTimeout(r, PAUSE_DURATION * 1000)) // pausa per leggerla

      await gsap.to(el, { // uscita della frase prima della successiva
        opacity: 0,
        duration: EXIT_DURATION,
        ease: 'power2.in'
      }).then()
    }

    loadingPercent.value = 100
    gsap.set(progressBarRef.value, { scaleX: 1 })

    await new Promise((r) => setTimeout(r, 150)) // breve pausa col 100% fisso

    await gsap.to(progressBarRef.value, { // la barra diventa un sipario
      height: '100vh',
      duration: 0.3,
      ease: 'power3.in'
    }).then()

    await gsap.to(introRef.value, { // sposta fuori l'intro e lascia vedere la pagina
      y: '-100%',
      duration: 0.45,
      ease: 'power3.inOut'
    }).then()

    emit('done')
  }

  playSequence()
})
</script>