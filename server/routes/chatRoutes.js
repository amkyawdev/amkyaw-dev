import express from 'express'
import pool from '../config/neon.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Get chat history between two users
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user.id
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const result = await pool.query(
      `SELECT m.*, 
              sender.username as sender_username, sender.name as sender_name, sender.avatar as sender_avatar,
              receiver.username as receiver_username, receiver.name as receiver_name, receiver.avatar as receiver_avatar
       FROM messages m
       JOIN users sender ON m.sender_id = sender.id
       JOIN users receiver ON m.receiver_id = receiver.id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at DESC
       LIMIT $3 OFFSET $4`,
      [currentUserId, userId, limit, offset]
    )

    // Mark messages as read
    await pool.query(
      'UPDATE messages SET read = true WHERE sender_id = $1 AND receiver_id = $2',
      [userId, currentUserId]
    )

    res.json(result.reverse())
  } catch (error) {
    console.error('Get chat error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get all conversations
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id

    const result = await pool.query(
      `SELECT DISTINCT ON (other_user.id)
              other_user.id as user_id,
              other_user.username,
              other_user.name,
              other_user.avatar,
              other_user.bio,
              (SELECT content FROM messages 
               WHERE (sender_id = $1 AND receiver_id = other_user.id) 
                   OR (sender_id = other_user.id AND receiver_id = $1)
               ORDER BY created_at DESC LIMIT 1) as last_message,
              (SELECT created_at FROM messages 
               WHERE (sender_id = $1 AND receiver_id = other_user.id) 
                   OR (sender_id = other_user.id AND receiver_id = $1)
               ORDER BY created_at DESC LIMIT 1) as last_message_time,
              (SELECT COUNT(*) FROM messages WHERE sender_id = other_user.id AND receiver_id = $1 AND read = false) as unread_count
       FROM users other_user
       JOIN messages m ON (m.sender_id = other_user.id OR m.receiver_id = other_user.id)
       WHERE (m.sender_id = $1 OR m.receiver_id = $1) AND other_user.id != $1
       ORDER BY other_user.id, last_message_time DESC`,
      [userId]
    )

    res.json(result)
  } catch (error) {
    console.error('Get conversations error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Send message
router.post('/', authenticate, async (req, res) => {
  try {
    const { receiverId, content } = req.body
    const senderId = req.user.id

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [senderId, receiverId, content]
    )

    // Get sender info
    const sender = await pool.query(
      'SELECT username, name, avatar FROM users WHERE id = $1',
      [senderId]
    )

    res.json({
      ...result[0],
      ...sender[0]
    })
  } catch (error) {
    console.error('Send message error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete message
router.delete('/:messageId', authenticate, async (req, res) => {
  try {
    const { messageId } = req.params

    const result = await pool.query(
      'DELETE FROM messages WHERE id = $1 AND sender_id = $2 RETURNING id',
      [messageId, req.user.id]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'Message not found' })
    }

    res.json({ message: 'Message deleted' })
  } catch (error) {
    console.error('Delete message error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
