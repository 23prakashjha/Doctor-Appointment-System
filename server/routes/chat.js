const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const router = express.Router();

// In-memory storage for messages (in production, use Redis or database)
const messages = new Map();

// Store message
router.post('/send', auth, [
  body('roomId').notEmpty().withMessage('Room ID is required'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
  body('receiverId').notEmpty().withMessage('Receiver ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { roomId, message, receiverId } = req.body;

    const messageData = {
      id: Date.now().toString(),
      senderId: req.user.userId,
      receiverId,
      roomId,
      message,
      timestamp: new Date(),
      read: false
    };

    // Store message
    if (!messages.has(roomId)) {
      messages.set(roomId, []);
    }
    messages.get(roomId).push(messageData);

    // Emit message via socket.io (handled in server.js)
    req.app.get('io').to(roomId).emit('message', messageData);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message: messageData }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Get chat history
router.get('/history/:roomId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const { roomId } = req.params;

    const roomMessages = messages.get(roomId) || [];
    
    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedMessages = roomMessages.slice(startIndex, endIndex);

    // Mark messages as read for current user
    paginatedMessages.forEach(msg => {
      if (msg.receiverId === req.user.userId) {
        msg.read = true;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        messages: paginatedMessages.reverse(), // Show newest first
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(roomMessages.length / parseInt(limit)),
          total: roomMessages.length
        }
      }
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat history',
      error: error.message
    });
  }
});

// Get user's chat rooms
router.get('/rooms', auth, async (req, res) => {
  try {
    const userRooms = [];
    
    // Find all rooms where user is participant
    for (const [roomId, roomMessages] of messages.entries()) {
      const userParticipates = roomMessages.some(
        msg => msg.senderId === req.user.userId || msg.receiverId === req.user.userId
      );
      
      if (userParticipates) {
        const lastMessage = roomMessages[roomMessages.length - 1];
        const unreadCount = roomMessages.filter(
          msg => msg.receiverId === req.user.userId && !msg.read
        ).length;
        
        // Get other participant's ID
        const otherParticipantId = roomMessages.find(
          msg => msg.senderId !== req.user.userId
        )?.senderId || roomMessages.find(
          msg => msg.receiverId !== req.user.userId
        )?.receiverId;
        
        userRooms.push({
          roomId,
          lastMessage,
          unreadCount,
          otherParticipantId,
          lastActivity: lastMessage?.timestamp || new Date()
        });
      }
    }

    // Sort by last activity
    userRooms.sort((a, b) => b.lastActivity - a.lastActivity);

    res.status(200).json({
      success: true,
      data: { rooms: userRooms }
    });
  } catch (error) {
    console.error('Get chat rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat rooms',
      error: error.message
    });
  }
});

// Mark messages as read
router.put('/read/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const roomMessages = messages.get(roomId) || [];
    
    let markedCount = 0;
    roomMessages.forEach(msg => {
      if (msg.receiverId === req.user.userId && !msg.read) {
        msg.read = true;
        markedCount++;
      }
    });

    res.status(200).json({
      success: true,
      message: `${markedCount} messages marked as read`,
      data: { markedCount }
    });
  } catch (error) {
    console.error('Mark messages read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
});

// Delete message
router.delete('/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    let messageDeleted = false;
    
    // Find and delete message
    for (const [roomId, roomMessages] of messages.entries()) {
      const messageIndex = roomMessages.findIndex(
        msg => msg.id === messageId && msg.senderId === req.user.userId
      );
      
      if (messageIndex !== -1) {
        roomMessages.splice(messageIndex, 1);
        messageDeleted = true;
        
        // Notify room about message deletion
        req.app.get('io').to(roomId).emit('messageDeleted', {
          messageId,
          roomId
        });
        break;
      }
    }

    if (!messageDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or access denied'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
});

// Clear chat history
router.delete('/room/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const roomMessages = messages.get(roomId) || [];
    
    // Filter out messages where user is not sender
    const remainingMessages = roomMessages.filter(
      msg => msg.senderId !== req.user.userId
    );
    
    messages.set(roomId, remainingMessages);

    res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully'
    });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat history',
      error: error.message
    });
  }
});

// Get unread message count
router.get('/unread-count', auth, async (req, res) => {
  try {
    let unreadCount = 0;
    
    for (const roomMessages of messages.values()) {
      unreadCount += roomMessages.filter(
        msg => msg.receiverId === req.user.userId && !msg.read
      ).length;
    }

    res.status(200).json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
});

// Generate unique room ID for two users
router.post('/create-room', auth, [
  body('otherUserId').notEmpty().withMessage('Other user ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { otherUserId } = req.body;
    
    // Generate room ID (sorted combination of user IDs)
    const roomId = [req.user.userId, otherUserId].sort().join('_');
    
    // Check if room already exists
    if (!messages.has(roomId)) {
      messages.set(roomId, []);
    }

    res.status(200).json({
      success: true,
      message: 'Chat room created/retrieved successfully',
      data: { roomId }
    });
  } catch (error) {
    console.error('Create chat room error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat room',
      error: error.message
    });
  }
});

// Get typing status (placeholder for future implementation)
router.get('/typing/:roomId', auth, async (req, res) => {
  try {
    // This would typically use Redis or another real-time store
    // For now, return empty typing users
    res.status(200).json({
      success: true,
      data: { typingUsers: [] }
    });
  } catch (error) {
    console.error('Get typing status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get typing status',
      error: error.message
    });
  }
});

module.exports = router;
