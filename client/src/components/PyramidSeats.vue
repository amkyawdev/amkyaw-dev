<template>
  <div class="pyramid-seats">
    <!-- Pyramid Level 1 (Top - Leader) -->
    <div class="pyramid-level level-1">
      <div 
        class="seat leader-seat" 
        :class="{ occupied: seats[0], selected: selectedSeat === 0 }"
        @click="selectSeat(0)"
      >
        <div class="seat-icon">
          <i class="i-carbon-crown"></i>
        </div>
        <div v-if="seats[0]" class="seat-user">
          <img :src="seats[0].avatar" :alt="seats[0].name" class="user-avatar" />
          <span class="user-name">{{ seats[0].name }}</span>
        </div>
        <div v-else class="empty-seat">
          <span>Leader</span>
        </div>
      </div>
    </div>

    <!-- Pyramid Level 2 (2 seats) -->
    <div class="pyramid-level level-2">
      <div 
        v-for="i in 2" 
        :key="i"
        class="seat co-leader-seat"
        :class="{ occupied: seats[i], selected: selectedSeat === i }"
        @click="selectSeat(i)"
      >
        <div class="seat-icon">
          <i class="i-carbon-star"></i>
        </div>
        <div v-if="seats[i]" class="seat-user">
          <img :src="seats[i].avatar" :alt="seats[i].name" class="user-avatar" />
          <span class="user-name">{{ seats[i].name }}</span>
        </div>
        <div v-else class="empty-seat">
          <span>Co-Leader</span>
        </div>
      </div>
    </div>

    <!-- Pyramid Level 3 (3 seats) -->
    <div class="pyramid-level level-3">
      <div 
        v-for="i in 3" 
        :key="i + 2"
        class="seat member-seat"
        :class="{ occupied: seats[i + 2], selected: selectedSeat === i + 2 }"
        @click="selectSeat(i + 2)"
      >
        <div v-if="seats[i + 2]" class="seat-user">
          <img :src="seats[i + 2].avatar" :alt="seats[i + 2].name" class="user-avatar" />
          <span class="user-name">{{ seats[i + 2].name }}</span>
        </div>
        <div v-else class="empty-seat">
          <span>Member</span>
        </div>
      </div>
    </div>

    <!-- Pyramid Level 4 (3 seats) -->
    <div class="pyramid-level level-4">
      <div 
        v-for="i in 3" 
        :key="i + 5"
        class="seat member-seat"
        :class="{ occupied: seats[i + 5], selected: selectedSeat === i + 5 }"
        @click="selectSeat(i + 5)"
      >
        <div v-if="seats[i + 5]" class="seat-user">
          <img :src="seats[i + 5].avatar" :alt="seats[i + 5].name" class="user-avatar" />
          <span class="user-name">{{ seats[i + 5].name }}</span>
        </div>
        <div v-else class="empty-seat">
          <span>Member</span>
        </div>
      </div>
    </div>

    <!-- Control Buttons -->
    <div v-if="selectedSeat !== null && canControl" class="seat-controls">
      <button 
        v-if="selectedSeat > 0 && (isLeader || isCoLeader)"
        class="control-btn mute-btn"
        :class="{ muted: isMuted }"
        @click="$emit('toggleMute', selectedSeat)"
      >
        <i :class="isMuted ? 'i-carbon-muted' : 'i-carbon-volume-up'"></i>
      </button>
      <button 
        v-if="isLeader"
        class="control-btn kick-btn"
        @click="$emit('kickUser', selectedSeat)"
      >
        <i class="i-carbon-close"></i>
      </button>
      <button 
        v-if="isLeader && selectedSeat > 0"
        class="control-btn promote-btn"
        @click="$emit('promoteUser', selectedSeat)"
      >
        <i class="i-carbon-arrow-up"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  seats: {
    type: Array,
    default: () => [null, null, null, null, null, null, null, null, null]
  },
  currentUserId: {
    type: String,
    default: ''
  },
  isLeader: {
    type: Boolean,
    default: false
  },
  isCoLeader: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['selectSeat', 'toggleMute', 'kickUser', 'promoteUser'])

const selectedSeat = ref(null)

const canControl = computed(() => {
  if (props.isLeader) return true
  if (props.isCoLeader) return selectedSeat.value > 2
  return false
})

const isMuted = computed(() => {
  if (selectedSeat.value === null) return false
  return props.seats[selectedSeat.value]?.muted || false
})

const selectSeat = (index) => {
  selectedSeat.value = selectedSeat.value === index ? null : index
  emit('selectSeat', selectedSeat.value)
}
</script>

<style scoped>
.pyramid-seats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.pyramid-level {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.level-1 { margin-bottom: 0.5rem; }
.level-2 { margin-bottom: 0.5rem; }
.level-3 { margin-bottom: 0.5rem; }

.seat {
  width: 90px;
  height: 90px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.seat:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.3);
  transform: scale(1.05);
}

.seat.occupied {
  background: rgba(99, 102, 241, 0.15);
  border-color: var(--primary);
}

.seat.selected {
  border-color: var(--accent);
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
}

.leader-seat {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
  border-color: rgba(255, 215, 0, 0.3);
}

.leader-seat:hover,
.leader-seat.selected {
  border-color: #ffd700;
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.4);
}

.co-leader-seat {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.1), rgba(169, 169, 169, 0.1));
  border-color: rgba(192, 192, 192, 0.3);
}

.seat-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.6;
}

.leader-seat .seat-icon {
  color: #ffd700;
  opacity: 1;
}

.co-leader-seat .seat-icon {
  color: silver;
  opacity: 1;
}

.seat-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--primary);
  object-fit: cover;
}

.leader-seat .user-avatar {
  width: 56px;
  height: 56px;
  border-color: #ffd700;
}

.co-leader-seat .user-avatar {
  width: 52px;
  height: 52px;
  border-color: silver;
}

.user-name {
  font-size: 0.7rem;
  font-weight: 500;
  color: white;
  text-align: center;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-seat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: rgba(255, 255, 255, 0.4);
}

.empty-seat span {
  font-size: 0.7rem;
  font-weight: 500;
}

.seat-controls {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  animation: fadeIn 0.3s ease;
}

.control-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.mute-btn {
  background: rgba(16, 185, 129, 0.2);
  color: var(--success);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.mute-btn.muted {
  background: rgba(239, 68, 68, 0.2);
  color: var(--error);
  border-color: rgba(239, 68, 68, 0.3);
}

.mute-btn:hover {
  transform: scale(1.1);
}

.kick-btn {
  background: rgba(239, 68, 68, 0.2);
  color: var(--error);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.kick-btn:hover {
  background: var(--error);
  color: white;
}

.promote-btn {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.promote-btn:hover {
  background: #ffd700;
  color: var(--dark);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 480px) {
  .seat {
    width: 70px;
    height: 70px;
  }
  
  .leader-seat {
    width: 90px;
    height: 90px;
  }
  
  .co-leader-seat {
    width: 80px;
    height: 80px;
  }
  
  .user-avatar {
    width: 36px;
    height: 36px;
  }
  
  .leader-seat .user-avatar {
    width: 42px;
    height: 42px;
  }
  
  .pyramid-level {
    gap: 0.75rem;
  }
}
</style>
