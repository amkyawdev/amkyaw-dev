<template>
  <aside class="desktop-nav">
    <div class="nav-container">
      <!-- Logo -->
      <div class="nav-logo">
        <router-link to="/">
          <div class="logo-icon">
            <svg viewBox="0 0 100 100" class="logo-svg">
              <defs>
                <linearGradient id="navLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#6366f1" />
                  <stop offset="50%" style="stop-color:#8b5cf6" />
                  <stop offset="100%" style="stop-color:#ec4899" />
                </linearGradient>
              </defs>
              <path d="M50 10 C20 10 10 35 10 50 C10 80 35 90 50 90 C65 90 90 80 90 50 C90 35 80 10 50 10" fill="url(#navLogoGradient)" />
              <text x="50" y="58" text-anchor="middle" fill="white" font-size="35" font-weight="bold">A</text>
            </svg>
          </div>
          <span class="logo-text gradient-text">Amkyaw.Dev</span>
        </router-link>
      </div>

      <!-- User Profile -->
      <div class="user-profile" v-if="user" @click="router.push(`/user/${user.id}`)">
        <img :src="user.avatar" :alt="user.name" class="user-avatar" />
        <div class="user-info">
          <h4>{{ user.name }}</h4>
          <p>@{{ user.username || 'user' }}</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="nav-links">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="badge">{{ item.badge }}</span>
        </router-link>
      </nav>

      <!-- Create Button -->
      <button class="create-btn" @click="openDialog('Create', 'Create new post or group')">
        <i class="i-carbon-add"></i>
        <span>Create</span>
      </button>

      <!-- Footer -->
      <div class="nav-footer">
        <button class="settings-btn" @click="router.push('/settings')">
          <i class="i-carbon-settings"></i>
          <span>Settings</span>
        </button>
        <button class="logout-btn" @click="handleLogout">
          <i class="i-carbon-logout"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLocalStorage } from '../composables/useResizeObserver'

const router = useRouter()
const route = useRoute()
const openDialog = inject('openDialog')

const { data: user, removeValue } = useLocalStorage('user', null)

const navItems = computed(() => [
  { path: '/', label: 'Home', icon: 'i-carbon-home' },
  { path: '/posts', label: 'Posts', icon: 'i-carbon-document' },
  { path: '/chat', label: 'Chat', icon: 'i-carbon-chat', badge: 3 },
  { path: '/group/1', label: 'Groups', icon: 'i-carbon-user-multiple' },
  { path: '/about', label: 'About', icon: 'i-carbon-information' }
])

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const handleLogout = () => {
  removeValue()
  router.push('/login')
}
</script>

<style scoped>
.desktop-nav {
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  height: 100vh;
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 50;
}

.nav-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem 1rem;
}

.nav-logo {
  margin-bottom: 2rem;
}

.nav-logo a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-icon {
  width: 40px;
  height: 40px;
}

.logo-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--primary);
}

.user-info h4 {
  font-size: 0.95rem;
  color: white;
  margin-bottom: 0.1rem;
}

.user-info p {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.nav-links {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.2s;
  position: relative;
}

.nav-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: white;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  color: var(--primary);
}

.nav-item i {
  font-size: 1.25rem;
  width: 24px;
}

.nav-item span {
  font-weight: 500;
}

.badge {
  position: absolute;
  right: 1rem;
  background: var(--error);
  color: white;
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-weight: 600;
}

.create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem;
  margin: 1rem 0;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: var(--radius-md);
  color: white;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.create-btn i {
  font-size: 1.25rem;
}

.nav-footer {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.settings-btn,
.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
}

.settings-btn i,
.logout-btn i {
  font-size: 1.25rem;
  width: 24px;
}
</style>
