<template>
  <div class="settings-page">
    <div class="settings-container">
      <header class="settings-header">
        <h1>Settings</h1>
      </header>

      <div class="settings-content">
        <!-- Profile Section -->
        <section class="settings-section">
          <h2>Profile</h2>
          <div class="profile-card card">
            <div class="profile-avatar">
              <img :src="user?.avatar" :alt="user?.name" />
              <button class="change-avatar-btn">
                <i class="i-carbon-camera"></i>
              </button>
            </div>
            <div class="profile-info">
              <h3>{{ user?.name }}</h3>
              <p>@{{ user?.username || 'user' }}</p>
            </div>
          </div>
          
          <div class="settings-form">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" v-model="profile.name" class="input-field" />
            </div>
            <div class="form-group">
              <label>Username</label>
              <input type="text" v-model="profile.username" class="input-field" />
            </div>
            <div class="form-group">
              <label>Bio</label>
              <textarea v-model="profile.bio" class="input-field" rows="3" placeholder="Tell us about yourself..."></textarea>
            </div>
            <div class="form-group">
              <label>Location</label>
              <input type="text" v-model="profile.location" class="input-field" placeholder="City, Country" />
            </div>
            <div class="form-group">
              <label>Website</label>
              <input type="url" v-model="profile.website" class="input-field" placeholder="https://" />
            </div>
            <button class="btn btn-primary" @click="saveProfile">Save Changes</button>
          </div>
        </section>

        <!-- Account Section -->
        <section class="settings-section">
          <h2>Account</h2>
          <div class="settings-list">
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-email"></i>
                <div>
                  <h4>Email</h4>
                  <p>{{ user?.email }}</p>
                </div>
              </div>
              <button class="btn btn-glass">Change</button>
            </div>
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-password"></i>
                <div>
                  <h4>Password</h4>
                  <p>Last changed 30 days ago</p>
                </div>
              </div>
              <button class="btn btn-glass">Change</button>
            </div>
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-phone"></i>
                <div>
                  <h4>Phone Number</h4>
                  <p>Not set</p>
                </div>
              </div>
              <button class="btn btn-glass">Add</button>
            </div>
          </div>
        </section>

        <!-- Privacy Section -->
        <section class="settings-section">
          <h2>Privacy</h2>
          <div class="settings-list">
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-user-multiple"></i>
                <div>
                  <h4>Profile Visibility</h4>
                  <p>Who can see your profile</p>
                </div>
              </div>
              <select v-model="privacy.profileVisibility" class="input-field select">
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-document-export"></i>
                <div>
                  <h4>Data Export</h4>
                  <p>Download your data</p>
                </div>
              </div>
              <button class="btn btn-glass">Export</button>
            </div>
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-password"></i>
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security</p>
                </div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="privacy.twoFactor" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- Notifications Section -->
        <section class="settings-section">
          <h2>Notifications</h2>
          <div class="settings-list">
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-notification"></i>
                <div>
                  <h4>Push Notifications</h4>
                  <p>Receive push notifications</p>
                </div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="notifications.push" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-email"></i>
                <div>
                  <h4>Email Notifications</h4>
                  <p>Receive email notifications</p>
                </div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="notifications.email" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-chat"></i>
                <div>
                  <h4>Message Notifications</h4>
                  <p>Notify for new messages</p>
                </div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="notifications.messages" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- Appearance Section -->
        <section class="settings-section">
          <h2>Appearance</h2>
          <div class="settings-list">
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-color-palette"></i>
                <div>
                  <h4>Theme</h4>
                  <p>Choose your theme</p>
                </div>
              </div>
              <select v-model="appearance.theme" class="input-field select">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-text-font"></i>
                <div>
                  <h4>Language</h4>
                  <p>Select your language</p>
                </div>
              </div>
              <select v-model="appearance.language" class="input-field select">
                <option value="my">Myanmar</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Danger Zone -->
        <section class="settings-section danger">
          <h2>Danger Zone</h2>
          <div class="settings-list">
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-logout"></i>
                <div>
                  <h4>Log Out</h4>
                  <p>Log out from all devices</p>
                </div>
              </div>
              <button class="btn btn-glass" @click="handleLogout">Log Out</button>
            </div>
            <div class="settings-item">
              <div class="item-info">
                <i class="i-carbon-trash-can"></i>
                <div>
                  <h4>Delete Account</h4>
                  <p>Permanently delete your account</p>
                </div>
              </div>
              <button class="btn btn-danger">Delete</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '../composables/useResizeObserver'

const router = useRouter()
const { data: user, removeValue } = useLocalStorage('user', null)

const profile = ref({
  name: user.value?.name || '',
  username: user.value?.username || '',
  bio: '',
  location: '',
  website: ''
})

const privacy = ref({
  profileVisibility: 'public',
  twoFactor: false
})

const notifications = ref({
  push: true,
  email: true,
  messages: true
})

const appearance = ref({
  theme: 'dark',
  language: 'my'
})

const saveProfile = () => {
  alert('Profile saved!')
}

const handleLogout = () => {
  removeValue()
  router.push('/login')
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  padding-bottom: 2rem;
}

.settings-container {
  max-width: 720px;
  margin: 0 auto;
}

.settings-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.settings-header h1 {
  font-size: 1.75rem;
  color: white;
}

.settings-content {
  padding: 1.5rem;
}

.settings-section {
  margin-bottom: 2rem;
}

.settings-section h2 {
  font-size: 1.1rem;
  color: white;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.settings-section.danger h2 {
  color: var(--error);
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  position: relative;
}

.profile-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--primary);
}

.change-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info h3 {
  color: white;
  margin-bottom: 0.25rem;
}

.profile-info p {
  color: rgba(255, 255, 255, 0.5);
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.select {
  width: auto;
  min-width: 150px;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
}

.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-info > i {
  font-size: 1.25rem;
  color: var(--primary);
}

.item-info h4 {
  color: white;
  font-size: 0.95rem;
  margin-bottom: 0.2rem;
}

.item-info p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* Toggle Switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  transition: 0.3s;
}

.toggle-slider::before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .toggle-slider {
  background: var(--primary);
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(22px);
}

.btn-danger {
  background: var(--error);
  color: white;
}

@media (max-width: 768px) {
  .settings-header {
    padding: 1.5rem 1rem;
  }
  
  .settings-content {
    padding: 1rem;
  }
  
  .profile-card {
    flex-direction: column;
    text-align: center;
  }
  
  .settings-item {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .settings-item .btn,
  .settings-item .select,
  .settings-item .toggle {
    align-self: flex-end;
  }
}
</style>
