import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Star,
  Calendar,
  User,
  Edit,
  Trash2,
  Filter,
  Search,
  MessageSquare
} from 'lucide-react'
import { reviewService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const Reviews = () => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingReview, setEditingReview] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    fetchReviews()
  }, [filterRating, searchQuery])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = {
        rating: filterRating !== 'all' ? filterRating : undefined,
        search: searchQuery || undefined
      }
      
      const response = await reviewService.getUserReviews(params)
      setReviews(response.data.data.reviews)
    } catch (error) {
      toast.error('Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (review) => {
    setEditingReview(review)
    setEditForm({
      rating: review.rating,
      comment: review.comment
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (!editingReview) return

    try {
      await reviewService.updateReview(editingReview._id, editForm)
      
      setReviews(prev => prev.map(review => 
        review._id === editingReview._id 
          ? { ...review, ...editForm }
          : review
      ))
      
      setShowEditModal(false)
      setEditingReview(null)
      toast.success('Review updated successfully!')
    } catch (error) {
      toast.error('Failed to update review')
    }
  }

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      await reviewService.deleteReview(reviewId)
      setReviews(prev => prev.filter(review => review._id !== reviewId))
      toast.success('Review deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  const renderStars = (rating, interactive = false, onRatingChange) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            disabled={!interactive}
            className={`text-2xl transition-colors ${
              interactive ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length
  }))

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600">
            Manage your doctor reviews and feedback
          </p>
        </div>

        {/* Stats Overview */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Overview</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {averageRating}
                  </div>
                  <div className="flex items-center mt-1">
                    {renderStars(Math.round(averageRating))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({reviews.length} reviews)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {reviews.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center">
                    <span className="text-sm text-gray-600 w-8">{rating}</span>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ 
                            width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="input"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <button className="btn-outline flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterRating !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t written any reviews yet'
              }
            </p>
            <Link to="/doctors" className="btn-primary">
              Find Doctors to Review
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {review.doctorId?.userId?.profilePicture ? (
                        <img
                          src={review.doctorId.userId.profilePicture}
                          alt={review.doctorId.userId.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-medium text-gray-600">
                          {review.doctorId?.userId?.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Dr. {review.doctorId?.userId?.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {review.doctorId?.specialization}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600 ml-2">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">
                        {review.comment}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(review.createdAt)}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(review)}
                            className="text-primary-600 hover:text-primary-700"
                            title="Edit Review"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="text-error-600 hover:text-error-700"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowEditModal(false)} />
              
              <div className="relative bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Edit Review
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    {renderStars(editForm.rating, true, (rating) => 
                      setEditForm(prev => ({ ...prev, rating }))
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={editForm.comment}
                      onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                      className="input resize-none"
                      placeholder="Share your experience..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="flex-1 btn-primary"
                  >
                    Update Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reviews
