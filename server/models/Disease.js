const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Disease name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Disease name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Cardiovascular', 'Neurological', 'Respiratory', 'Gastrointestinal',
      'Dermatological', 'Orthopedic', 'Endocrine', 'Psychiatric',
      'Pediatric', 'Gynecological', 'Urological', 'Ophthalmological',
      'ENT', 'Dental', 'General', 'Infectious', 'Autoimmune',
      'Genetic', 'Cancer', 'Allergies', 'Other'
    ]
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  symptoms: [{
    type: String,
    maxlength: [100, 'Symptom cannot exceed 100 characters']
  }],
  commonSpecializations: [{
    type: String,
    enum: [
      'Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist',
      'Orthopedic', 'Gynecologist', 'Psychiatrist', 'General Physician',
      'ENT Specialist', 'Ophthalmologist', 'Dentist', 'Urologist',
      'Gastroenterologist', 'Endocrinologist', 'Nephrologist', 'Pulmonologist'
    ]
  }],
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe', 'critical'],
    default: 'moderate'
  },
  isContagious: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  searchCount: {
    type: Number,
    default: 0
  },
  doctorCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better search performance
diseaseSchema.index({ name: 'text', description: 'text' });
diseaseSchema.index({ category: 1 });
diseaseSchema.index({ severity: 1 });
diseaseSchema.index({ searchCount: -1 });
diseaseSchema.index({ doctorCount: -1 });

// Static method to get popular diseases
diseaseSchema.statics.getPopularDiseases = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ searchCount: -1, doctorCount: -1 })
    .limit(limit)
    .select('name category doctorCount');
};

// Static method to search diseases
diseaseSchema.statics.searchDiseases = function(query, limit = 20) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { symptoms: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  })
  .sort({ searchCount: -1 })
  .limit(limit);
};

// Method to increment search count
diseaseSchema.methods.incrementSearchCount = function() {
  this.searchCount += 1;
  return this.save();
};

// Method to update doctor count
diseaseSchema.methods.updateDoctorCount = async function() {
  const Doctor = mongoose.model('Doctor');
  const count = await Doctor.countDocuments({ 
    diseases: this.name,
    isApproved: true 
  });
  this.doctorCount = count;
  return this.save();
};

module.exports = mongoose.model('Disease', diseaseSchema);
