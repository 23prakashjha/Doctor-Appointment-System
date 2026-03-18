const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: String,
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminResponse: {
    type: String,
    maxlength: [500, 'Admin response cannot exceed 500 characters']
  },
  responseDate: Date
}, {
  timestamps: true
});

// Index for better query performance
reviewSchema.index({ doctorId: 1, rating: -1 });
reviewSchema.index({ patientId: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ isVerified: 1 });

// Ensure one review per appointment per patient
reviewSchema.index({ appointmentId: 1, patientId: 1 }, { unique: true });

// Pre-save middleware to update doctor's average rating
reviewSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('rating')) {
    try {
      const Doctor = mongoose.model('Doctor');
      const doctor = await Doctor.findById(this.doctorId);
      
      if (doctor) {
        const allReviews = await this.constructor.find({ doctorId: this.doctorId });
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / allReviews.length;
        
        doctor.rating.average = Math.round(averageRating * 10) / 10;
        doctor.rating.count = allReviews.length;
        await doctor.save();
      }
    } catch (error) {
      console.error('Error updating doctor rating:', error);
    }
  }
  next();
});

// Post-remove middleware to update doctor's rating when review is deleted
reviewSchema.post('remove', async function() {
  try {
    const Doctor = mongoose.model('Doctor');
    const doctor = await Doctor.findById(this.doctorId);
    
    if (doctor) {
      const allReviews = await this.constructor.find({ doctorId: this.doctorId });
      if (allReviews.length > 0) {
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / allReviews.length;
        doctor.rating.average = Math.round(averageRating * 10) / 10;
      } else {
        doctor.rating.average = 0;
      }
      doctor.rating.count = allReviews.length;
      await doctor.save();
    }
  } catch (error) {
    console.error('Error updating doctor rating after review deletion:', error);
  }
});

// Static method to get rating distribution
reviewSchema.statics.getRatingDistribution = async function(doctorId) {
  const distribution = await this.aggregate([
    { $match: { doctorId: mongoose.Types.ObjectId(doctorId) } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);
  
  const result = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  distribution.forEach(item => {
    result[item._id] = item.count;
  });
  
  return result;
};

module.exports = mongoose.model('Review', reviewSchema);
