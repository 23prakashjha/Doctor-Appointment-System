const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all published blogs
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = { status: 'published' };
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort options
    const sortOptions = {};
    if (search) {
      sortOptions.score = { $meta: 'textScore' };
    }
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const blogs = await Blog.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('comments.user', 'name profilePicture');

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
});

// Get featured blogs
router.get('/featured', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const blogs = await Blog.getFeaturedBlogs(parseInt(limit));

    res.status(200).json({
      success: true,
      data: { blogs }
    });
  } catch (error) {
    console.error('Get featured blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured blogs',
      error: error.message
    });
  }
});

// Search blogs
router.get('/search', async (req, res) => {
  try {
    const { q: query, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const blogs = await Blog.searchBlogs(query, parseInt(limit));

    res.status(200).json({
      success: true,
      data: { blogs }
    });
  } catch (error) {
    console.error('Search blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search blogs',
      error: error.message
    });
  }
});

// Get blog by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' })
      .populate('comments.user', 'name profilePicture');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment view count
    blog.incrementViewCount();

    res.status(200).json({
      success: true,
      data: { blog }
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
});

// Get blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('comments.user', 'name profilePicture');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment view count for published blogs
    if (blog.status === 'published') {
      blog.incrementViewCount();
    }

    res.status(200).json({
      success: true,
      data: { blog }
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
});

// Create blog (admin only)
router.post('/', auth, authorize('admin'), [
  body('title').trim().notEmpty().withMessage('Blog title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('content').notEmpty().withMessage('Blog content is required'),
  body('category').isIn([
    'Health Tips', 'Disease Awareness', 'Preventive Care',
    'Mental Health', 'Nutrition', 'Fitness', 'Medical News',
    'Patient Stories', 'Doctor Insights', 'Technology', 'Research'
  ]).withMessage('Valid category is required'),
  body('excerpt').optional().isLength({ max: 300 }).withMessage('Excerpt cannot exceed 300 characters'),
  body('featuredImage').notEmpty().withMessage('Featured image is required'),
  body('author.name').notEmpty().withMessage('Author name is required'),
  body('readingTime').optional().isInt({ min: 1 }).withMessage('Reading time must be at least 1 minute')
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

    const {
      title, content, category, excerpt, featuredImage, author,
      tags, images, readingTime, isFeatured, seo
    } = req.body;

    const blog = new Blog({
      title,
      content,
      category,
      excerpt,
      featuredImage,
      author,
      tags,
      images,
      readingTime,
      isFeatured,
      seo,
      status: 'draft' // Default to draft
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: { blog }
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog',
      error: error.message
    });
  }
});

// Update blog (admin only)
router.put('/:id', auth, authorize('admin'), [
  body('title').optional().trim().notEmpty().withMessage('Blog title cannot be empty').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('content').optional().notEmpty().withMessage('Blog content cannot be empty'),
  body('category').optional().isIn([
    'Health Tips', 'Disease Awareness', 'Preventive Care',
    'Mental Health', 'Nutrition', 'Fitness', 'Medical News',
    'Patient Stories', 'Doctor Insights', 'Technology', 'Research'
  ]).withMessage('Valid category is required'),
  body('excerpt').optional().isLength({ max: 300 }).withMessage('Excerpt cannot exceed 300 characters'),
  body('readingTime').optional().isInt({ min: 1 }).withMessage('Reading time must be at least 1 minute')
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

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const allowedUpdates = [
      'title', 'content', 'category', 'excerpt', 'featuredImage',
      'author', 'tags', 'images', 'readingTime', 'isFeatured',
      'seo', 'status'
    ];

    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('comments.user', 'name profilePicture');

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: { blog: updatedBlog }
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog',
      error: error.message
    });
  }
});

// Delete blog (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog',
      error: error.message
    });
  }
});

// Add comment to blog
router.post('/:id/comments', auth, [
  body('content').notEmpty().withMessage('Comment content is required').isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
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

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    if (blog.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot comment on unpublished blog'
      });
    }

    const { content } = req.body;
    blog.comments.push({
      user: req.user.userId,
      content
    });

    await blog.save();

    const updatedBlog = await Blog.findById(blog._id)
      .populate('comments.user', 'name profilePicture');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { 
        comment: updatedBlog.comments[updatedBlog.comments.length - 1]
      }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
});

// Toggle like on blog
router.put('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    if (blog.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot like unpublished blog'
      });
    }

    await blog.toggleLike(req.user.userId);

    res.status(200).json({
      success: true,
      message: 'Like status updated',
      data: { 
        likeCount: blog.likeCount,
        isLiked: blog.likedBy.includes(req.user.userId)
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update like status',
      error: error.message
    });
  }
});

// Get blog categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });

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

// Get blogs by category
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const blogs = await Blog.find({ 
      category: req.params.category, 
      status: 'published' 
    })
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('comments.user', 'name profilePicture');

    const total = await Blog.countDocuments({ 
      category: req.params.category, 
      status: 'published' 
    });

    res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get blogs by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs by category',
      error: error.message
    });
  }
});

// Get admin blogs (all statuses)
router.get('/admin/all', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('comments.user', 'name profilePicture');

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin blogs',
      error: error.message
    });
  }
});

module.exports = router;
