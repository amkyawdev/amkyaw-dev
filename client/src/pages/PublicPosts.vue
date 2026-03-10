<template>
  <div class="posts-page">
    <!-- Header -->
    <header class="page-header">
      <h1>Public Posts</h1>
      <button class="btn btn-primary" @click="showCreatePost = true">
        <i class="i-carbon-add"></i>
        <span class="hide-mobile">New Post</span>
      </button>
    </header>

    <!-- Create Post -->
    <div v-if="showCreatePost" class="create-post card">
      <div class="create-header">
        <img :src="user?.avatar" :alt="user?.name" class="user-avatar" />
        <div class="user-info">
          <h4>{{ user?.name }}</h4>
        </div>
        <button class="close-btn" @click="showCreatePost = false">
          <i class="i-carbon-close"></i>
        </button>
      </div>
      <textarea 
        v-model="newPost.content" 
        placeholder="What's on your mind?"
        class="post-textarea"
        rows="4"
      ></textarea>
      <div class="create-actions">
        <button class="action-btn">
          <i class="i-carbon-image"></i>
          Image
        </button>
        <button class="action-btn">
          <i class="i-carbon-video"></i>
          Video
        </button>
        <button class="btn btn-primary" @click="createPost">Post</button>
      </div>
    </div>

    <!-- Posts List -->
    <div class="posts-feed">
      <div v-for="post in posts" :key="post.id" class="post-card card">
        <div class="post-header">
          <img :src="post.author.avatar" :alt="post.author.name" class="post-avatar" />
          <div class="post-info">
            <h4>{{ post.author.name }}</h4>
            <div class="post-meta">
              <span>{{ post.author.username }}</span>
              <span>·</span>
              <span>{{ post.time }}</span>
            </div>
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
        
        <div class="post-stats">
          <span><i class="i-carbon-favorite-filled"></i> {{ post.likes }}</span>
          <span><i class="i-carbon-chat"></i> {{ post.comments }}</span>
          <span><i class="i-carbon-share"></i> {{ post.shares }}</span>
        </div>
        
        <div class="post-actions">
          <button class="action-btn" :class="{ active: post.liked }" @click="toggleLike(post)">
            <i :class="post.liked ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"></i>
            <span>Like</span>
          </button>
          <button class="action-btn">
            <i class="i-carbon-chat"></i>
            <span>Comment</span>
          </button>
          <button class="action-btn">
            <i class="i-carbon-share"></i>
            <span>Share</span>
          </button>
        </div>
        
        <!-- Comments -->
        <div v-if="post.commentsList?.length" class="comments-section">
          <div v-for="comment in post.commentsList" :key="comment.id" class="comment">
            <img :src="comment.author.avatar" :alt="comment.author.name" class="comment-avatar" />
            <div class="comment-content">
              <div class="comment-bubble">
                <h5>{{ comment.author.name }}</h5>
                <p>{{ comment.content }}</p>
              </div>
              <div class="comment-actions">
                <button>Like</button>
                <button>Reply</button>
                <span>{{ comment.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLocalStorage } from '../composables/useResizeObserver'

const { data: user } = useLocalStorage('user', null)

const showCreatePost = ref(false)
const newPost = ref({ content: '', image: null })

const posts = ref([
  {
    id: 1,
    author: {
      name: 'John Doe',
      username: 'johndoe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
    },
    content: 'Just launched my new project! Check it out 🚀 Excited to share this with everyone.',
    image: 'https://picsum.photos/seed/project1/600/400',
    likes: 45,
    comments: 12,
    shares: 5,
    liked: false,
    time: '2 hours ago',
    commentsList: [
      { id: 1, author: { name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane' }, content: 'Congrats! Looks amazing!', time: '1h ago' }
    ]
  },
  {
    id: 2,
    author: {
      name: 'Jane Smith',
      username: 'janesmith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
    },
    content: 'Beautiful sunset today. Nature is amazing! 🌅',
    image: 'https://picsum.photos/seed/sunset2/600/400',
    likes: 89,
    comments: 23,
    shares: 8,
    liked: true,
    time: '4 hours ago',
    commentsList: []
  },
  {
    id: 3,
    author: {
      name: 'Mike Wilson',
      username: 'mikew',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
    },
    content: 'Working on some exciting new features. Stay tuned!',
    image: null,
    likes: 32,
    comments: 7,
    shares: 2,
    liked: false,
    time: '6 hours ago',
    commentsList: []
  }
])

const createPost = () => {
  if (!newPost.value.content.trim()) return
  
  posts.value.unshift({
    id: Date.now(),
    author: {
      name: user.value?.name || 'You',
      username: user.value?.username || 'user',
      avatar: user.value?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
    },
    content: newPost.value.content,
    image: newPost.value.image,
    likes: 0,
    comments: 0,
    shares: 0,
    liked: false,
    time: 'Just now',
    commentsList: []
  })
  
  newPost.value = { content: '', image: null }
  showCreatePost.value = false
}

const toggleLike = (post) => {
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
}
</script>

<style scoped>
.posts-page {
  min-height: 100vh;
  padding-bottom: 2rem;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 30;
}

.page-header h1 {
  font-size: 1.5rem;
  color: white;
}

.create-post {
  margin: 1.5rem;
  padding: 1.25rem;
}

.create-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--primary);
}

.user-info h4 {
  color: white;
}

.close-btn {
  margin-left: auto;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.post-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 1rem;
  color: white;
  font-family: inherit;
  font-size: 1rem;
  resize: none;
  margin-bottom: 1rem;
}

.post-textarea:focus {
  border-color: var(--primary);
  outline: none;
}

.create-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.posts-feed {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 1rem;
}

.post-card {
  padding: 0;
  margin-bottom: 1rem;
  overflow: hidden;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
}

.post-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--primary);
}

.post-info {
  flex: 1;
}

.post-info h4 {
  color: white;
  margin-bottom: 0.25rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.more-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.5);
}

.post-content {
  padding: 0 1.25rem 1.25rem;
}

.post-content p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.post-image {
  border-radius: var(--radius-md);
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: auto;
  display: block;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.post-stats span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.post-stats i {
  color: var(--error);
}

.post-actions {
  display: flex;
  padding: 0.5rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.post-actions .action-btn {
  flex: 1;
  justify-content: center;
}

.post-actions .action-btn.active {
  color: var(--error);
}

.comments-section {
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.comment {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.comment:last-child {
  margin-bottom: 0;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
}

.comment-bubble {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: 0.75rem;
}

.comment-bubble h5 {
  font-size: 0.85rem;
  color: white;
  margin-bottom: 0.25rem;
}

.comment-bubble p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-left: 0.75rem;
}

.comment-actions button {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.comment-actions span {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }
  
  .page-header h1 {
    font-size: 1.25rem;
  }
}
</style>
