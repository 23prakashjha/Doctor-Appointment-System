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

// Get doctor's appointments (for authenticated doctors)
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.userId });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const Appointment = require('../models/Appointment');
    const { page = 1, limit = 10, status } = req.query;
    const filter = { doctorId: doctor._id };

    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email profilePicture')
      .sort({ date: -1, time: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Appointment.countDocuments(filter);

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
});

// Get doctor stats (for authenticated doctors)
router.get('/stats', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.userId });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const Appointment = require('../models/Appointment');

    const totalAppointments = await Appointment.countDocuments({ doctorId: doctor._id });
    const upcomingAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] }
    });
    const completedAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      status: 'completed'
    });
    const cancelledAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      status: 'cancelled'
    });
    const totalPatients = await Appointment.distinct('patientId', { doctorId: doctor._id });

    res.json({
      success: true,
      data: {
        totalAppointments,
        upcomingAppointments,
        completedAppointments,
        cancelledAppointments,
        totalPatients: totalPatients.length
      }
    });
  } catch (error) {
    console.error('Get doctor stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor stats',
      error: error.message
    });
  }
});

// Get all doctors for admin (with approval status)
router.get('/admin', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can view all doctors.'
      });
    }

    const { page = 1, limit = 10, search, status, specialization } = req.query;
    const filter = {};

    if (status === 'pending') {
      filter.isApproved = false;
      filter.rejectionReason = { $exists: false };
    } else if (status === 'approved') {
      filter.isApproved = true;
    } else if (status === 'rejected') {
      filter.rejectionReason = { $exists: true, $ne: null };
    }

    if (specialization) {
      filter.specialization = specialization;
    }

    if (search) {
      filter.$or = [
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await Doctor.find(filter)
      .populate('userId', 'name email profilePicture')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Doctor.countDocuments(filter);

    const doctorsWithStatus = doctors.map(doc => ({
      ...doc.toObject(),
      approvalStatus: doc.isApproved ? 'approved' : doc.rejectionReason ? 'rejected' : 'pending'
    }));

    res.json({
      success: true,
      data: {
        doctors: doctorsWithStatus,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get admin doctors error:', error);
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

// Update appointment status (for authenticated doctors)
router.put('/appointments/:id/status', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.userId });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const Appointment = require('../models/Appointment');
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This appointment does not belong to you.'
      });
    }

    const { status } = req.body;
    const validStatuses = ['confirmed', 'completed', 'cancelled', 'no-show'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot update status of a ${appointment.status} appointment`
      });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      data: { appointment }
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status',
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

// Approve doctor (admin only)
router.put('/:id/approve', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can approve doctors.'
      });
    }

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    doctor.isApproved = true;
    doctor.approvalDate = new Date();
    doctor.rejectionReason = undefined;
    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor approved successfully',
      data: { doctor }
    });
  } catch (error) {
    console.error('Approve doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve doctor',
      error: error.message
    });
  }
});

// Reject doctor (admin only)
router.put('/:id/reject', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can reject doctors.'
      });
    }

    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    doctor.isApproved = false;
    doctor.rejectionReason = reason;
    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor rejected',
      data: { doctor }
    });
  } catch (error) {
    console.error('Reject doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject doctor',
      error: error.message
    });
  }
});

module.exports = router;
