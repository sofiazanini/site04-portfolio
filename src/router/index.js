import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../pages/HomeView.vue'
import WorkView from '../pages/WorkView.vue'
import WorkDetailView from '../pages/WorkDetailView.vue'
import AboutView from '../pages/AboutView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/work',
      name: 'work',
      component: WorkView,
    },
    {
      // :id è il parametro dinamico, lo leggo in WorkDetailView con route.params.id
      // così non serve una rotta per ogni progetto, una sola basta per tutti
      path: '/work/:id',
      name: 'work-detail',
      component: WorkDetailView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
  ],
})

export default router