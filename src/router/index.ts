import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home-tracking" */ '@/views/Home.vue')
  },
  {
    path: '/:id',
    name: 'Tracking',
    component: () => import(/* webpackChunkName: "tracking" */ '@/views/Tracking.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
