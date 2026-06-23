import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Calendar, User, Edit, Trash2, Filter, Search, MessageSquare } from 'lucide-react'
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
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' })

  useEffect(() => { fetchReviews() }, [filterRating, searchQuery])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = { rating: filterRating !== 'all' ? filterRating : undefined, search: searchQuery || undefined }
      const response = await reviewService.getUserReviews(params)
      setReviews(response.data.data.reviews)
    } catch (error) { toast.error('Failed to fetch reviews') }
    finally { setLoading(false) }
  }

  const handleEdit = (review) => {
    setEditingReview(review)
    setEditForm({ rating: review.rating, comment: review.comment })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (!editingReview) return
    try {
      await reviewService.updateReview(editingReview._id, editForm)
      setReviews(prev => prev.map(r => r._id === editingReview._id ? { ...r, ...editForm } : r))
      setShowEditModal(false); setEditingReview(null)
      toast.success('Review updated successfully!')
    } catch (error) { toast.error('Failed to update review') }
  }

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    try {
      await reviewService.deleteReview(reviewId)
      setReviews(prev => prev.filter(r => r._id !== reviewId))
      toast.success('Review deleted successfully!')
    } catch (error) { toast.error('Failed to delete review') }
  }

  const renderStars = (rating, interactive = false, onRatingChange) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => interactive && onRatingChange?.(star)} disabled={!interactive}
          className={`${interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} transition-transform`}>
          <Star className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  )

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0
  const ratingDistribution = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: reviews.filter(rv => rv.rating === r).length }))

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600">Manage your doctor reviews and feedback</p>
        </div>

        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Rating Overview</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-extrabold text-gray-900">{averageRating}</div>
                  <div className="flex items-center mt-1">{renderStars(Math.round(averageRating))}<span className="ml-2 text-sm text-gray-500">({reviews.length} reviews)</span></div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">{reviews.length}</div>
                  <div className="text-sm text-gray-500">Total Reviews</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Rating Distribution</h3>
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 w-6">{rating}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all" style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm text-gray-500 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by doctor name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="input">
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option><option value="4">4 Stars</option>
                <option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option>
              </select>
              <button className="btn-outline inline-flex items-center"><Filter className="w-4 h-4 mr-2" />Filters</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterRating !== 'all' ? 'Try adjusting your search or filters' : 'You haven\'t written any reviews yet'}
            </p>
            <Link to="/doctors" className="btn-primary">Find Doctors to Review</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-lg transition-all p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary-600">{review.doctorId?.userId?.name?.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900">Dr. {review.doctorId?.userId?.name}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {renderStars(review.rating)}
                          <span className="text-sm font-semibold text-gray-600">{review.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{review.doctorId?.specialization}</p>
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="w-3.5 h-3.5 mr-1" />{formatDate(review.createdAt)}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(review)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(review._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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

        {showEditModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
              <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Review</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                    {renderStars(editForm.rating, true, (rating) => setEditForm(prev => ({ ...prev, rating })))}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
                    <textarea value={editForm.comment} onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))} rows={4} className="input resize-none" placeholder="Share your experience..." />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowEditModal(false)} className="flex-1 btn-outline">Cancel</button>
                  <button onClick={handleUpdate} className="flex-1 btn-primary">Update Review</button>
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
