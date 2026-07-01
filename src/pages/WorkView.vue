<template>
  <main class="w-full bg-black min-h-screen flex flex-col">
    <GridHover />

    <div class="flex-1 overflow-y-auto pt-40 pb-8 px-6 md:px-16">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <WorkCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import WorkCard from '../components/WorkCard.vue'
import GridHover from '../components/GridHover.vue'

const projects = ref([])

async function fetchProjects() {
  try {
    const res = await fetch('/data/projects.json')
    projects.value = await res.json()
  } catch (err) {
    console.error('Errore fetch progetti:', err)
  }
}

onMounted(fetchProjects)
</script>