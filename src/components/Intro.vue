<template>
  <div
    ref="introRef"
    class="fixed inset-0 z-999 bg-black text-white flex items-center justify-center px-8"
  >
    <h1
      v-for="(line, i) in lines"
      :key="i"
      ref="lineRefs"
      class="absolute text-center text-[8vw] leading-tight font-bold opacity-0"
    >
      {{ line }}
    </h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['done'])

const introRef = ref(null)
const lineRefs = ref([])

const lines = [
  'Hi',
  "I'm Sofia,",
  "I'm a Graphic Design Student",
  'Nice to meet you',
]

onMounted(() => {
  const tl = gsap.timeline({
    onComplete: () => emit('done'),
  })

  lineRefs.value.forEach((el, i) => {
    tl.to(el, { opacity: 1, duration: 0.5 })
    tl.to(el, { opacity: 0, duration: 0.5, delay: 0.9 })
  })

  tl.to(introRef.value, { opacity: 0, duration: 0.5 })
})
</script>