<template>
  <div class="profile-page">
    <!-- Cover & Profile -->
    <div class="profile-header">
      <div class="cover-photo" :style="{ background: coverGradient }"></div>
      <div class="profile-info">
        <div class="avatar-section">
          <img :src="profileUser.avatar" :alt="profileUser.name" class="profile-avatar" />
          <button v-if="isOwnProfile" class="edit-avatar-btn">
            <i class="i-carbon-camera"></i>
          </button>
        </div>
        <div class="profile-details">
          <div class="name-section">
            <h1>{{ profileUser.name }}</h1>
            <span v-if="profileUser.verified" class="verified-badge">
              <i class="i-carbon-checkmark-filled"></i>
            </span>
          </div>
          <p class="username">@{{ profileUser.username }}</p>
          <p class="bio">{{ profileUser.bio }}</p>
          
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-value">{{ profileUser.posts }}</span>
              <span class="stat-label">Posts</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ profileUser.followers }}</span>
              <span class="stat-label">Followers</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ profileUser.following }}</span>
              <span class="stat-label">Following</span>
            </div>
          </div>
          
          <div class="profile-actions">
            <template v-if="isOwnProfile">
              <button class="btn btn-glass">
                <i class="i-carbon-edit"></i>
                Edit Profile
              </button>
            </template>
            <template v-else>
              <button class="btn btn-primary" @click="handleFollow">
                <i :class="isFollowing ? 'i-carbon-checkmark' : 'i-carbon-add'"></i>
                {{ isFollowing ? 'Following' : 'Follow' }}
              </button>
              <button class="btn btn-glass" @click="startChat">
                <i class="i-carbon-chat"></i>
                Message
              </button>
              <button v-if="!isFriend" class="btn btn-glass" @click="addFriend">
                <i class="i-carbon-user-follow"></i>
                Add Friend
              </button>
              <button v-else class="btn btn-glass" @click="removeFriend">
                <i class="i-carbon-user-follow-minus"></i>
                Unfriend
              </button>
              <button class="btn btn-glass" @click="blockUser">
                <i class="i-carbon-blocked"></i>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Tabs -->
    <div class="profile-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <i :class="tab.icon"></i>
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="profile-content">
      <!-- Posts Tab -->
      <div v-if="activeTab === 'posts'" class="posts-grid">
        <div v-for="post in userPosts" :key="post.id" class="post-item">
          <img :src="post.image || 'https://picsum.photos/seed/' + post.id + '/300/300'" :alt="post.content" />
          <div class="post-overlay">
            <span><i class="i-carbon-favorite"></i> {{ post.likes }}</span>
            <span><i class="i-carbon-chat"></i> {{ post.comments }}</span>
          </div>
        </div>
      </div>

      <!-- Friends Tab -->
      <div v-if="activeTab === 'friends'" class="friends-grid">
        <div v-for="friend in userFriends" :key="friend.id" class="friend-card" @click="router.push(`/user/${friend.id}`)">
          <img :src="friend.avatar" :alt="friend.name" />
          <h4>{{ friend.name }}</h4>
          <p>{{ friend.mutual }} mutual friends</p>
        </div>
      </div>

      <!-- Media Tab -->
      <div v-if="activeTab === 'media'" class="media-grid">
        <div v-for="media in userMedia" :key="media.id" class="media-item">
          <img :src="media.url" :alt="media.caption" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLocalStorage } from '../composables/useResizeObserver'

const router = useRouter()
const route = useRoute()
const { data: currentUser } = useLocalStorage('user', null)

const activeTab = ref('posts')

const tabs = [
  { id: 'posts', label: 'Posts', icon: 'i-carbon-document' },
  { id: 'friends', label: 'Friends', icon: 'i-carbon-user-multiple' },
  { id: 'media', label: 'Media', icon: 'i-carbon-image' }
]

const coverGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
]

const coverGradient = computed(() => coverGradients[Math.floor(Math.random() * coverGradients.length)])

