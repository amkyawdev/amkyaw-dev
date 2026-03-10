<template>
  <Teleport to="body">
    <div class="dialog-overlay" @click.self="$emit('close')">
      <div class="dialog-container" :class="size">
        <div class="dialog-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" @click="$emit('close')">
            <i class="i-carbon-close"></i>
          </button>
        </div>
        <div class="dialog-body">
          <slot>
            {{ content }}
          </slot>
        </div>
        <div v-if="$slots.footer || showFooter" class="dialog-footer">
          <slot name="footer">
            <button class="btn btn-glass" @click="$emit('close')">Cancel</button>
            <button class="btn btn-primary" @click="$emit('confirm')">Confirm</button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Dialog'
  },
  content: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (val) => ['small', 'medium', 'large'].includes(val)
  },
  showFooter: {
    type: Boolean,
    default: true
  }
})

defineEmits(['close', 'confirm'])
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fadeIn 0.2s ease;
}

.dialog-container {
  background: linear-gradient(180deg, var(--surface) 0%, var(--dark) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: scaleIn 0.3s ease;
}

.dialog-container.small {
  width: 90%;
  max-width: 360px;
}

.dialog-container.medium {
  width: 90%;
  max-width: 500px;
}

.dialog-container.large {
  width: 90%;
  max-width: 700px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.dialog-header h3 {
  font-size: 1.25rem;
  color: white;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--error);
  color: white;
}

.dialog-body {
  padding: 1.5rem;
  overflow-y: auto;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
