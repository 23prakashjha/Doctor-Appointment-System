const express = require('express');
const { body, validationResult } = require('express-validator');
const Disease = require('../models/Disease');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all diseases
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      category,
      severity,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter query
    const filter = { isActive: true };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { symptoms: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (severity) {
      filter.severity = severity;
    }

    // Build sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const diseases = await Disease.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Disease.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        diseases,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get diseases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diseases',
      error: error.message
    });
  }
});

// Get popular diseases
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const diseases = await Disease.getPopularDiseases(parseInt(limit));

    res.status(200).json({
      success: true,
      data: { diseases }
    });
  } catch (error) {
    console.error('Get popular diseases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular diseases',
      error: error.message
    });
  }
});

// Search diseases
router.get('/search', async (req, res) => {
  try {
    const { q: query, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const diseases = await Disease.searchDiseases(query, parseInt(limit));

    // Increment search count for each found disease
    diseases.forEach(disease => {
      disease.incrementSearchCount();
    });

    res.status(200).json({
      success: true,
      data: { diseases }
    });
  } catch (error) {
    console.error('Search diseases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search diseases',
      error: error.message
    });
  }
});

// Get disease by ID
router.get('/:id', async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);

    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease not found'
      });
    }

    // Increment search count
    disease.incrementSearchCount();

    res.status(200).json({
      success: true,
      data: { disease }
    });
  } catch (error) {
    console.error('Get disease error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disease',
      error: error.message
    });
  }
});

// Create disease (admin only)
router.post('/', auth, authorize('admin'), [
  body('name').trim().notEmpty().withMessage('Disease name is required').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('category').isIn([
    'Cardiovascular', 'Neurological', 'Respiratory', 'Gastrointestinal',
    'Dermatological', 'Orthopedic', 'Endocrine', 'Psychiatric',
    'Pediatric', 'Gynecological', 'Urological', 'Ophthalmological',
    'ENT', 'Dental', 'General', 'Infectious', 'Autoimmune',
    'Genetic', 'Cancer', 'Allergies', 'Other'
  ]).withMessage('Valid category is required'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('symptoms').optional().isArray().withMessage('Symptoms must be an array'),
  body('commonSpecializations').optional().isArray().withMessage('Common specializations must be an array'),
  body('severity').optional().isIn(['mild', 'moderate', 'severe', 'critical']).withMessage('Valid severity is required')
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

    const { name, category, description, symptoms, commonSpecializations, severity, isContagious } = req.body;

    // Check if disease already exists
    const existingDisease = await Disease.findOne({ name });
    if (existingDisease) {
      return res.status(400).json({
        success: false,
        message: 'Disease with this name already exists'
      });
    }

    const disease = new Disease({
      name,
      category,
      description,
      symptoms,
      commonSpecializations,
      severity,
      isContagious
    });

    await disease.save();

    res.status(201).json({
      success: true,
      message: 'Disease created successfully',
      data: { disease }
    });
  } catch (error) {
    console.error('Create disease error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create disease',
      error: error.message
    });
  }
});

// Update disease (admin only)
router.put('/:id', auth, authorize('admin'), [
  body('name').optional().trim().notEmpty().withMessage('Disease name cannot be empty').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('category').optional().isIn([
    'Cardiovascular', 'Neurological', 'Respiratory', 'Gastrointestinal',
    'Dermatological', 'Orthopedic', 'Endocrine', 'Psychiatric',
    'Pediatric', 'Gynecological', 'Urological', 'Ophthalmological',
    'ENT', 'Dental', 'General', 'Infectious', 'Autoimmune',
    'Genetic', 'Cancer', 'Allergies', 'Other'
  ]).withMessage('Valid category is required'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('symptoms').optional().isArray().withMessage('Symptoms must be an array'),
  body('commonSpecializations').optional().isArray().withMessage('Common specializations must be an array'),
  body('severity').optional().isIn(['mild', 'moderate', 'severe', 'critical']).withMessage('Valid severity is required')
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

    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease not found'
      });
    }

    const allowedUpdates = [
      'name', 'category', 'description', 'symptoms', 
      'commonSpecializations', 'severity', 'isContagious', 'isActive'
    ];

    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const updatedDisease = await Disease.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Disease updated successfully',
      data: { disease: updatedDisease }
    });
  } catch (error) {
    console.error('Update disease error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update disease',
      error: error.message
    });
  }
});

// Delete disease (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease not found'
      });
    }

    // Soft delete by setting isActive to false
    disease.isActive = false;
    await disease.save();

    res.status(200).json({
      success: true,
      message: 'Disease deleted successfully'
    });
  } catch (error) {
    console.error('Delete disease error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete disease',
      error: error.message
    });
  }
});

// Get disease categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Disease.distinct('category', { isActive: true });

    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Get diseases by category
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const diseases = await Disease.find({ 
      category: req.params.category, 
      isActive: true 
    })
    .sort({ searchCount: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Disease.countDocuments({ 
      category: req.params.category, 
      isActive: true 
    });

    res.status(200).json({
      success: true,
      data: {
        diseases,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get diseases by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diseases by category',
      error: error.message
    });
  }
});

// Update doctor count for all diseases (admin utility)
router.put('/update-doctor-counts', auth, authorize('admin'), async (req, res) => {
  try {
    const diseases = await Disease.find({ isActive: true });
    
    for (const disease of diseases) {
      await disease.updateDoctorCount();
    }

    res.status(200).json({
      success: true,
      message: 'Doctor counts updated successfully'
    });
  } catch (error) {
    console.error('Update doctor counts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor counts',
      error: error.message
    });
  }
});

module.exports = router;