const profileUser = ref({
  id: route.params.userId || 1,
  name: 'John Doe',
  username: 'johndoe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  bio: 'Software Developer | Tech Enthusiast | Coffee Lover ☕',
  posts: 45,
  followers: 1234,
  following: 567,
  verified: true
})

const isOwnProfile = computed(() => currentUser.value?.id === profileUser.value.id)
const isFollowing = ref(false)
const isFriend = ref(false)

const userPosts = ref([
  { id: 1, content: 'New project', likes: 45, comments: 12, image: 'https://picsum.photos/seed/p1/400/400' },
  { id: 2, content: 'Sunset', likes: 89, comments: 23, image: 'https://picsum.photos/seed/p2/400/400' },
  { id: 3, content: 'Coding', likes: 32, comments: 7, image: 'https://picsum.photos/seed/p3/400/400' },
  { id: 4, content: 'Travel', likes: 67, comments: 15, image: 'https://picsum.photos/seed/p4/400/400' },
  { id: 5, content: 'Food', likes: 123, comments: 34, image: 'https://picsum.photos/seed/p5/400/400' },
  { id: 6, content: 'Music', likes: 56, comments: 11, image: 'https://picsum.photos/seed/p6/400/400' }
])

const userFriends = ref([
  { id: 2, name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', mutual: 12 },
  { id: 3, name: 'Mike Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', mutual: 8 },
  { id: 4, name: 'Sarah Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', mutual: 15 },
  { id: 5, name: 'Tom Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom', mutual: 5 }
])

const userMedia = ref([
  { id: 1, url: 'https://picsum.photos/seed/m1/400/400', caption: 'Great times!' },
  { id: 2, url: 'https://picsum.photos/seed/m2/400/400', caption: 'Beautiful day' },
  { id: 3, url: 'https://picsum.photos/seed/m3/400/400', caption: 'Working hard' },
  { id: 4, url: 'https://picsum.photos/seed/m4/400/400', caption: 'Adventure' }
])

const handleFollow = () => {
  isFollowing.value = !isFollowing.value
}

const startChat = () => {
  router.push(`/chat/${profileUser.value.id}`)
}

const addFriend = () => {
  isFriend.value = true
  alert('Friend request sent!')
}

const removeFriend = () => {
  isFriend.value = false
}

const blockUser = () => {
  alert('User blocked')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding-bottom: 2rem;
}

.profile-header {
  position: relative;
}

.cover-photo {
  height: 240px;
  background-size: cover;
  background-position: center;
}

.profile-info {
  padding: 0 2rem 2rem;
  position: relative;
}

.avatar-section {
  position: relative;
  display: inline-block;
  margin-top: -60px;
}

.profile-avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 5px solid var(--dark);
  background: var(--surface);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-details {
  margin-top: 1rem;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.name-section h1 {
  font-size: 1.75rem;
  color: white;
}

.verified-badge {
  color: #1d9bf0;
}

.username {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}

.bio {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  max-width: 500px;
}

.profile-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

.profile-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Tabs */
.profile-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-full);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.tab-btn.active {
  background: var(--primary);
  color: white;
}

/* Content */
.profile-content {
  padding: 2rem;
}

.posts-grid,
.friends-grid,
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.post-item,
.media-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.post-item img,
.media-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.post-item:hover img,
.media-item:hover img {
  transform: scale(1.1);
}

.post-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  display: flex;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.post-item:hover .post-overlay {
  opacity: 1;
}

.post-overlay span {
  color: white;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.friend-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.friend-card:hover {
  background: rgba(99, 102, 241, 0.15);
  transform: translateY(-4px);
}

.friend-card img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.friend-card h4 {
  color: white;
  margin-bottom: 0.25rem;
}

.friend-card p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .cover-photo {
    height: 160px;
  }
  
  .profile-info {
    padding: 0 1rem 1rem;
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
  }
  
  .avatar-section {
    margin-top: -50px;
  }
  
  .profile-stats {
    gap: 1rem;
  }
  
  .profile-tabs {
    padding: 1rem;
  }
  
  .profile-content {
    padding: 1rem;
  }
  
  .posts-grid,
  .friends-grid,
  .media-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
