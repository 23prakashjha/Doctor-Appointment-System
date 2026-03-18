const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Book new appointment
router.post('/', auth, [
  body('doctorId').notEmpty().withMessage('Doctor ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required'),
  body('disease').notEmpty().withMessage('Disease/Reason for visit is required'),
  body('symptoms').optional().isLength({ max: 500 }).withMessage('Symptoms cannot exceed 500 characters')
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

    const { doctorId, date, time, disease, symptoms, medicalHistory } = req.body;

    // Check if doctor exists and is approved
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (!doctor.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not approved yet'
      });
    }

    // Check if time slot is available
    const isAvailable = await Appointment.isTimeSlotAvailable(doctorId, date, time);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Check if doctor is available at this time
    const isDoctorAvailable = doctor.isAvailable(date, time);
    if (!isDoctorAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available at this time'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId: req.user.userId,
      doctorId,
      date: new Date(date),
      time,
      disease,
      symptoms,
      medicalHistory,
      consultationFee: doctor.consultationFee
    });

    await appointment.save();

    // Update doctor's total appointments
    doctor.totalAppointments += 1;
    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: { appointment }
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error.message
    });
  }
});

// Get user's appointments
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { patientId: req.user.userId };
    
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointments = await Appointment.find(filter)
      .populate('doctorId')
      .populate('doctorId.userId', 'name profilePicture')
      .sort({ date: -1, time: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(filter);

    res.status(200).json({
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
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
});

// Get appointment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email phone age gender address')
      .populate('doctorId')
      .populate('doctorId.userId', 'name email profilePicture');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    if (appointment.patientId._id.toString() !== req.user.userId && 
        appointment.doctorId.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: { appointment }
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error.message
    });
  }
});

// Cancel appointment
router.put('/:id/cancel', auth, [
  body('reason').optional().isLength({ max: 500 }).withMessage('Cancellation reason cannot exceed 500 characters')
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

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has access to cancel this appointment
    const isPatient = appointment.patientId.toString() === req.user.userId;
    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    const isDoctor = doctor && appointment.doctorId.toString() === doctor._id.toString();

    if (!isPatient && !isDoctor) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if appointment can be cancelled
    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed appointment'
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }

    const { reason } = req.body;
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    appointment.cancelledBy = isPatient ? 'patient' : 'doctor';

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: { appointment }
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
});

// Reschedule appointment
router.put('/:id/reschedule', auth, [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required')
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

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has access to reschedule this appointment
    const isPatient = appointment.patientId.toString() === req.user.userId;
    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    const isDoctor = doctor && appointment.doctorId.toString() === doctor._id.toString();

    if (!isPatient && !isDoctor) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if appointment can be rescheduled
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reschedule completed or cancelled appointment'
      });
    }

    const { date, time } = req.body;

    // Check if new time slot is available
    const isAvailable = await Appointment.isTimeSlotAvailable(
      appointment.doctorId, 
      date, 
      time, 
      appointment._id
    );
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Check if doctor is available at this time
    const doctorRecord = await Doctor.findById(appointment.doctorId);
    const isDoctorAvailable = doctorRecord.isAvailable(date, time);
    if (!isDoctorAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available at this time'
      });
    }

    appointment.date = new Date(date);
    appointment.time = time;
    appointment.status = 'pending'; // Reset to pending for confirmation

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: { appointment }
    });
  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reschedule appointment',
      error: error.message
    });
  }
});

// Add prescription (for doctors)
router.put('/:id/prescription', auth, [
  body('prescription.medicines').optional().isArray().withMessage('Medicines must be an array'),
  body('prescription.tests').optional().isArray().withMessage('Tests must be an array'),
  body('prescription.notes').optional().isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
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

    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    
    if (!doctor) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only doctors can add prescriptions.'
      });
    }

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
        message: 'Access denied. You can only add prescriptions to your own appointments.'
      });
    }

    if (appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only add prescription to completed appointments'
      });
    }

    const { prescription } = req.body;
    appointment.prescription = { ...appointment.prescription, ...prescription };

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Prescription added successfully',
      data: { appointment }
    });
  } catch (error) {
    console.error('Add prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add prescription',
      error: error.message
    });
  }
});

// Get available time slots for a doctor on a specific date
router.get('/available-slots/:doctorId/:date', async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (!doctor.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not approved yet'
      });
    }

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = doctor.availability.find(slot => slot.day === dayOfWeek);

    if (!dayAvailability) {
      return res.status(200).json({
        success: true,
        data: { availableSlots: [] }
      });
    }

    // Get all booked appointments for that date
    const bookedAppointments = await Appointment.find({
      doctorId,
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    }).select('time');

    const bookedTimes = bookedAppointments.map(apt => apt.time);

    // Filter available slots
    const availableSlots = dayAvailability.timeSlots.filter(slot => {
      return !bookedTimes.includes(slot.startTime);
    });

    res.status(200).json({
      success: true,
      data: { availableSlots }
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots',
      error: error.message
    });
  }
});

module.exports = router;
