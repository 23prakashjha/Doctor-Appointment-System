const express = require('express');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all doctors with filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      specialization,
      city,
      disease,
      minExperience,
      maxExperience,
      minRating,
      maxFee,
      search
    } = req.query;

    // Build filter object
    const filter = { isApproved: true };
    
    if (specialization) {
      filter.specialization = specialization;
    }
    
    if (city) {
      filter['clinicAddress.city'] = city;
    }
    
    if (disease) {
      filter.diseases = { $in: [disease] };
    }
    
    if (minExperience || maxExperience) {
      filter.experience = {};
      if (minExperience) filter.experience.$gte = parseInt(minExperience);
      if (maxExperience) filter.experience.$lte = parseInt(maxExperience);
    }
    
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }
    
    if (maxFee) {
      filter.consultationFee = { $lte: parseInt(maxFee) };
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await Doctor.find(filter)
      .populate('userId', 'name email profilePicture')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1, createdAt: -1 });

    const total = await Doctor.countDocuments(filter);

    res.json({
      success: true,
      data: {
        doctors,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
      error: error.message
    });
  }
});

// Get single doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email profilePicture');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: { doctor }
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor',
      error: error.message
    });
  }
});

// Register as doctor (for authenticated users)
router.post('/register', auth, async (req, res) => {
  try {
    // Check if user is already registered as doctor
    const existingDoctor = await Doctor.findOne({ userId: req.user.userId });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a doctor'
      });
    }

    const {
      specialization,
      qualification,
      experience,
      consultationFee,
      diseases,
      availability,
      clinicAddress,
      bio,
      languages,
      achievements
    } = req.body;

    const doctor = new Doctor({
      userId: req.user.userId,
      specialization,
      qualification,
      experience,
      consultationFee,
      diseases,
      availability,
      clinicAddress,
      bio,
      languages,
      achievements
    });

    await doctor.save();

    // Update user role to doctor
    await User.findByIdAndUpdate(req.user.userId, { role: 'doctor' });

    res.status(201).json({
      success: true,
      message: 'Doctor registration submitted successfully. Pending admin approval.',
      data: { doctor }
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Doctor registration failed',
      error: error.message
    });
  }
});

// Update doctor profile (for authenticated doctors)
router.put('/profile', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const {
      specialization,
      qualification,
      experience,
      consultationFee,
      diseases,
      availability,
      clinicAddress,
      bio,
      languages,
      achievements
    } = req.body;

    // Update fields
    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experience !== undefined) doctor.experience = experience;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (diseases) doctor.diseases = diseases;
    if (availability) doctor.availability = availability;
    if (clinicAddress) doctor.clinicAddress = clinicAddress;
    if (bio !== undefined) doctor.bio = bio;
    if (languages) doctor.languages = languages;
    if (achievements) doctor.achievements = achievements;

    await doctor.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { doctor }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Get doctor's own profile (for authenticated doctors)
router.get('/profile/me', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.userId })
      .populate('userId', 'name email profilePicture');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    res.json({
      success: true,
      data: { doctor }
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor profile',
      error: error.message
    });
  }
});

module.exports = router;
