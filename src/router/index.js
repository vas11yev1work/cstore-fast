import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home-tracking" */ '../views/Home.vue')
  },
  {
    path: '/:id',
    name: 'Tracking',
    component: () => import(/* webpackChunkName: "tracking" */ '../views/Tracking.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
