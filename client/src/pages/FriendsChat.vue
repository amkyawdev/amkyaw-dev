<template>
  <div class="chat-page">
    <!-- Chat List -->
    <div class="chat-list" :class="{ 'mobile-hidden': selectedUser }">
      <div class="chat-header">
        <h1>Messages</h1>
        <button class="new-chat-btn">
          <i class="i-carbon-edit"></i>
        </button>
      </div>
      
      <div class="search-box">
        <i class="i-carbon-search"></i>
        <input type="text" placeholder="Search messages..." v-model="searchQuery" />
      </div>
      
      <div class="friends-list">
        <div 
          v-for="friend in filteredFriends" 
          :key="friend.id"
          class="friend-item"
          :class="{ active: selectedUser?.id === friend.id }"
          @click="selectFriend(friend)"
        >
          <div class="friend-avatar">
            <img :src="friend.avatar" :alt="friend.name" />
            <span v-if="friend.online" class="online-indicator"></span>
          </div>
          <div class="friend-info">
            <h4>{{ friend.name }}</h4>
            <p>{{ friend.lastMessage }}</p>
          </div>
          <div class="friend-meta">
            <span class="time">{{ friend.time }}</span>
            <span v-if="friend.unread" class="unread-badge">{{ friend.unread }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="chat-area" :class="{ 'mobile-visible': selectedUser }">
      <template v-if="selectedUser">
        <div class="chat-header-bar">
          <button class="back-btn hide-desktop" @click="selectedUser = null">
            <i class="i-carbon-arrow-left"></i>
          </button>
          <div class="chat-user-info">
            <img :src="selectedUser.avatar" :alt="selectedUser.name" class="chat-avatar" />
            <div>
              <h3>{{ selectedUser.name }}</h3>
              <span v-if="selectedUser.online" class="status online">Online</span>
              <span v-else class="status">Last seen {{ selectedUser.lastSeen }}</span>
            </div>
          </div>
          <div class="chat-actions">
            <button class="action-btn" @click="router.push(`/user/${selectedUser.id}`)">
              <i class="i-carbon-user-avatar"></i>
            </button>
            <button class="action-btn">
              <i class="i-carbon-phone"></i>
            </button>
            <button class="action-btn" @click="showInfo = !showInfo">
              <i class="i-carbon-information"></i>
            </button>
          </div>
        </div>
        
        <!-- Messages -->
        <div class="messages-container" ref="messagesContainer">
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="message"
            :class="{ sent: message.senderId === user?.id, received: message.senderId !== user?.id }"
          >
            <img v-if="message.senderId !== user?.id" :src="selectedUser.avatar" class="message-avatar" />
            <div class="message-bubble">
              <p>{{ message.content }}</p>
              <span class="message-time">{{ message.time }}</span>
            </div>
          </div>
        </div>
        
        <!-- Message Input -->
        <div class="message-input">
          <button class="attach-btn">
            <i class="i-carbon-attachment"></i>
          </button>
          <input 
            type="text" 
            v-model="newMessage" 
            placeholder="Type a message..."
            @keyup.enter="sendMessage"
          />
          <button class="emoji-btn">
            <i class="i-carbon-face-happy"></i>
          </button>
          <button class="send-btn" @click="sendMessage" :disabled="!newMessage.trim()">
            <i class="i-carbon-send"></i>
          </button>
        </div>
      </template>
      
      <div v-else class="no-chat-selected">
        <i class="i-carbon-chat"></i>
        <h2>Select a conversation</h2>
        <p>Choose a friend to start chatting</p>
      </div>
    </div>

    <!-- User Info Sidebar -->
    <div v-if="showInfo && selectedUser" class="info-sidebar">
      <div class="info-header">
        <h3>User Info</h3>
        <button @click="showInfo = false">
          <i class="i-carbon-close"></i>
        </button>
      </div>
      <div class="info-content">
        <img :src="selectedUser.avatar" :alt="selectedUser.name" class="info-avatar" />
        <h2>{{ selectedUser.name }}</h2>
        <p class="username">@{{ selectedUser.username }}</p>
        
        <div class="info-stats">
          <div class="stat">
            <span class="value">{{ selectedUser.posts }}</span>
            <span class="label">Posts</span>
          </div>
          <div class="stat">
            <span class="value">{{ selectedUser.followers }}</span>
            <span class="label">Followers</span>
          </div>
          <div class="stat">
            <span class="value">{{ selectedUser.following }}</span>
            <span class="label">Following</span>
          </div>
        </div>
        
        <div class="info-actions">
          <button class="btn btn-primary w-full" @click="addFriend">
            <i class="i-carbon-user-follow"></i>
            Add Friend
          </button>
          <button class="btn btn-glass w-full" @click="router.push(`/user/${selectedUser.id}`)">
            View Profile
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLocalStorage } from '../composables/useResizeObserver'

const router = useRouter()
const route = useRoute()
const { data: user } = useLocalStorage('user', null)

const searchQuery = ref('')
const selectedUser = ref(null)
const newMessage = ref('')
const showInfo = ref(false)
const messagesContainer = ref(null)

