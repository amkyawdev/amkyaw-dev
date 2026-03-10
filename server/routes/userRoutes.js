import express from 'express'
import pool from '../config/neon.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const result = await pool.query(
      `SELECT id, username, email, name, avatar, bio, location, website, verified, created_at 
       FROM users WHERE id = $1`,
      [id]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Get followers and following counts
    const [followersCount, followingCount, postsCount] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM friends WHERE friend_id = $1 AND status = $2', [id, 'accepted']),
      pool.query('SELECT COUNT(*) as count FROM friends WHERE user_id = $1 AND status = $2', [id, 'accepted']),
      pool.query('SELECT COUNT(*) as count FROM posts WHERE user_id = $1', [id])
    ])

    res.json({
      ...result[0],
      followers: parseInt(followersCount[0]?.count || 0),
      following: parseInt(followingCount[0]?.count || 0),
      posts: parseInt(postsCount[0]?.count || 0)
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update user profile
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { name, bio, location, website } = req.body

    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const result = await pool.query(
      `UPDATE users SET name = $1, bio = $2, location = $3, website = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING id, username, email, name, avatar, bio, location, website`,
      [name, bio, location, website, id]
    )

    res.json(result[0])
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get user posts
router.get('/:id/posts', async (req, res) => {
  try {
    const { id } = req.params
    const limit = parseInt(req.query.limit) || 20
    const offset = parseInt(req.query.offset) || 0

    const result = await pool.query(
      `SELECT p.*, u.username, u.name, u.avatar 
       FROM posts p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.user_id = $1 
       ORDER BY p.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    )

    res.json(result)
  } catch (error) {
    console.error('Get user posts error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Follow/unfollow user
router.post('/:id/follow', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    if (userId === parseInt(id)) {
      return res.status(400).json({ error: 'Cannot follow yourself' })
    }

    // Check if already following
    const existing = await pool.query(
      'SELECT id FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)',
      [userId, id]
    )

    if (existing.length > 0) {
      // Unfollow
      await pool.query('DELETE FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)', [userId, id])
      res.json({ following: false })
    } else {
      // Follow
      await pool.query(
        'INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, $3)',
        [userId, id, 'accepted']
      )
      res.json({ following: true })
    }
  } catch (error) {
    console.error('Follow error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get friends list
router.get('/:id/friends', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT u.id, u.username, u.name, u.avatar, u.bio 
       FROM friends f 
       JOIN users u ON (f.friend_id = u.id OR f.user_id = u.id) 
       WHERE (f.user_id = $1 OR f.friend_id = $1) AND f.status = $2 AND u.id != $1`,
      [id, 'accepted']
    )

    res.json(result)
  } catch (error) {
    console.error('Get friends error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
