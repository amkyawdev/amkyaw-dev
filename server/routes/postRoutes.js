import express from 'express'
import pool from '../config/neon.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Get all posts
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    const offset = parseInt(req.query.offset) || 0

    const result = await pool.query(
      `SELECT p.*, u.username, u.name, u.avatar, u.verified,
       (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
       (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
       FROM posts p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )

    res.json(result)
  } catch (error) {
    console.error('Get posts error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT p.*, u.username, u.name, u.avatar, u.verified
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.json(result[0])
  } catch (error) {
    console.error('Get post error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Create post
router.post('/', authenticate, async (req, res) => {
  try {
    const { content, image } = req.body

    const result = await pool.query(
      `INSERT INTO posts (user_id, content, image)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, content, image]
    )

    // Get user info
    const user = await pool.query(
      'SELECT username, name, avatar FROM users WHERE id = $1',
      [req.user.id]
    )

    res.json({
      ...result[0],
      ...user[0]
    })
  } catch (error) {
    console.error('Create post error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update post
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { content, image } = req.body

    const result = await pool.query(
      `UPDATE posts SET content = $1, image = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [content, image, id, req.user.id]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'Post not found or unauthorized' })
    }

    res.json(result[0])
  } catch (error) {
    console.error('Update post error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete post
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'Post not found or unauthorized' })
    }

    res.json({ message: 'Post deleted' })
  } catch (error) {
    console.error('Delete post error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Like/unlike post
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    // Check if already liked
    const existing = await pool.query(
      'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
      [req.user.id, id]
    )

    if (existing.length > 0) {
      // Unlike
      await pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [req.user.id, id])
      await pool.query('UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1', [id])
      res.json({ liked: false })
    } else {
      // Like
      await pool.query(
        'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
        [req.user.id, id]
      )
      await pool.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1', [id])
      res.json({ liked: true })
    }
  } catch (error) {
    console.error('Like error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get post comments
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT c.*, u.username, u.name, u.avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at DESC`,
      [id]
    )

    res.json(result)
  } catch (error) {
    console.error('Get comments error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add comment
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body

    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, req.user.id, content]
    )

    await pool.query('UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1', [id])

    // Get user info
    const user = await pool.query(
      'SELECT username, name, avatar FROM users WHERE id = $1',
      [req.user.id]
    )

    res.json({
      ...result[0],
      ...user[0]
    })
  } catch (error) {
    console.error('Add comment error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
