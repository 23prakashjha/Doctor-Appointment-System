const express = require('express');
const { body, validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const filter = { recipient: req.user.userId };
    
    if (status) {
      filter.status = status;
    }
    
    if (type) {
      filter.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await Notification.find(filter)
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.getUnreadCount(req.user.userId);

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

// Get unread count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const unreadCount = await Notification.getUnreadCount(req.user.userId);

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

// Mark notifications as read
router.put('/mark-read', auth, [
  body('notificationIds').optional().isArray().withMessage('notificationIds must be an array')
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

    const { notificationIds } = req.body;
    await Notification.markAsRead(req.user.userId, notificationIds);

    res.status(200).json({
      success: true,
      message: 'Notifications marked as read'
    });
  } catch (error) {
    console.error('Mark notifications read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
      error: error.message
    });
  }
});

// Mark single notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.recipient.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await notification.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: { notification }
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
});

// Archive notification
router.put('/:id/archive', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.recipient.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await notification.archive();

    res.status(200).json({
      success: true,
      message: 'Notification archived',
      data: { notification }
    });
  } catch (error) {
    console.error('Archive notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive notification',
      error: error.message
    });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.recipient.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
});

// Create notification (admin only)
router.post('/', auth, authorize('admin'), [
  body('recipient').notEmpty().withMessage('Recipient is required'),
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('message').notEmpty().withMessage('Message is required').isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
  body('type').isIn([
    'appointment', 'payment', 'review', 'chat', 'system',
    'doctor_approval', 'appointment_reminder', 'prescription',
    'profile_update', 'security', 'promotion'
  ]).withMessage('Valid type is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Valid priority is required')
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

    const {
      recipient, title, message, type, priority, relatedId,
      relatedModel, actionUrl, actionText, metadata, scheduledFor
    } = req.body;

    const notification = await Notification.createNotification({
      recipient,
      sender: req.user.userId,
      title,
      message,
      type,
      priority,
      relatedId,
      relatedModel,
      actionUrl,
      actionText,
      metadata,
      scheduledFor,
      sendEmail: false // Don't send email for manually created notifications
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: { notification }
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
});

// Send bulk notifications (admin only)
router.post('/bulk', auth, authorize('admin'), [
  body('recipients').isArray({ min: 1 }).withMessage('Recipients must be a non-empty array'),
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('message').notEmpty().withMessage('Message is required').isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
  body('type').isIn([
    'appointment', 'payment', 'review', 'chat', 'system',
    'doctor_approval', 'appointment_reminder', 'prescription',
    'profile_update', 'security', 'promotion'
  ]).withMessage('Valid type is required')
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

    const {
      recipients, title, message, type, priority, actionUrl,
      actionText, metadata, scheduledFor
    } = req.body;

    const notifications = [];
    
    for (const recipient of recipients) {
      const notification = await Notification.createNotification({
        recipient,
        sender: req.user.userId,
        title,
        message,
        type,
        priority,
        actionUrl,
        actionText,
        metadata,
        scheduledFor,
        sendEmail: false
      });
      notifications.push(notification);
    }

    res.status(201).json({
      success: true,
      message: `${notifications.length} notifications created successfully`,
      data: { notifications }
    });
  } catch (error) {
    console.error('Send bulk notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk notifications',
      error: error.message
    });
  }
});

// Get scheduled notifications (admin only)
router.get('/scheduled/all', auth, authorize('admin'), async (req, res) => {
  try {
    const notifications = await Notification.getScheduledNotifications();

    res.status(200).json({
      success: true,
      data: { notifications }
    });
  } catch (error) {
    console.error('Get scheduled notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get scheduled notifications',
      error: error.message
    });
  }
});

// Get notification statistics (admin only)
router.get('/stats/dashboard', auth, authorize('admin'), async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ status: 'unread' });
    const readNotifications = await Notification.countDocuments({ status: 'read' });
    
    const notificationsByType = await Notification.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const notificationsByPriority = await Notification.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentNotifications = await Notification.find()
      .populate('recipient', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalNotifications,
        unreadNotifications,
        readNotifications,
        notificationsByType,
        notificationsByPriority,
        recentNotifications
      }
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics',
      error: error.message
    });
  }
});

// Clear all notifications for user
router.delete('/clear-all', auth, async (req, res) => {
  try {
    const result = await Notification.deleteMany({ 
      recipient: req.user.userId 
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notifications cleared`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('Clear notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear notifications',
      error: error.message
    });
  }
});

module.exports = router;
