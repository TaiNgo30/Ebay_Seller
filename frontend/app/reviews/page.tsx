"use client"
import { useEffect, useState } from 'react'
import api from '../../components/api'
import Layout from '../../components/Layout'

export default function ReviewsPage() {
  const [productId, setProductId] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!productId) return
    setLoading(true)
    try {
      const { data } = await api.get(`/api/reviews${productId ? `?productId=${productId}` : ''}`)
      setItems(data.items)
    } catch (err) {
      console.error('Failed to load reviews:', err)
      setItems([])
    }
    setLoading(false)
  }

  useEffect(() => { if (productId) load() }, [productId])

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600 mt-1">View customer reviews for your products</p>
        </div>

        <div className="card max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
              <div className="flex space-x-3">
                <input
                  className="input-field flex-1"
                  placeholder="Enter product ID to view reviews"
                  value={productId}
                  onChange={e => setProductId(e.target.value)}
                />
                <button
                  className="btn-secondary"
                  onClick={load}
                  disabled={!productId || loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    'Load Reviews'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map(r => (
              <div key={r._id} className="card">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className={`text-lg ${star <= r.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {r.comment && (
                      <p className="text-gray-700">{r.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : productId && !loading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">This product hasn't received any reviews from customers</p>
          </div>
        ) : null}

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips for Better Reviews</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Provide accurate product descriptions and photos</li>
            <li>• Respond to customer questions quickly</li>
            <li>• Ship orders promptly and package them well</li>
            <li>• Follow up with customers after delivery</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
} 