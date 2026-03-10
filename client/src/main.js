import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import 'virtual:uno.css'
import './styles/main.css'

// Routes
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('./pages/Dashboard.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./auth/Register.vue')
  },
  {
    path: '/reset',
    name: 'Reset',
    component: () => import('./auth/Reset.vue')
  },
  {
    path: '/posts',
    name: 'PublicPosts',
    component: () => import('./pages/PublicPosts.vue')
  },
  {
    path: '/chat',
    name: 'FriendsChat',
    component: () => import('./pages/FriendsChat.vue')
  },
  {
    path: '/chat/:userId',
    name: 'DirectChat',
    component: () => import('./pages/FriendsChat.vue')
  },
  {
    path: '/group/:groupId',
    name: 'GroupVoice',
    component: () => import('./pages/GroupVoice.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./pages/Settings.vue')
  },
  {
    path: '/user/:userId',
    name: 'UserProfile',
    component: () => import('./pages/UserProfile.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('./pages/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')

// Remove loading screen
setTimeout(() => {
  const loading = document.getElementById('loading')
  if (loading) {
    loading.style.opacity = '0'
    loading.style.transition = 'opacity 0.5s ease'
    setTimeout(() => loading.remove(), 500)
  }
}, 1500)
