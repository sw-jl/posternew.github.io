import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import Poster from '../pages/Poster.vue'
import Landing from '../pages/Landing.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Dashboard },
    { path: '/poster', component: Poster },
    { path: '/landing', component: Landing },
  ],
})

// 取消登录拦截，所有页面均可直接访问

export default router