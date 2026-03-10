<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo -->
      <div class="auth-logo">
        <div class="logo-icon">
          <svg viewBox="0 0 100 100" class="logo-svg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#6366f1" />
                <stop offset="50%" style="stop-color:#8b5cf6" />
                <stop offset="100%" style="stop-color:#ec4899" />
              </linearGradient>
            </defs>
            <path d="M50 10 C20 10 10 35 10 50 C10 80 35 90 50 90 C65 90 90 80 90 50 C90 35 80 10 50 10" fill="url(#logoGradient)" />
            <text x="50" y="58" text-anchor="middle" fill="white" font-size="35" font-weight="bold">A</text>
          </svg>
        </div>
        <h1 class="logo-text gradient-text">Amkyaw.Dev</h1>
        <p class="tagline">Connect with friends, join groups, share moments</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="auth-form card">
        <h2 class="form-title">Welcome Back</h2>
        
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
        
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <i class="i-carbon-password input-icon"></i>
            <input 
              id="password"
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              class="input-field"
              placeholder="Enter your password"
              required
            />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'i-carbon-view' : 'i-carbon-view-off'"></i>
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="form.remember" />
            <span>Remember me</span>
          </label>
          <router-link to="/reset" class="forgot-link">Forgot password?</router-link>
        </div>

        <button type="submit" class="btn btn-primary w-full submit-btn" :disabled="loading">
          <span v-if="loading" class="loader-spinner"></span>
          <span v-else>Sign In</span>
        </button>

        <div class="divider">
          <span>or continue with</span>
        </div>

        <div class="social-buttons">
          <button type="button" class="social-btn google">
            <i class="i-carbon-logo-google"></i>
            Google
          </button>
          <button type="button" class="social-btn github">
            <i class="i-carbon-logo-github"></i>
            GitHub
          </button>
        </div>

        <p class="signup-link">
          Don't have an account? 
          <router-link to="/register">Sign up</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '../composables/useResizeObserver'

const router = useRouter()
const { setValue } = useLocalStorage('user', null)

const form = ref({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Store user data
    setValue({
      id: '1',
      name: 'Demo User',
      email: form.value.email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
    })
    
    // Redirect to dashboard
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
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
  margin-bottom: 1.5rem;
  color: white;
}

.form-group {
  margin-bottom: 1.25rem;
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

.toggle-password {
  position: absolute;
  right: 0.75rem;
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.2s;
}

.toggle-password:hover {
  color: white;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.remember-me input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
}

.forgot-link {
  color: var(--primary);
  font-size: 0.9rem;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: var(--accent);
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

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider span {
  padding: 0 1rem;
}

.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 500;
  transition: all 0.2s;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.social-btn i {
  font-size: 1.25rem;
}

.signup-link {
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.signup-link a {
  color: var(--primary);
  font-weight: 600;
}

.signup-link a:hover {
  color: var(--accent);
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
