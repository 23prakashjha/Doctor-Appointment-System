const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
      'Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist',
      'Orthopedic', 'Gynecologist', 'Psychiatrist', 'General Physician',
      'ENT Specialist', 'Ophthalmologist', 'Dentist', 'Urologist',
      'Gastroenterologist', 'Endocrinologist', 'Nephrologist', 'Pulmonologist'
    ]
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  diseases: [{
    type: String,
    required: true
  }],
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    timeSlots: [{
      startTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
      },
      endTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
      }
    }]
  }],
  clinicAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: String
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalAppointments: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  certificates: [{
    name: String,
    url: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  approvalDate: Date,
  rejectionReason: String,
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  languages: [{
    type: String,
    enum: ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi']
  }],
  achievements: [String],
  socialLinks: {
    website: String,
    linkedin: String,
    twitter: String
  }
}, {
  timestamps: true
});

// Index for better search performance
doctorSchema.index({ specialization: 1, 'clinicAddress.city': 1 });
doctorSchema.index({ diseases: 1 });
doctorSchema.index({ 'rating.average': -1 });

// Virtual for full name
doctorSchema.virtual('fullName').get(function() {
  return this.userId ? this.userId.name : '';
});

// Method to check if doctor is available at specific time
doctorSchema.methods.isAvailable = function(date, time) {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  const dayAvailability = this.availability.find(slot => slot.day === dayOfWeek);
  
  if (!dayAvailability) return false;
  
  return dayAvailability.timeSlots.some(slot => {
    return time >= slot.startTime && time <= slot.endTime;
  });
};

module.exports = mongoose.model('Doctor', doctorSchema);
