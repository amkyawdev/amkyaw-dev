import { ref, onMounted, onUnmounted } from 'vue'

export function useResizeObserver(callback) {
  const element = ref(null)
  
  const handleResize = () => {
    if (element.value) {
      callback({
        width: element.value.offsetWidth,
        height: element.value.offsetHeight
      })
    }
  }
  
  onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
  
  return { element }
}

export function useWebSocket(url) {
  const socket = ref(null)
  const isConnected = ref(false)
  const messages = ref([])
  
  const connect = () => {
    socket.value = new WebSocket(url)
    
    socket.value.onopen = () => {
      isConnected.value = true
      console.log('WebSocket connected')
    }
    
    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      messages.value.push(data)
    }
    
    socket.value.onclose = () => {
      isConnected.value = false
      console.log('WebSocket disconnected')
    }
  }
  
  const send = (data) => {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(data))
    }
  }
  
  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
    }
  }
  
  return { socket, isConnected, messages, connect, send, disconnect }
}

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  const data = ref(storedValue ? JSON.parse(storedValue) : defaultValue)
  
  const setValue = (value) => {
    data.value = value
    localStorage.setItem(key, JSON.stringify(value))
  }
  
  const removeValue = () => {
    data.value = null
    localStorage.removeItem(key)
  }
  
  return { data, setValue, removeValue }
}
