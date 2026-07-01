const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register User
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      age, 
      gender, 
      role = 'user', 
      address,
      // Doctor-specific fields
      specialization,
      qualification,
      experience,
      consultationFee,
      clinicName,
      clinicAddress,
      city,
      workingHours,
      bio,
      languages
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user (password is hashed by User model pre-save hook)
    const user = new User({
      name,
      email,
      password,
      phone,
      age,
      gender,
      role,
      address
    });

    await user.save();

    // If role is doctor, create doctor profile
    let doctorProfile = null;
    if (role === 'doctor') {
      try {
        const Doctor = require('../models/Doctor');
        
        // Map common specialization names to enum values
        const specializationMap = {
          'General Practice': 'General Physician',
          'Cardiology': 'Cardiologist',
          'Neurology': 'Neurologist',
          'Pediatrics': 'Pediatrician',
          'Dermatology': 'Dermatologist',
          'Orthopedics': 'Orthopedic',
          'Gynecology': 'Gynecologist',
          'Psychiatry': 'Psychiatrist',
          'ENT': 'ENT Specialist',
          'Ophthalmology': 'Ophthalmologist',
          'Dentist': 'Dentist',
          'Urology': 'Urologist',
          'Gastroenterology': 'Gastroenterologist',
          'Endocrinology': 'Endocrinologist',
          'Nephrology': 'Nephrologist',
          'Pulmonology': 'Pulmonologist'
        };
        
        const mappedSpecialization = specializationMap[specialization] || 'General Physician';
        
        doctorProfile = new Doctor({
          userId: user._id,
          specialization: mappedSpecialization,
          qualification: qualification || 'MBBS',
          experience: experience ? parseInt(experience) : 0,
          consultationFee: consultationFee ? parseInt(consultationFee) : 100,
          clinicName: clinicName || `${name}'s Clinic`,
          clinicAddress: clinicAddress || address || 'TBD',
          city: city || 'TBD',
          workingHours: workingHours || 'Mon-Fri: 9AM-6PM',
          bio: bio || `Dr. ${name} - ${specialization || 'General Practice'}`,
          languages: languages ? (Array.isArray(languages) ? languages : [languages]) : ['English'],
          isApproved: false // Requires admin approval
        });

        await doctorProfile.save();
      } catch (doctorError) {
        console.error('Error creating doctor profile:', doctorError);
        // Still proceed with user creation, but log the error
      }
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: role === 'doctor' 
        ? 'Doctor registration successful! Your profile is pending admin approval.'
        : 'Registration successful',
      data: {
        user: userObj,
        doctor: doctorProfile,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    // If doctor, fetch doctor profile
    let doctorProfile = null;
    if (user.role === 'doctor') {
      try {
        const Doctor = require('../models/Doctor');
        doctorProfile = await Doctor.findOne({ userId: user._id });
      } catch (e) {
        // Doctor profile might not exist yet
      }
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userObj,
        doctor: doctorProfile,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // TODO: Send email with reset token
    // For now, just return success
    res.json({
      success: true,
      message: 'Password reset link sent to your email',
      data: { resetToken }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reset link',
      error: error.message
    });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Update password (hashed by User model pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    });
  }
});

// Get Current User
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    let doctorProfile = null;
    if (user.role === 'doctor') {
      try {
        const Doctor = require('../models/Doctor');
        doctorProfile = await Doctor.findOne({ userId: user._id });
      } catch (e) {
        // Doctor profile might not exist yet
      }
    }

    res.json({
      success: true,
      data: { user, doctor: doctorProfile }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;
