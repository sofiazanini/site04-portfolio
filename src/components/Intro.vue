<template>
  <div
    ref="introRef"
    class="fixed inset-0 z-999 bg-black text-white flex items-center justify-center px-8"
  >
    <!-- sfondo ascii-grid del sito, bianco come nelle altre pagine -->
    <GridHover />

    <!--
      blocco unico centrato: counter + frasi stanno nello stesso contenitore,
      così il punto di comparsa è sempre identico e niente "salta" sullo schermo.
      gap aumentato per dare respiro al counter quando il testo sotto va a capo su mobile.
    -->
    <div class="relative z-10 flex flex-col items-center gap-10 md:gap-6 w-full">

      <!-- counter: solo numero che cambia, nessun effetto scale/fade ad ogni step -->
      <span class="font-mono text-4xl md:text-5xl font-bold tracking-tight text-white/90">
        {{ String(loadingPercent).padStart(3, '0') }}%
      </span>

      <!--
        area di testo: su mobile permetto il wrap su due righe con font grande e leggibile,
        invece di schiacciare tutto su una riga con clamp troppo stretto. Da md in su resta
        su una riga (whitespace-nowrap), schermo largo a sufficienza per le frasi più lunghe.
        h-auto su mobile perché l'altezza varia in base a quante righe servono.
      -->
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

    <!--
      barra di progresso decorativa in basso. Durante il reveal finale NON resta una riga sottile:
      cresce in altezza fino a riempire lo schermo di bianco, diventando il "sipario" che sale
      e spinge via il nero (vedi animazione in playSequence).
    -->
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

const emit = defineEmits(['done'])

const introRef = ref(null)
const lineRefs = ref([])
const progressBarRef = ref(null)

// testo finale di ogni riga, in inglese come richiesto
const lines = [
  'Hi',
  "I'm Sofia",
  'Graphic Design Student',
  'Nice to meet you!',
]

// testo che vedo a schermo, parte vuoto e viene riempito dallo scramble
const displayLines = ref(lines.map(() => ''))

// numero mostrato dal counter, va da 0 a 100 in sync con la sequenza delle frasi
const loadingPercent = ref(0)

// stessi caratteri usati in MainMenu/ProfileCard, per coerenza visiva su tutto il sito
const chars = '!<>-_\\/[]{}—=+*^?#________'

// decifra una riga carattere per carattere, dal random al testo vero
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

// durata di ogni singola riga (entrata + scramble + pausa + uscita), usata sia per la
// sequenza testo sia per calcolare la durata totale reale del counter, niente stime a mano
const ENTER_DURATION = 0.6
const SCRAMBLE_DURATION = 0.6
const PAUSE_DURATION = 0.5
const EXIT_DURATION = 0.5
const LINE_DURATION = ENTER_DURATION + SCRAMBLE_DURATION + PAUSE_DURATION + EXIT_DURATION

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // chi ha reduced-motion attivo si becca solo fade + counter che salta a 100, niente scramble/sipario
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

  // durata totale calcolata dalle costanti sopra, non più una stima fissa: se aggiungo
  // righe o cambio i tempi della sequenza, counter e barra restano sempre sincronizzati da soli
  const totalDuration = lines.length * LINE_DURATION

  const progressObj = { value: 0 }
  gsap.to(progressObj, {
    value: 100,
    duration: totalDuration,
    ease: 'none', // lineare: deve avanzare di pari passo con le righe, non accelerare/frenare
    onUpdate: () => {
      loadingPercent.value = Math.floor(progressObj.value)
    }
  })
  gsap.to(progressBarRef.value, {
    scaleX: 1,
    duration: totalDuration,
    ease: 'none'
  })

  // sequenza frasi: per ogni riga -> entra a fuoco (blur+scale), scramble, pausa, esce fuori fuoco
  async function playSequence() {
    for (let i = 0; i < lines.length; i++) {
      const el = lineRefs.value[i]

      gsap.set(el, { scale: 0.85, filter: 'blur(8px)' })
      await gsap.to(el, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: ENTER_DURATION,
        ease: 'power2.out'
      }).then()

      await scrambleLine(i, lines[i], SCRAMBLE_DURATION)

      await new Promise((r) => setTimeout(r, PAUSE_DURATION * 1000))

      await gsap.to(el, {
        opacity: 0,
        scale: 1.1,
        filter: 'blur(8px)',
        duration: EXIT_DURATION,
        ease: 'power2.in'
      }).then()
    }

    // counter dovrebbe già essere a 100 per via del timing sincronizzato, forzo per sicurezza
    loadingPercent.value = 100
    gsap.set(progressBarRef.value, { scaleX: 1 })

    // breve pausa col 100% visibile prima di partire col reveal (ridotta per transizione più rapida)
    await new Promise((r) => setTimeout(r, 150))

    // SIPARIO: la barra sottile si ispessisce fino a riempire tutto lo schermo di bianco,
    // poi l'intero blocco sale verso l'alto e sparisce, lasciando la home sotto.
    // Durate ridotte rispetto a prima (0.5+0.7s) per un distacco più netto e rapido.
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