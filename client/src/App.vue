<template>
  <div class="app-container">
    <!-- Three.js Background -->
    <canvas ref="bgCanvas" class="bg-canvas"></canvas>
    
    <!-- Mobile Menu -->
    <MobileMenu v-if="showMobileMenu" @close="showMobileMenu = false" />
    
    <!-- Main Content -->
    <div class="main-layout">
      <!-- Desktop Navigation -->
      <DesktopNav v-if="!isAuthPage" />
      
      <!-- Page Content -->
      <main 
        class="page-content" 
        :class="{ 'with-nav': !isAuthPage, 'full-width': isAuthPage }"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Mobile Bottom Bar -->
    <MobileBottomBar v-if="showMobileBar" />
    
    <!-- Dialog -->
    <Dialog 
      v-if="dialog.show" 
      :title="dialog.title" 
      :content="dialog.content"
      @close="dialog.show = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import MobileMenu from './components/MobileMenu.vue'
import DesktopNav from './components/DesktopNav.vue'
import MobileBottomBar from './components/MobileBottomBar.vue'
import Dialog from './components/Dialog.vue'
import { initHearts, initLeaves, animateBackground } from './three/hearts'
import { useResizeObserver } from './composables/useResizeObserver'

const route = useRoute()
const bgCanvas = ref(null)
const showMobileMenu = ref(false)
const windowWidth = ref(window.innerWidth)

const isAuthPage = computed(() => {
  return ['Login', 'Register', 'Reset'].includes(route.name)
})

const showMobileBar = computed(() => {
  return windowWidth.value < 768 && !isAuthPage.value
})

// Dialog system
const dialog = ref({
  show: false,
  title: '',
  content: ''
})

const openDialog = (title, content) => {
  dialog.value = { show: true, title, content }
}

provide('openDialog', openDialog)

// Handle resize
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  // Initialize Three.js background
  if (bgCanvas.value) {
    animateBackground(bgCanvas.value)
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
.app-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.bg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.main-layout {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  transition: margin-left 0.3s ease;
}

.page-content.with-nav {
  margin-left: 240px;
}

.page-content.full-width {
  margin-left: 0;
}

@media (max-width: 768px) {
  .page-content.with-nav {
    margin-left: 0;
    padding-bottom: 70px;
  }
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
