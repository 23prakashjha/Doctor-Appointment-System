const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'card', 'upi', 'netbanking', 'wallet', 'cash'],
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  refundId: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String,
  refundDate: Date,
  paymentDate: {
    type: Date,
    default: Date.now
  },
  failureReason: String,
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  metadata: {
    ip: String,
    userAgent: String,
    device: String,
    location: String
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
paymentSchema.index({ appointmentId: 1 });
paymentSchema.index({ patientId: 1, paymentDate: -1 });
paymentSchema.index({ doctorId: 1, paymentDate: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });

// Static method to generate unique transaction ID
paymentSchema.statics.generateTransactionId = function() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TXN_${timestamp}_${random}`.toUpperCase();
};

// Pre-save middleware to generate transaction ID
paymentSchema.pre('save', function(next) {
  if (!this.transactionId && this.status !== 'pending') {
    this.transactionId = this.constructor.generateTransactionId();
  }
  next();
});

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
});

module.exports = mongoose.model('Payment', paymentSchema);
