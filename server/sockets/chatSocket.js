import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'amkyaw-dev-secret-key'

// Store active users
const activeUsers = new Map()

export function setupChatSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication required'))
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      socket.user = decoded
      next()
    } catch (err) {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`)

    // Add user to active users
    activeUsers.set(socket.user.id, {
      socketId: socket.id,
      user: socket.user
    })

    // Broadcast user online
    io.emit('user:online', { userId: socket.user.id })

    // Join user's personal room
    socket.join(`user:${socket.user.id}`)

    // Handle joining chat rooms
    socket.on('chat:join', ({ recipientId }) => {
      socket.join(`chat:${[socket.user.id, recipientId].sort().join('-')}`)
    })

    // Handle leaving chat rooms
    socket.on('chat:leave', ({ recipientId }) => {
      socket.leave(`chat:${[socket.user.id, recipientId].sort().join('-')}`)
    })

    // Handle direct messages
    socket.on('chat:message', (data) => {
      const { recipientId, content } = data
      
      // Send to recipient's personal room
      io.to(`user:${recipientId}`).emit('chat:message', {
        senderId: socket.user.id,
        content,
        timestamp: new Date().toISOString()
      })

      // Confirm to sender
      socket.emit('chat:sent', {
        recipientId,
        content,
        timestamp: new Date().toISOString()
      })
    })

    // Handle group join
    socket.on('group:join', ({ groupId }) => {
      socket.join(`group:${groupId}`)
      socket.to(`group:${groupId}`).emit('group:userJoined', {
        userId: socket.user.id,
        groupId
      })
    })

    // Handle group leave
    socket.on('group:leave', ({ groupId }) => {
      socket.leave(`group:${groupId}`)
      socket.to(`group:${groupId}`).emit('group:userLeft', {
        userId: socket.user.id,
        groupId
      })
    })

    // Handle group messages
    socket.on('group:message', (data) => {
      const { groupId, content } = data
      
      io.to(`group:${groupId}`).emit('group:message', {
        senderId: socket.user.id,
        content,
        timestamp: new Date().toISOString()
      })
    })

    // Handle voice seat events
    socket.on('voice:joinSeat', ({ groupId, seatNumber }) => {
      socket.join(`voice:${groupId}:${seatNumber}`)
      socket.to(`group:${groupId}`).emit('voice:seatJoined', {
        userId: socket.user.id,
        groupId,
        seatNumber
      })
    })

    socket.on('voice:leaveSeat', ({ groupId, seatNumber }) => {
      socket.leave(`voice:${groupId}:${seatNumber}`)
      socket.to(`group:${groupId}`).emit('voice:seatLeft', {
        userId: socket.user.id,
        groupId,
        seatNumber
      })
    })

    socket.on('voice:mute', ({ groupId, seatNumber, isMuted }) => {
      socket.to(`group:${groupId}`).emit('voice:seatMuted', {
        userId: socket.user.id,
        groupId,
        seatNumber,
        isMuted
      })
    })

    // Handle typing indicators
    socket.on('chat:typing', ({ recipientId }) => {
      io.to(`user:${recipientId}`).emit('chat:typing', {
        userId: socket.user.id,
        isTyping: true
      })
    })

    socket.on('chat:stopTyping', ({ recipientId }) => {
      io.to(`user:${recipientId}`).emit('chat:typing', {
        userId: socket.user.id,
        isTyping: false
      })
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`)
      
      // Remove from active users
      activeUsers.delete(socket.user.id)
      
      // Broadcast user offline
      io.emit('user:offline', { userId: socket.user.id })
    })
  })
}
