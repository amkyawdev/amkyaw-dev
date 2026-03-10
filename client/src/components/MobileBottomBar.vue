<template>
  <nav class="mobile-bottom-bar">
    <router-link 
      v-for="item in navItems" 
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
    >
      <div class="nav-icon">
        <i :class="item.icon"></i>
        <span v-if="item.badge" class="badge">{{ item.badge }}</span>
      </div>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = computed(() => [
  { path: '/', label: 'Home', icon: 'i-carbon-home' },
  { path: '/posts', label: 'Posts', icon: 'i-carbon-document' },
  { path: '/chat', label: 'Chat', icon: 'i-carbon-chat', badge: 3 },
  { path: '/group/1', label: 'Groups', icon: 'i-carbon-user-multiple' },
  { path: '/settings', label: 'More', icon: 'i-carbon-settings' }
])

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.mobile-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 0.5rem;
  z-index: 50;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.2s;
  border-radius: var(--radius-md);
  min-width: 56px;
}

.nav-item:hover {
  color: rgba(255, 255, 255, 0.9);
}

.nav-item.active {
  color: var(--primary);
}

.nav-icon {
  position: relative;
}

.nav-icon i {
  font-size: 1.5rem;
}

.nav-item.active .nav-icon i {
  animation: bounce 0.3s ease;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.badge {
  position: absolute;
  top: -4px;
  right: -8px;
  background: var(--error);
  color: white;
  font-size: 0.6rem;
  padding: 0.1rem 0.35rem;
  border-radius: 999px;
  font-weight: 600;
}

.nav-label {
  font-size: 0.7rem;
  font-weight: 500;
}
</style>
