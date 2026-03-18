const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Create review
router.post('/', auth, [
  body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Review comment is required').isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
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

    const { appointmentId, rating, comment } = req.body;

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

    if (appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed appointments'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ appointmentId, patientId: req.user.userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this appointment'
      });
    }

    // Create review
    const review = new Review({
      patientId: req.user.userId,
      doctorId: appointment.doctorId,
      appointmentId,
      rating,
      comment
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('patientId', 'name profilePicture')
      .populate('doctorId')
      .populate('doctorId.userId', 'name');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review: populatedReview }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
});

// Get reviews for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    const filter = { doctorId: req.params.doctorId };
    
    if (rating) {
      filter.rating = parseInt(rating);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filter)
      .populate('patientId', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    // Get rating distribution
    const ratingDistribution = await Review.getRatingDistribution(req.params.doctorId);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        ratingDistribution,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Get user's reviews
router.get('/my-reviews', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ patientId: req.user.userId })
      .populate('doctorId')
      .populate('doctorId.userId', 'name profilePicture')
      .populate('appointmentId', 'date time disease')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ patientId: req.user.userId });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Update review
router.put('/:id', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().notEmpty().withMessage('Review comment cannot be empty').isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
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

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.patientId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('patientId', 'name profilePicture')
      .populate('doctorId')
      .populate('doctorId.userId', 'name');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: { review: updatedReview }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.patientId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
});

// Mark review as helpful
router.put('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const userId = req.user.userId;
    const index = review.helpfulUsers.indexOf(userId);

    if (index > -1) {
      // Remove helpful vote
      review.helpfulUsers.splice(index, 1);
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Add helpful vote
      review.helpfulUsers.push(userId);
      review.helpfulCount += 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: index > -1 ? 'Helpful vote removed' : 'Marked as helpful',
      data: { helpfulCount: review.helpfulCount }
    });
  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update helpful status',
      error: error.message
    });
  }
});

// Report review
router.put('/:id/report', auth, [
  body('reason').notEmpty().withMessage('Report reason is required').isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
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

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.isReported) {
      return res.status(400).json({
        success: false,
        message: 'Review is already reported'
      });
    }

    const { reason } = req.body;
    review.isReported = true;
    review.reportReason = reason;
    review.reportedBy = req.user.userId;

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report review',
      error: error.message
    });
  }
});

// Add admin response to review (admin only)
router.put('/:id/admin-response', auth, [
  body('response').notEmpty().withMessage('Admin response is required').isLength({ max: 500 }).withMessage('Response cannot exceed 500 characters')
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
        message: 'Access denied. Only admins can add responses.'
      });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const { response } = req.body;
    review.adminResponse = response;
    review.responseDate = Date.now();

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Admin response added successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Add admin response error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add admin response',
      error: error.message
    });
  }
});

// Get reported reviews (admin only)
router.get('/reported', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can view reported reviews.'
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ isReported: true })
      .populate('patientId', 'name email')
      .populate('doctorId')
      .populate('doctorId.userId', 'name')
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ isReported: true });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get reported reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reported reviews',
      error: error.message
    });
  }
});

module.exports = router;
