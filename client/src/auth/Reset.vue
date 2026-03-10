<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo -->
      <div class="auth-logo">
        <div class="logo-icon">
          <svg viewBox="0 0 100 100" class="logo-svg">
            <defs>
              <linearGradient id="logoGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#6366f1" />
                <stop offset="50%" style="stop-color:#8b5cf6" />
                <stop offset="100%" style="stop-color:#ec4899" />
              </linearGradient>
            </defs>
            <path d="M50 10 C20 10 10 35 10 50 C10 80 35 90 50 90 C65 90 90 80 90 50 C90 35 80 10 50 10" fill="url(#logoGradient3)" />
            <text x="50" y="58" text-anchor="middle" fill="white" font-size="35" font-weight="bold">A</text>
          </svg>
        </div>
        <h1 class="logo-text gradient-text">Amkyaw.Dev</h1>
        <p class="tagline">Reset your password</p>
      </div>

      <!-- Reset Form -->
      <form @submit.prevent="handleReset" class="auth-form card">
        <div v-if="!emailSent">
          <h2 class="form-title">Forgot Password?</h2>
          <p class="form-description">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-wrapper">
              <i class="i-carbon-email input-icon"></i>
              <input 
                id="email"
                v-model="form.email" 
                type="email" 
                class="input-field"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-full submit-btn" :disabled="loading">
            <span v-if="loading" class="loader-spinner"></span>
            <span v-else>Send Reset Link</span>
          </button>
        </div>

        <div v-else class="success-message">
          <div class="success-icon">
            <i class="i-carbon-email-check"></i>
          </div>
          <h2 class="form-title">Check Your Email</h2>
          <p class="form-description">
            We've sent a password reset link to <strong>{{ form.email }}</strong>
          </p>
          <button type="button" @click="emailSent = false" class="btn btn-secondary w-full">
            Send Again
          </button>
        </div>

        <p class="back-link">
          <router-link to="/login">
            <i class="i-carbon-arrow-left"></i>
            Back to Sign In
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  email: ''
})

const showPassword = ref(false)
const loading = ref(false)
const emailSent = ref(false)

const handleReset = async () => {
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    emailSent.value = true
  } catch (error) {
    console.error('Reset failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.auth-container {
  width: 100%;
  max-width: 440px;
  animation: slideUp 0.6s ease;
}

.auth-logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  animation: float 3s ease-in-out infinite;
}

.logo-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.5));
}

.logo-text {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.tagline {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}

.auth-form {
  padding: 2rem;
}

.form-title {
  font-size: 1.75rem;
  text-align: center;
  margin-bottom: 1rem;
  color: white;
}

.form-description {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.25rem;
  pointer-events: none;
}

.input-wrapper .input-field {
  padding-left: 2.75rem;
  padding-right: 2.75rem;
}

.submit-btn {
  height: 48px;
  font-size: 1rem;
}

.loader-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message {
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--success), #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  animation: scaleIn 0.5s ease;
}

.success-icon i {
  animation: scaleIn 0.3s ease;
}

.back-link {
  text-align: center;
  margin-top: 1.5rem;
}

.back-link a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s;
}

.back-link a:hover {
  color: var(--primary);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 1rem;
  }
  
  .auth-form {
    padding: 1.5rem;
  }
  
  .logo-text {
    font-size: 2rem;
  }
}
</style>
