<template>
  <div
    ref="cardRef"
    class="mt-[10vh] border border-white/20 bg-black text-white overflow-hidden w-[80vw] max-w-[85vw] md:max-w-[90vw] md:w-[90vw] cursor-pointer md:cursor-default"
    @click="toggleMobile"
  >
    <div class="flex flex-col md:flex-row items-stretch">
      <!-- Media -->
      <div
        ref="mediaRef"
        class="w-full md:w-[42%] aspect-4/5 md:aspect-auto overflow-hidden shrink-0"
      >
        <img
          :src="avatar"
          :alt="name"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Divider (desktop only, vertical) -->
      <div class="hidden md:block w-px bg-white/20"></div>

      <!-- Info -->
      <div class="w-full md:flex-1 flex flex-col gap-1 p-6 md:p-10 text-center md:text-left items-center md:items-start justify-center">
        <span class="text-[0.65rem] uppercase tracking-[0.18em] text-white/50">
          {{ eyebrow }}
        </span>
        <h2 class="text-2xl md:text-4xl font-bold uppercase tracking-tight leading-none">
          {{ name }}
        </h2>
        <p class="text-sm md:text-base text-white/50">
          {{ role }}
        </p>

        <!-- Mobile-only hint -->
        <span class="md:hidden mt-3 text-[0.6rem] uppercase tracking-[0.18em] text-white/30">
          {{ isOpen ? 'tocca per chiudere' : 'tocca per i dettagli' }}
        </span>

        <!-- Desktop: always visible -->
        <div class="hidden md:flex flex-col gap-6 mt-6 w-full">
          <p class="text-sm text-white/70 leading-relaxed max-w-420px">
            {{ bio }}
          </p>

          <ul class="flex flex-wrap gap-x-6 gap-y-2">
            <li v-for="link in links" :key="link.label">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs uppercase tracking-[0.12em] text-white/60 hover:text-white underline underline-offset-4 transition-colors"
                @mouseenter="scrambleText($event, link.label)"
                @click.stop
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Mobile: collapsible details -->
        <div ref="mobileDetailsRef" class="md:hidden w-full overflow-hidden h-0">
          <div class="flex flex-col gap-5 pt-5 mt-2 border-t border-white/10 w-full">
            <p class="text-sm text-white/70 leading-relaxed">
              {{ bio }}
            </p>

            <ul class="flex flex-wrap justify-center gap-x-5 gap-y-2">
              <li v-for="link in links" :key="link.label">
                <a
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs uppercase tracking-[0.12em] text-white/60 hover:text-white underline underline-offset-4 transition-colors"
                  @mouseenter="scrambleText($event, link.label)"
                  @click.stop
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  avatar: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Sofia Zanini'
  },
  role: {
    type: String,
    default: 'Graphic Design & Multimedia'
  },
  eyebrow: {
    type: String,
    default: 'Brescia, IT'
  },
  bio: {
    type: String,
    default: 'Ciao! Sono Sofia Zanini, studentessa all\'ultimo anno del corso di Graphic Design & Multimedia alla Libera Accademia di Belle Arti LABA a Brescia. '
  },
  links: {
    type: Array,
    default: () => [
      { label: 'Instagram', href: '#' },
      { label: 'Behance', href: '#' },
      { label: 'Dribbble', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Cosmos', href: '#' },
      { label: 'Pinterest', href: '#' },
      { label: 'sofizanini.graphic@gmail.com', href: 'mailto:sofizanini.graphic@gmail.com' }
    ]
  }
})

const cardRef = ref(null)
const mediaRef = ref(null)
const mobileDetailsRef = ref(null)
const isOpen = ref(false)

const chars = '!<>-_\\/[]{}—=+*^?#________'
const activeTweens = new Map()

const scrambleText = (e, originalText) => {
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

let prefersReducedMotion = false

onMounted(() => {
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!prefersReducedMotion) {
    gsap.from(cardRef.value, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.15
    })
  }
})

function toggleMobile() {
  // Solo su mobile: su desktop (>=768px) non fa nulla
  if (window.innerWidth >= 768) return

  isOpen.value = !isOpen.value

  if (prefersReducedMotion) {
    mediaRef.value.style.display = isOpen.value ? 'none' : ''
    mobileDetailsRef.value.style.height = isOpen.value ? 'auto' : '0px'
    return
  }

  if (isOpen.value) {
    // chiudi la foto, apri i dettagli
    gsap.to(mediaRef.value, {
      height: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        mediaRef.value.style.display = 'none'
      }
    })

    gsap.to(mobileDetailsRef.value, {
      height: 'auto',
      duration: 0.45,
      ease: 'power2.out',
      delay: 0.15
    })
  } else {
    // richiudi i dettagli, riapri la foto
    gsap.to(mobileDetailsRef.value, {
      height: 0,
      duration: 0.35,
      ease: 'power2.inOut'
    })

    mediaRef.value.style.display = ''
    gsap.fromTo(
      mediaRef.value,
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.45, ease: 'power2.out', delay: 0.1 }
    )
  }
}
</script>