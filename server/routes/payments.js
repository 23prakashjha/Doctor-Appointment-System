const express = require('express');
const { body, validationResult } = require('express-validator');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
router.post('/create-order', auth, [
  body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
  body('amount').isInt({ min: 1 }).withMessage('Valid amount is required')
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

    const { appointmentId, amount } = req.body;

    // Verify appointment exists and belongs to user
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.patientId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (appointment.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this appointment'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `appointment_${appointmentId}`,
      notes: {
        appointmentId,
        userId: req.user.userId
      }
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = new Payment({
      appointmentId,
      patientId: req.user.userId,
      doctorId: appointment.doctorId,
      amount,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'razorpay',
      razorpayOrderId: order.id,
      metadata: {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        paymentId: payment._id
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Verify payment
router.post('/verify', auth, [
  body('razorpayOrderId').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpayPaymentId').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpaySignature').notEmpty().withMessage('Razorpay signature is required'),
  body('paymentId').notEmpty().withMessage('Payment ID is required')
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

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;

    // Verify signature
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    if (payment.patientId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    payment.status = 'completed';
    payment.paymentMethod = 'razorpay';
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.transactionId = Payment.generateTransactionId();
    payment.paymentDate = Date.now();

    await payment.save();

    // Update appointment payment status
    const appointment = await Appointment.findById(payment.appointmentId);
    if (appointment) {
      appointment.paymentStatus = 'paid';
      appointment.status = 'confirmed';
      await appointment.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: { payment }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { patientId: req.user.userId };
    
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const payments = await Payment.find(filter)
      .populate('appointmentId', 'date time disease status')
      .populate('doctorId')
      .populate('doctorId.userId', 'name')
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message
    });
  }
});

// Get payment statistics (for doctors)
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only doctors can view payment statistics.'
      });
    }

    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    // Get payment statistics
    const totalEarnings = await Payment.aggregate([
      { $match: { doctorId: doctor._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Get monthly earnings (last 6 months)
    const monthlyEarnings = await Payment.aggregate([
      {
        $match: {
          doctorId: doctor._id,
          status: 'completed',
          paymentDate: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$paymentDate' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get recent payments
    const recentPayments = await Payment.find({ doctorId: doctor._id })
      .populate('patientId', 'name')
      .sort({ paymentDate: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalEarnings: totalEarnings[0]?.total || 0,
        totalTransactions: totalEarnings[0]?.count || 0,
        monthlyEarnings,
        recentPayments
      }
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics',
      error: error.message
    });
  }
});

// Get payment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('appointmentId', 'date time disease status')
      .populate('patientId', 'name email')
      .populate('doctorId')
      .populate('doctorId.userId', 'name');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user has access to this payment
    if (payment.patientId._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: { payment }
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message
    });
  }
});

// Process refund (admin only)
router.post('/:id/refund', auth, [
  body('reason').notEmpty().withMessage('Refund reason is required'),
  body('amount').isInt({ min: 1 }).withMessage('Valid refund amount is required')
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

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can process refunds.'
      });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund completed payments'
      });
    }

    const { reason, amount } = req.body;

    if (amount > payment.amount) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount cannot exceed payment amount'
      });
    }

    try {
      // Process refund with Razorpay
      const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: amount * 100 // Convert to paise
      });

      payment.status = amount === payment.amount ? 'refunded' : 'partially_refunded';
      payment.refundId = refund.id;
      payment.refundAmount = amount;
      payment.refundReason = reason;
      payment.refundDate = Date.now();

      await payment.save();

      res.status(200).json({
        success: true,
        message: 'Refund processed successfully',
        data: { payment, refund }
      });
    } catch (razorpayError) {
      console.error('Razorpay refund error:', razorpayError);
      res.status(500).json({
        success: false,
        message: 'Failed to process refund with Razorpay',
        error: razorpayError.message
      });
    }
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
});

module.exports = router;