const friends = ref([
  { id: 1, name: 'Jane Smith', username: 'janesmith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', lastMessage: 'See you later!', time: '2m', online: true, unread: 3, lastSeen: 'now', posts: 45, followers: 1234, following: 567 },
  { id: 2, name: 'Mike Wilson', username: 'mikew', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', lastMessage: 'Thanks for help', time: '1h', online: true, unread: 0, lastSeen: 'now', posts: 89, followers: 2345, following: 432 },
  { id: 3, name: 'Sarah Davis', username: 'sarahd', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', lastMessage: 'Great work!', time: '3h', online: false, unread: 0, lastSeen: '2 hours ago', posts: 156, followers: 5678, following: 789 },
  { id: 4, name: 'Tom Brown', username: 'tomb', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom', lastMessage: 'Let me know', time: '1d', online: false, unread: 1, lastSeen: '1 day ago', posts: 234, followers: 890, following: 345 }
])

const messages = ref([
  { id: 1, senderId: 2, content: 'Hey! How are you?', time: '10:30 AM' },
  { id: 2, senderId: 1, content: "I'm good, thanks! Working on a new project", time: '10:32 AM' },
  { id: 3, senderId: 2, content: "That's awesome! Can't wait to see it", time: '10:33 AM' },
  { id: 4, senderId: 1, content: 'Will share soon!', time: '10:35 AM' },
  { id: 5, senderId: 2, content: 'Great, let me know!', time: '10:36 AM' }
])

const filteredFriends = computed(() => {
  if (!searchQuery.value) return friends.value
  return friends.value.filter(f => 
    f.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    f.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectFriend = (friend) => {
  selectedUser.value = friend
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedUser.value) return
  
  messages.value.push({
    id: Date.now(),
    senderId: user.value?.id || 1,
    content: newMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  
  newMessage.value = ''
  
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const addFriend = () => {
  alert('Friend request sent!')
}
</script>

<style scoped>
.chat-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Chat List */
.chat-list {
  width: 360px;
  background: rgba(30, 41, 59, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.chat-header h1 {
  font-size: 1.5rem;
  color: white;
}

.new-chat-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.new-chat-btn:hover {
  transform: scale(1.1);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
}

.search-box i {
  color: rgba(255, 255, 255, 0.5);
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 0.9rem;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.friends-list {
  flex: 1;
  overflow-y: auto;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.friend-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.friend-item.active {
  background: rgba(99, 102, 241, 0.15);
}

.friend-avatar {
  position: relative;
}

.friend-avatar img {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid var(--primary);
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  background: var(--success);
  border: 3px solid var(--surface);
  border-radius: 50%;
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.friend-info h4 {
  color: white;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.friend-info p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-meta {
  text-align: right;
}

.friend-meta .time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.unread-badge {
  display: block;
  margin-top: 0.25rem;
  background: var(--primary);
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
}

/* Chat Area */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--dark);
}

.chat-header-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(30, 41, 59, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  display: none;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.chat-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--primary);
}

.chat-user-info h3 {
  color: white;
  font-size: 1rem;
}

.status {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.status.online {
  color: var(--success);
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
}

.chat-actions .action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.chat-actions .action-btn:hover {
  background: var(--primary);
}

/* Messages */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 70%;
}

.message.sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.received {
  align-self: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  position: relative;
}

.message.sent .message-bubble {
  background: var(--primary);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received .message-bubble {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-bottom-left-radius: 4px;
}

.message-bubble p {
  margin: 0;
  line-height: 1.4;
}

.message-time {
  display: block;
  font-size: 0.7rem;
  margin-top: 0.25rem;
  opacity: 0.7;
}

/* Message Input */
.message-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: rgba(30, 41, 59, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.message-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  color: white;
  font-size: 0.95rem;
}

.message-input input:focus {
  border-color: var(--primary);
  outline: none;
}

.attach-btn,
.emoji-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s;
}

.attach-btn:hover,
.emoji-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.1);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* No Chat Selected */
.no-chat-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
}

.no-chat-selected i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-chat-selected h2 {
  color: white;
  margin-bottom: 0.5rem;
}

/* Info Sidebar */
.info-sidebar {
  width: 320px;
  background: rgba(30, 41, 59, 0.95);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.info-header h3 {
  color: white;
}

.info-header button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.5);
}

.info-content {
  padding: 2rem 1.5rem;
  text-align: center;
}

.info-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--primary);
  margin-bottom: 1rem;
}

.info-content h2 {
  color: white;
  margin-bottom: 0.25rem;
}

.info-content .username {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1.5rem;
}

.info-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.info-stats .stat {
  text-align: center;
}

.info-stats .value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.info-stats .label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.info-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .chat-list {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 10;
  }
  
  .chat-list.mobile-hidden {
    display: none;
  }
  
  .chat-area.mobile-visible {
    display: flex;
  }
  
  .chat-area {
    display: none;
  }
  
  .info-sidebar {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    z-index: 20;
    width: 100%;
    max-width: 320px;
  }
  
  .back-btn {
    display: flex;
  }
}
</style>
