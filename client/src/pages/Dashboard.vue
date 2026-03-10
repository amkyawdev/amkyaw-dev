<template>
  <div class="dashboard">
    <!-- Mobile Header -->
    <header class="mobile-header hide-desktop">
      <button class="menu-btn" @click="showMobileMenu = true">
        <i class="i-carbon-menu"></i>
      </button>
      <div class="mobile-logo">
        <span class="gradient-text">Amkyaw.Dev</span>
      </div>
      <button class="search-btn">
        <i class="i-carbon-search"></i>
      </button>
    </header>

    <div class="dashboard-content">
      <!-- Welcome Section -->
      <section class="welcome-section">
        <div class="welcome-text">
          <h1>Welcome back, <span class="gradient-text">{{ user?.name || 'User' }}</span></h1>
          <p>Here's what's happening in your network</p>
        </div>
        <div class="welcome-stats">
          <div class="stat-card">
            <i class="i-carbon-user-multiple stat-icon"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.friends }}</span>
              <span class="stat-label">Friends</span>
            </div>
          </div>
          <div class="stat-card">
            <i class="i-carbon-document stat-icon"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.posts }}</span>
              <span class="stat-label">Posts</span>
            </div>
          </div>
          <div class="stat-card">
            <i class="i-carbon-chat stat-icon"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.messages }}</span>
              <span class="stat-label">Messages</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-grid">
          <router-link to="/posts" class="action-card">
            <div class="action-icon post-icon">
              <i class="i-carbon-edit"></i>
            </div>
            <span>New Post</span>
          </router-link>
          <router-link to="/chat" class="action-card">
            <div class="action-icon chat-icon">
              <i class="i-carbon-chat"></i>
            </div>
            <span>Messages</span>
          </router-link>
          <router-link to="/group/1" class="action-card">
            <div class="action-icon group-icon">
              <i class="i-carbon-user-multiple"></i>
            </div>
            <span>Join Group</span>
          </router-link>
          <button class="action-card" @click="openDialog('Create', 'Create new post or group')">
            <div class="action-icon create-icon">
              <i class="i-carbon-add"></i>
            </div>
            <span>Create</span>
          </button>
        </div>
      </section>

      <!-- Recent Posts -->
      <section class="recent-posts">
        <div class="section-header">
          <h2>Recent Posts</h2>
          <router-link to="/posts" class="see-all">See All</router-link>
        </div>
        <div class="posts-list">
          <div v-for="post in recentPosts" :key="post.id" class="post-card">
            <div class="post-header">
              <img :src="post.author.avatar" :alt="post.author.name" class="post-avatar" />
              <div class="post-info">
                <h4>{{ post.author.name }}</h4>
                <span>{{ post.time }}</span>
              </div>
              <button class="more-btn">
                <i class="i-carbon-overflow-menu-vertical"></i>
              </button>
            </div>
            <div class="post-content">
              <p>{{ post.content }}</p>
              <div v-if="post.image" class="post-image">
                <img :src="post.image" alt="Post image" />
              </div>
            </div>
            <div class="post-actions">
              <button class="action-btn" :class="{ active: post.liked }">
                <i :class="post.liked ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"></i>
                <span>{{ post.likes }}</span>
              </button>
              <button class="action-btn">
                <i class="i-carbon-chat"></i>
                <span>{{ post.comments }}</span>
              </button>
              <button class="action-btn">
                <i class="i-carbon-share"></i>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Active Groups -->
      <section class="active-groups">
        <div class="section-header">
          <h2>Active Groups</h2>
          <router-link to="/group/1" class="see-all">See All</router-link>
        </div>
        <div class="groups-scroll">
          <div v-for="group in groups" :key="group.id" class="group-card" @click="router.push(`/group/${group.id}`)">
            <div class="group-banner" :style="{ background: group.color }">
              <span class="member-count">{{ group.members }} Members</span>
            </div>
            <div class="group-info">
              <h4>{{ group.name }}</h4>
              <p>{{ group.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Mobile Menu -->
    <MobileMenu v-if="showMobileMenu" @close="showMobileMenu = false" />
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '../composables/useResizeObserver'
import MobileMenu from '../components/MobileMenu.vue'

const router = useRouter()
const openDialog = inject('openDialog')
const { data: user } = useLocalStorage('user', null)

const showMobileMenu = ref(false)

const stats = ref({
  friends: 128,
  posts: 45,
  messages: 12
})

const recentPosts = ref([
  {
    id: 1,
    author: {
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
    },
    content: 'Just launched my new project! Check it out 🚀',
    image: null,
    likes: 24,
    comments: 8,
    liked: false,
    time: '2 hours ago'
  },
  {
    id: 2,
    author: {
      name: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
    },
    content: 'Beautiful sunset today. Nature is amazing!',
    image: 'https://picsum.photos/seed/sunset/400/300',
    likes: 56,
    comments: 12,
    liked: true,
    time: '4 hours ago'
  }
])

const groups = ref([
  { id: 1, name: 'Tech Talk', description: 'Discuss latest tech', members: 234, color: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { id: 2, name: 'Gaming Hub', description: 'Gamers unite!', members: 567, color: 'linear-gradient(135deg, #ec4899, #f97316)' },
  { id: 3, name: 'Music Lovers', description: 'Share your favorite tunes', members: 189, color: 'linear-gradient(135deg, #10b981, #06b6d4)' }
])
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding-bottom: 2rem;
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 40;
}

.menu-btn,
.search-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-logo {
  font-size: 1.25rem;
  font-weight: 700;
}

.dashboard-content {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 2rem;
}

.welcome-text h1 {
  font-size: 1.75rem;
  color: white;
  margin-bottom: 0.5rem;
}

.welcome-text p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
}

.welcome-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon {
  font-size: 1.5rem;
  color: var(--primary);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 2rem;
}

.quick-actions h2 {
  font-size: 1.25rem;
  color: white;
  margin-bottom: 1rem;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.action-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
}

.action-card:hover {
  transform: translateY(-4px);
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.post-icon { background: rgba(99, 102, 241, 0.2); color: var(--primary); }
.chat-icon { background: rgba(236, 72, 153, 0.2); color: var(--accent); }
.group-icon { background: rgba(16, 185, 129, 0.2); color: var(--success); }
.create-icon { background: rgba(139, 92, 246, 0.2); color: var(--secondary); }

.action-card span {
  font-size: 0.85rem;
  font-weight: 500;
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.25rem;
  color: white;
}

.see-all {
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Recent Posts */
.recent-posts {
  margin-bottom: 2rem;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  animation: slideUp 0.4s ease;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.post-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--primary);
}

.post-info {
  flex: 1;
}

.post-info h4 {
  font-size: 0.95rem;
  color: white;
  margin-bottom: 0.2rem;
}

.post-info span {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.more-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s;
}

.more-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.post-content p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.post-image {
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 1rem;
}

.post-image img {
  width: 100%;
  height: auto;
}

.post-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.action-btn.active {
  color: var(--error);
}

.action-btn span {
  font-size: 0.85rem;
}

/* Groups */
.active-groups {
  margin-bottom: 2rem;
}

.groups-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
}

.groups-scroll::-webkit-scrollbar {
  display: none;
}

.group-card {
  min-width: 200px;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.group-card:hover {
  transform: translateY(-4px);
}

.group-banner {
  height: 80px;
  display: flex;
  align-items: flex-end;
  padding: 0.5rem;
}

.member-count {
  background: rgba(0, 0, 0, 0.5);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  color: white;
}

.group-info {
  padding: 1rem;
}

.group-info h4 {
  font-size: 0.95rem;
  color: white;
  margin-bottom: 0.25rem;
}

.group-info p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }
  
  .welcome-stats {
    grid-template-columns: 1fr;
  }
  
  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
