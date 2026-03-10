import express from 'express'
import pool from '../config/neon.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Get all groups
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT g.*, u.username as owner_username, u.name as owner_name,
              (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as members_count
       FROM groups g
       JOIN users u ON g.owner_id = u.id
       ORDER BY g.created_at DESC`
    )

    res.json(result)
  } catch (error) {
    console.error('Get groups error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get single group
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT g.*, u.username as owner_username, u.name as owner_name
       FROM groups g
       JOIN users u ON g.owner_id = u.id
       WHERE g.id = $1`,
      [id]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'Group not found' })
    }

    // Get members
    const members = await pool.query(
      `SELECT gm.user_id, gm.role, u.username, u.name, u.avatar
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1
       ORDER BY 
         CASE gm.role
           WHEN 'owner' THEN 1
           WHEN 'co-leader' THEN 2
           ELSE 3
         END`,
      [id]
    )

    // Get seats
    const seats = await pool.query(
      `SELECT gs.*, u.username, u.name, u.avatar
       FROM group_seats gs
       LEFT JOIN users u ON gs.user_id = u.id
       WHERE gs.group_id = $1
       ORDER BY gs.seat_number`,
      [id]
    )

    res.json({
      ...result[0],
      members: members,
      seats: seats
    })
  } catch (error) {
    console.error('Get group error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Create group
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description } = req.body

    const result = await pool.query(
      `INSERT INTO groups (name, description, owner_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, req.user.id]
    )

    const groupId = result[0].id

    // Add creator as owner
    await pool.query(
      `INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, $3)`,
      [groupId, req.user.id, 'owner']
    )

    // Initialize 9 seats
    for (let i = 0; i < 9; i++) {
      await pool.query(
        `INSERT INTO group_seats (group_id, seat_number, is_occupied) VALUES ($1, $2, false)`,
        [groupId, i]
      )
    }

    res.json(result[0])
  } catch (error) {
    console.error('Create group error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update group
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    // Check if user is owner
    const group = await pool.query(
      'SELECT owner_id FROM groups WHERE id = $1',
      [id]
    )

    if (group.length === 0) {
      return res.status(404).json({ error: 'Group not found' })
    }

    if (group[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const result = await pool.query(
      `UPDATE groups SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [name, description, id]
    )

    res.json(result[0])
  } catch (error) {
    console.error('Update group error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete group
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    const group = await pool.query(
      'SELECT owner_id FROM groups WHERE id = $1',
      [id]
    )

    if (group.length === 0) {
      return res.status(404).json({ error: 'Group not found' })
    }

    if (group[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await pool.query('DELETE FROM groups WHERE id = $1', [id])

    res.json({ message: 'Group deleted' })
  } catch (error) {
    console.error('Delete group error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Join group
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    // Check if already member
    const existing = await pool.query(
      'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Already a member' })
    }

    await pool.query(
      `INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, 'member')`,
      [id, req.user.id]
    )

    res.json({ message: 'Joined group' })
  } catch (error) {
    console.error('Join group error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Leave group
router.post('/:id/leave', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    // Check if owner
    const group = await pool.query(
      'SELECT owner_id FROM groups WHERE id = $1',
      [id]
    )

    if (group[0].owner_id === req.user.id) {
      return res.status(400).json({ error: 'Owner cannot leave group' })
    }

    await pool.query(
      'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    // Clear seat if occupied
    await pool.query(
      'UPDATE group_seats SET user_id = NULL, is_occupied = false WHERE group_id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    res.json({ message: 'Left group' })
  } catch (error) {
    console.error('Leave group error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get group messages
router.get('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const result = await pool.query(
      `SELECT gm.*, u.username, u.name, u.avatar
       FROM group_messages gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1
       ORDER BY gm.created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    )

    res.json(result.reverse())
  } catch (error) {
    console.error('Get group messages error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Send group message
router.post('/:id/messages', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body

    const result = await pool.query(
      `INSERT INTO group_messages (group_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, req.user.id, content]
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
    console.error('Send group message error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Join seat (voice)
router.post('/:id/seats/:seatNumber/join', authenticate, async (req, res) => {
  try {
    const { id, seatNumber } = req.params

    // Check if seat is already occupied
    const seat = await pool.query(
      'SELECT * FROM group_seats WHERE group_id = $1 AND seat_number = $2',
      [id, seatNumber]
    )

    if (seat.length === 0) {
      return res.status(404).json({ error: 'Seat not found' })
    }

    if (seat[0].is_occupied && seat[0].user_id !== req.user.id) {
      return res.status(400).json({ error: 'Seat is occupied' })
    }

    // Check if user is already in another seat
    await pool.query(
      'UPDATE group_seats SET user_id = NULL, is_occupied = false WHERE group_id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    // Join seat
    await pool.query(
      'UPDATE group_seats SET user_id = $1, is_occupied = true WHERE group_id = $2 AND seat_number = $3',
      [req.user.id, id, seatNumber]
    )

    res.json({ message: 'Joined seat' })
  } catch (error) {
    console.error('Join seat error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Leave seat (voice)
router.post('/:id/seats/:seatNumber/leave', authenticate, async (req, res) => {
  try {
    const { id, seatNumber } = req.params

    await pool.query(
      'UPDATE group_seats SET user_id = NULL, is_occupied = false, is_muted = false WHERE group_id = $1 AND seat_number = $2 AND user_id = $3',
      [id, seatNumber, req.user.id]
    )

    res.json({ message: 'Left seat' })
  } catch (error) {
    console.error('Leave seat error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Mute seat
router.post('/:id/seats/:seatNumber/mute', authenticate, async (req, res) => {
  try {
    const { id, seatNumber } = req.params

    // Check if user is leader or co-leader
    const member = await pool.query(
      'SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    if (member.length === 0 || !['owner', 'co-leader'].includes(member[0].role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await pool.query(
      'UPDATE group_seats SET is_muted = NOT is_muted WHERE group_id = $1 AND seat_number = $2',
      [id, seatNumber]
    )

    res.json({ message: 'Seat muted/unmuted' })
  } catch (error) {
    console.error('Mute seat error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Kick from seat
router.post('/:id/seats/:seatNumber/kick', authenticate, async (req, res) => {
  try {
    const { id, seatNumber } = req.params

    // Check if user is owner
    const group = await pool.query(
      'SELECT owner_id FROM groups WHERE id = $1',
      [id]
    )

    if (group[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await pool.query(
      'UPDATE group_seats SET user_id = NULL, is_occupied = false, is_muted = false WHERE group_id = $1 AND seat_number = $2',
      [id, seatNumber]
    )

    res.json({ message: 'User kicked from seat' })
  } catch (error) {
    console.error('Kick from seat error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Promote member
router.post('/:id/members/:userId/promote', authenticate, async (req, res) => {
  try {
    const { id, userId } = req.params

    // Check if user is owner
    const group = await pool.query(
      'SELECT owner_id FROM groups WHERE id = $1',
      [id]
    )

    if (group[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await pool.query(
      'UPDATE group_members SET role = $1 WHERE group_id = $2 AND user_id = $3',
      ['co-leader', id, userId]
    )

    res.json({ message: 'Member promoted' })
  } catch (error) {
    console.error('Promote member error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
