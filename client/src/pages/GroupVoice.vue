<template>
  <div class="group-page">
    <div class="group-layout">
      <!-- Left Panel - Group Info & Members -->
      <div class="left-panel" :class="{ 'mobile-hidden': showChat }">
        <!-- Group Header -->
        <div class="group-header">
          <button class="back-btn" @click="router.push('/')">
            <i class="i-carbon-arrow-left"></i>
          </button>
          <div class="group-title">
            <h1>{{ group.name }}</h1>
            <span class="member-count">{{ group.members }} members</span>
          </div>
          <button class="info-btn" @click="showGroupInfo = !showGroupInfo">
            <i class="i-carbon-information"></i>
          </button>
        </div>

        <!-- Pyramid Seats -->
        <div class="pyramid-section card">
          <div class="section-header">
            <h2>Voice Seats</h2>
            <span class="seat-count">{{ occupiedSeats }}/9</span>
          </div>
          <PyramidSeats 
            :seats="seats"
            :currentUserId="user?.id"
            :isLeader="isLeader"
            :isCoLeader="isCoLeader"
            @selectSeat="handleSeatSelect"
            @toggleMute="handleToggleMute"
            @kickUser="handleKickUser"
            @promoteUser="handlePromoteUser"
          />
        </div>

        <!-- Join Button -->
        <div class="join-section">
          <button v-if="!isInSeat" class="btn btn-primary join-btn" @click="joinSeat">
            <i class="i-carbon-mic"></i>
            Join Voice
          </button>
          <button v-else class="btn btn-error leave-btn" @click="leaveSeat">
            <i class="i-carbon-mic-muted"></i>
            Leave
          </button>
        </div>

        <!-- Online Members -->
        <div class="members-section">
          <h3>Online Members</h3>
          <div class="members-list">
            <div v-for="member in onlineMembers" :key="member.id" class="member-item">
              <img :src="member.avatar" :alt="member.name" class="member-avatar" />
              <div class="member-info">
                <span class="member-name">{{ member.name }}</span>
                <span class="member-role" :class="member.role">{{ member.role }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Chat -->
      <div class="chat-panel" :class="{ 'mobile-visible': showChat }">
        <div class="chat-header">
          <button class="back-btn hide-desktop" @click="showChat = false">
            <i class="i-carbon-arrow-left"></i>
          </button>
          <h2>Group Chat</h2>
          <button class="members-btn hide-mobile" @click="showMembers = !showMembers">
            <i class="i-carbon-user-multiple"></i>
          </button>
        </div>

        <!-- Chat Messages -->
        <div class="chat-messages" ref="chatContainer">
          <div 
            v-for="message in chatMessages" 
            :key="message.id"
            class="chat-message"
            :class="{ 'own-message': message.senderId === user?.id }"
          >
            <img v-if="message.senderId !== user?.id" :src="message.sender.avatar" class="message-avatar" />
            <div class="message-content">
              <div class="message-header">
                <span class="sender-name">{{ message.sender.name }}</span>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <div class="message-bubble">
                <p>{{ message.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="chat-input">
          <button class="emoji-btn">
            <i class="i-carbon-face-happy"></i>
          </button>
          <input 
            type="text" 
            v-model="newMessage" 
            placeholder="Type a message..."
            @keyup.enter="sendMessage"
          />
          <button class="send-btn" @click="sendMessage" :disabled="!newMessage.trim()">
            <i class="i-carbon-send-filled"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Toggle -->
      <div class="mobile-tabs hide-desktop">
        <button 
          class="tab-btn" 
          :class="{ active: !showChat }"
          @click="showChat = false"
        >
          <i class="i-carbon-user-multiple"></i>
          Seats
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: showChat }"
          @click="showChat = true"
        >
          <i class="i-carbon-chat"></i>
          Chat
        </button>
      </div>
    </div>

    <!-- Group Info Dialog -->
    <Dialog v-if="showGroupInfo" title="Group Info" @close="showGroupInfo = false">
      <div class="group-info-content">
        <div class="group-banner" :style="{ background: group.color }"></div>
        <h2>{{ group.name }}</h2>
        <p>{{ group.description }}</p>
        
        <div class="info-grid">
          <div class="info-item">
            <i class="i-carbon-user-multiple"></i>
            <span>{{ group.members }} Members</span>
          </div>
          <div class="info-item">
            <i class="i-carbon-calendar"></i>
            <span>Created {{ group.created }}</span>
          </div>
        </div>

        <div v-if="isLeader" class="edit-section">
          <button class="btn btn-primary w-full" @click="editGroup">
            <i class="i-carbon-edit"></i>
            Edit Group
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '../composables/useResizeObserver'
import PyramidSeats from '../components/PyramidSeats.vue'
import Dialog from '../components/Dialog.vue'

const router = useRouter()
const { data: user } = useLocalStorage('user', null)

const showChat = ref(false)
const showGroupInfo = ref(false)
const showMembers = ref(false)
const newMessage = ref('')
const chatContainer = ref(null)

const group = ref({
  id: 1,
  name: 'Tech Talk',
  description: 'A community for tech enthusiasts to discuss latest trends and share knowledge.',
  members: 234,
  created: 'Jan 2024',
  color: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
})

// Seats: 1 leader + 2 co-leaders + 6 members = 9 total
const seats = ref([
  { id: 1, name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', role: 'leader', muted: false },
  { id: 2, name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', role: 'co-leader', muted: false },
  { id: 3, name: 'Mike Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', role: 'co-leader', muted: true },
  null, null, null, null, null, null
])

const onlineMembers = ref([
  { id: 1, name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', role: 'leader' },
  { id: 2, name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', role: 'co-leader' },
  { id: 3, name: 'Mike Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', role: 'co-leader' },
  { id: 4, name: 'Sarah Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', role: 'member' },
  { id: 5, name: 'Tom Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom', role: 'member' }
])

const chatMessages = ref([
  { id: 1, sender: { name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane' }, senderId: 2, content: 'Hey everyone! 👋', time: '10:30 AM' },
  { id: 2, sender: { name: 'Mike Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' }, senderId: 3, content: 'Whats up!', time: '10:32 AM' },
  { id: 3, sender: { name: 'Sarah Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' }, senderId: 4, content: 'Anyone watching the keynote?', time: '10:35 AM' },
  { id: 4, sender: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' }, senderId: 1, content: 'Yes! Its amazing 🔥', time: '10:36 AM' }
])

const isLeader = computed(() => {
  return user.value?.id === 1
})

const isCoLeader = computed(() => {
  return [2, 3].includes(user.value?.id)
})

const isInSeat = computed(() => {
  return seats.value.some(s => s?.id === user.value?.id)
})

const occupiedSeats = computed(() => {
  return seats.value.filter(s => s !== null).length
})

const handleSeatSelect = (seatIndex) => {
  console.log('Selected seat:', seatIndex)
}

const handleToggleMute = (seatIndex) => {
  if (seats.value[seatIndex]) {
    seats.value[seatIndex].muted = !seats.value[seatIndex].muted
  }
}

const handleKickUser = (seatIndex) => {
  if (isLeader.value && seatIndex > 0) {
    seats.value[seatIndex] = null
  }
}

const handlePromoteUser = (seatIndex) => {
  if (isLeader.value && seats.value[seatIndex]) {
    const currentRole = seats.value[seatIndex].role
    if (currentRole === 'member') {
      seats.value[seatIndex].role = 'co-leader'
    }
  }
}

const joinSeat = () => {
  const emptyIndex = seats.value.findIndex(s => s === null)
  if (emptyIndex !== -1) {
    seats.value[emptyIndex] = {
      id: user.value?.id || 999,
      name: user.value?.name || 'You',
      avatar: user.value?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      role: 'member',
      muted: false
    }
  }
}

const leaveSeat = () => {
  const userSeatIndex = seats.value.findIndex(s => s?.id === user.value?.id)
  if (userSeatIndex !== -1) {
    seats.value[userSeatIndex] = null
  }
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  chatMessages.value.push({
    id: Date.now(),
    sender: { 
      name: user.value?.name || 'You', 
      avatar: user.value?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user' 
    },
    senderId: user.value?.id || 999,
    content: newMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })

  newMessage.value = ''

  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const editGroup = () => {
  showGroupInfo.value = false
  alert('Edit group dialog would open here')
}
</script>

<style scoped>
.group-page {
  height: 100vh;
  overflow: hidden;
}

.group-layout {
  display: flex;
  height: 100%;
}

/* Left Panel */
.left-panel {
  width: 400px;
  background: rgba(30, 41, 59, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.back-btn,
.info-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.group-title {
  flex: 1;
}

.group-title h1 {
  font-size: 1.25rem;
  color: white;
}

.member-count {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Pyramid Section */
.pyramid-section {
  margin: 1rem;
  padding: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.section-header h2 {
  font-size: 1rem;
  color: white;
}

.seat-count {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

/* Join Section */
.join-section {
  padding: 0 1rem 1rem;
}

.join-btn,
.leave-btn {
  width: 100%;
  height: 48px;
  font-size: 1rem;
}

.leave-btn {
  background: var(--error);
}

/* Members Section */
.members-section {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.members-section h3 {
  font-size: 0.95rem;
  color: white;
  margin-bottom: 1rem;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: background 0.2s;
}

.member-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.member-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--primary);
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-size: 0.9rem;
  color: white;
}

.member-role {
  font-size: 0.75rem;
  text-transform: capitalize;
}

.member-role.leader { color: #ffd700; }
.member-role.co-leader { color: silver; }
.member-role.member { color: rgba(255, 255, 255, 0.5); }

/* Chat Panel */
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--dark);
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(30, 41, 59, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.chat-header h2 {
  flex: 1;
  font-size: 1.1rem;
  color: white;
}

.members-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-message {
  display: flex;
  gap: 0.75rem;
  max-width: 70%;
}

.chat-message.own-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.sender-name {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.message-time {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.1);
}

.own-message .message-bubble {
  background: var(--primary);
}

.message-bubble p {
  color: white;
  margin: 0;
  line-height: 1.4;
}

/* Chat Input */
.chat-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: rgba(30, 41, 59, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.chat-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  color: white;
}

.emoji-btn,
.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
}

.send-btn {
  background: var(--primary);
  color: white;
}

.send-btn:disabled {
  opacity: 0.5;
}

/* Mobile Tabs */
.mobile-tabs {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(30, 41, 59, 0.98);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.5rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab-btn.active {
  background: var(--primary);
  color: white;
}

/* Group Info Dialog */
.group-info-content {
  text-align: center;
}

.group-banner {
  width: 100%;
  height: 120px;
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
}

.group-info-content h2 {
  color: white;
  margin-bottom: 0.5rem;
}

.group-info-content p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
}

.info-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .left-panel,
  .chat-panel {
    width: 100%;
  }
  
  .left-panel.mobile-hidden {
    display: none;
  }
  
  .chat-panel.mobile-visible {
    display: flex;
  }
  
  .chat-panel {
    display: none;
  }
  
  .mobile-tabs {
    display: flex;
  }
  
  .mobile-tabs.hide-desktop {
    display: flex;
  }
  
  .back-btn {
    display: flex !important;
  }
  
  .left-panel {
    padding-bottom: 70px;
  }
  
  .chat-panel {
    padding-bottom: 70px;
  }
}

@media (min-width: 769px) {
  .hide-desktop {
    display: none !important;
  }
}
</style>
