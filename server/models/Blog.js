const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  author: {
    name: {
      type: String,
      required: [true, 'Author name is required']
    },
    email: String,
    bio: String,
    avatar: String
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Health Tips', 'Disease Awareness', 'Preventive Care',
      'Mental Health', 'Nutrition', 'Fitness', 'Medical News',
      'Patient Stories', 'Doctor Insights', 'Technology', 'Research'
    ]
  },
  tags: [{
    type: String,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required']
  },
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  readingTime: {
    type: Number,
    default: 5
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  publishedAt: Date,
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    isApproved: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shareCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better search performance
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
blogSchema.index({ category: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ isFeatured: 1, publishedAt: -1 });
blogSchema.index({ viewCount: -1 });
blogSchema.index({ slug: 1 });

// Pre-save middleware to generate slug
blogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  next();
});

// Virtual for formatted published date
blogSchema.virtual('formattedPublishedDate').get(function() {
  return this.publishedAt ? this.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
});

// Static method to get published blogs
blogSchema.statics.getPublishedBlogs = function(limit = 10, skip = 0) {
  return this.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('comments.user', 'name profilePicture');
};

// Static method to get featured blogs
blogSchema.statics.getFeaturedBlogs = function(limit = 5) {
  return this.find({ status: 'published', isFeatured: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .select('title slug excerpt featuredImage category publishedAt viewCount readingTime');
};

// Static method to search blogs
blogSchema.statics.searchBlogs = function(query, limit = 20) {
  return this.find({
    status: 'published',
    $text: { $search: query }
  })
  .sort({ score: { $meta: 'textScore' }, publishedAt: -1 })
  .limit(limit)
  .populate('comments.user', 'name profilePicture');
};

// Method to increment view count
blogSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to toggle like
blogSchema.methods.toggleLike = function(userId) {
  const index = this.likedBy.indexOf(userId);
  if (index > -1) {
    this.likedBy.splice(index, 1);
    this.likeCount = Math.max(0, this.likeCount - 1);
  } else {
    this.likedBy.push(userId);
    this.likeCount += 1;
  }
  return this.save();
};

module.exports = mongoose.model('Blog', blogSchema);
