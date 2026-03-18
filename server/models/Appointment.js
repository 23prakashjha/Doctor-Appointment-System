const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  consultationFee: {
    type: Number,
    required: true
  },
  disease: {
    type: String,
    required: [true, 'Disease/Reason for visit is required']
  },
  symptoms: {
    type: String,
    maxlength: [500, 'Symptoms description cannot exceed 500 characters']
  },
  medicalHistory: {
    allergies: [String],
    medications: [String],
    previousConditions: [String]
  },
  prescription: {
    medicines: [{
      name: String,
      dosage: String,
      duration: String,
      instructions: String
    }],
    tests: [String],
    followUpDate: Date,
    notes: String
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
  },
  cancelledBy: {
    type: String,
    enum: ['patient', 'doctor', 'admin']
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
appointmentSchema.index({ patientId: 1, date: -1 });
appointmentSchema.index({ doctorId: 1, date: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: 1, time: 1 });

// Pre-save middleware to update timestamps
appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = Date.now();
  }
  next();
});

// Static method to check if time slot is available
appointmentSchema.statics.isTimeSlotAvailable = async function(doctorId, date, time, excludeAppointmentId = null) {
  const query = {
    doctorId,
    date: new Date(date),
    time,
    status: { $in: ['pending', 'confirmed'] }
  };
  
  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }
  
  const existingAppointment = await this.findOne(query);
  return !existingAppointment;
};

// Virtual for appointment duration in hours
appointmentSchema.virtual('duration').get(function() {
  return 0.5; // Default 30 minutes per appointment
});

module.exports = mongoose.model('Appointment', appointmentSchema);
