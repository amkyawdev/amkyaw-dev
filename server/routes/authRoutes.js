import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/neon.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'amkyaw-dev-secret-key'

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    )

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await pool.query(
      `INSERT INTO users (username, email, password, name, avatar) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, username, email, name, avatar`,
      [username, email, hashedPassword, name, `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`]
    )

    const user = result[0]
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (result.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const user = result[0]

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        website: user.website
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const result = await pool.query(
      'SELECT id, username, email, name, avatar, bio, location, website, verified, created_at FROM users WHERE id = $1',
      [decoded.id]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(result[0])
  } catch (error) {
    console.error('Get user error:', error)
    res.status(401).json({ error: 'Invalid token' })
  }
})

// Reset password
router.post('/reset', async (req, res) => {
  try {
    const { email } = req.body

    // Check if user exists
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    // In production, send reset email
    res.json({ message: 'Reset link sent to your email' })
  } catch (error) {
    console.error('Reset error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
