const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  type: {
    type: String,
    required: true,
    enum: [
      'appointment', 'payment', 'review', 'chat', 'system',
      'doctor_approval', 'appointment_reminder', 'prescription',
      'profile_update', 'security', 'promotion'
    ]
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  relatedModel: {
    type: String,
    enum: ['Appointment', 'Payment', 'Review', 'Doctor', 'User', 'Blog']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  isEmailSent: {
    type: Boolean,
    default: false
  },
  isPushSent: {
    type: Boolean,
    default: false
  },
  actionUrl: String,
  actionText: String,
  metadata: {
    appointmentDate: Date,
    appointmentTime: String,
    doctorName: String,
    patientName: String,
    amount: Number,
    rating: Number
  },
  scheduledFor: Date,
  expiresAt: Date
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });

// Pre-save middleware to set expiration date
notificationSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }
  next();
});

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  
  // Send email notification if configured
  if (data.sendEmail !== false) {
    // TODO: Implement email sending logic
  }
  
  return notification;
};

// Static method to get unread notifications count
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    status: 'unread'
  });
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = function(userId, notificationIds = null) {
  const query = {
    recipient: userId,
    status: 'unread'
  };
  
  if (notificationIds) {
    query._id = { $in: notificationIds };
  }
  
  return this.updateMany(query, { status: 'read' });
};

// Static method to get scheduled notifications
notificationSchema.statics.getScheduledNotifications = function() {
  return this.find({
    scheduledFor: { $lte: new Date() },
    status: 'unread'
  });
};

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.status = 'read';
  return this.save();
};

// Method to archive
notificationSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Virtual for formatted creation date
notificationSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

module.exports = mongoose.model('Notification', notificationSchema);
