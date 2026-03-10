<template>
  <div class="device-frame">
    <div class="device-header">
      <div class="device-notch"></div>
      <div class="device-title">{{ title }}</div>
    </div>
    <div class="device-content">
      <slot></slot>
    </div>
    <div class="device-home-indicator"></div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Chat'
  }
})
</script>

<style scoped>
.device-frame {
  width: 100%;
  max-width: 400px;
  height: 100%;
  max-height: 700px;
  background: var(--darker);
  border-radius: 32px;
  border: 4px solid #333;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 
    0 0 0 2px #1a1a1a,
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 0 20px rgba(255, 255, 255, 0.05);
}

.device-header {
  padding-top: 12px;
  padding-bottom: 8px;
  background: rgba(30, 41, 59, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
}

.device-notch {
  width: 100px;
  height: 24px;
  background: #1a1a1a;
  border-radius: 0 0 16px 16px;
  margin: 0 auto;
  position: relative;
}

.device-notch::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #2a2a2a;
  border-radius: 50%;
}

.device-title {
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  margin-top: 8px;
}

.device-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.device-home-indicator {
  height: 4px;
  width: 120px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin: 0 auto 8px;
}
</style>
