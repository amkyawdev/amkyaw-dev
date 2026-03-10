<template>
  <div class="mobile-menu-overlay" @click.self="$emit('close')">
    <div class="mobile-menu">
      <div class="menu-header">
        <div class="user-info" v-if="user">
          <img :src="user.avatar" :alt="user.name" class="user-avatar" />
          <div class="user-details">
            <h3>{{ user.name }}</h3>
            <p>@{{ user.username || user.email }}</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <i class="i-carbon-close"></i>
        </button>
      </div>

      <nav class="menu-nav">
        <router-link to="/" class="nav-item" @click="$emit('close')">
          <i class="i-carbon-home"></i>
          <span>Home</span>
        </router-link>
        <router-link to="/posts" class="nav-item" @click="$emit('close')">
          <i class="i-carbon-document"></i>
          <span>Posts</span>
        </router-link>
        <router-link to="/chat" class="nav-item" @click="$emit('close')">
          <i class="i-carbon-chat"></i>
          <span>Chat</span>
          <span class="badge" v-if="unreadMessages">{{ unreadMessages }}</span>
        </router-link>
        <router-link to="/group/1" class="nav-item" @click="$emit('close')">
          <i class="i-carbon-user-multiple"></i>
          <span>Groups</span>
        </router-link>
        <router-link to="/settings" class="nav-item" @click="$emit('close')">
          <i class="i-carbon-settings"></i>
          <span>Settings</span>
        </router-link>
        <router-link to="/about" class="nav-item" @click="$emit('close')">
          <i class="i-carbon-information"></i>
          <span>About</span>
        </router-link>
      </nav>

      <div class="menu-footer">
        <button class="logout-btn" @click="handleLogout">
          <i class="i-carbon-logout"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '../composables/useResizeObserver'

const router = useRouter()
const { data: user, removeValue } = useLocalStorage('user', null)

const emit = defineEmits(['close'])

const unreadMessages = computed(() => 0)

const handleLogout = () => {
  removeValue()
  router.push('/login')
}
</script>

<style scoped>
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  justify-content: flex-start;
  animation: fadeIn 0.3s ease;
}

.mobile-menu {
  width: 280px;
  height: 100%;
  background: linear-gradient(180deg, var(--surface) 0%, var(--dark) 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  animation: slideInLeft 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.menu-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--primary);
}

.user-details h3 {
  font-size: 1rem;
  color: white;
  margin-bottom: 0.25rem;
}

.user-details p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--error);
}

.menu-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.nav-item:hover,
.nav-item.router-link-active {
  background: rgba(99, 102, 241, 0.15);
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
  right: 1.5rem;
  background: var(--error);
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-weight: 600;
}

.menu-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-md);
  color: var(--error);
  font-weight: 500;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: var(--error);
  color: white;
}
</style>
