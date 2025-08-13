"use client"
import { useEffect, useState } from 'react'
import api from '../../components/api'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'

type Order = { _id: string; status: string; totalPrice: number; orderDate: string; buyerId?: string }

export default function OrdersPage() {
    const [items, setItems] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [label, setLabel] = useState<any | null>(null)

    const load = async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/api/orders?limit=50')
            setItems(data.items)
        } catch (err) {
            console.error('Failed to load orders:', err)
        }
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const confirm = async (id: string) => {
        try {
            await api.post(`/api/orders/${id}/confirm`)
            await load()
        } catch (err) {
            alert('Failed to confirm order')
        }
    }

    const setStatus = async (id: string, status: string) => {
        try {
            await api.put(`/api/orders/${id}/status`, { status })
            await load()
        } catch (err) {
            alert('Failed to update order status')
        }
    }

    const genLabel = async (id: string) => {
        try {
            const { data } = await api.get(`/api/orders/${id}/shipping-label`)
            setLabel(data)
        } catch (err) {
            alert('Failed to generate shipping label')
        }
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600 mt-1">Manage your customer orders and shipments</p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <LoadingSpinner size="lg" text="Loading orders..." />
                ) : (
                    <>
                        {/* Orders Grid */}
                        <div className="grid gap-6">
                            {items.map(order => (
                                <div key={order._id} className="card">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                                                <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-600">${order.totalPrice}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {order.status === 'pending' && (
                                            <button className="btn-primary text-sm" onClick={() => confirm(order._id)}>
                                                ✅ Confirm Order
                                            </button>
                                        )}
                                        {['confirmed', 'pending'].includes(order.status) && (
                                            <button className="btn-secondary text-sm" onClick={() => setStatus(order._id, 'shipped')}>
                                                🚚 Mark as Shipped
                                            </button>
                                        )}
                                        {order.status === 'shipped' && (
                                            <button className="btn-secondary text-sm" onClick={() => setStatus(order._id, 'delivered')}>
                                                📦 Mark as Delivered
                                            </button>
                                        )}
                                        <button className="btn-secondary text-sm" onClick={() => genLabel(order._id)}>
                                            🏷️ Generate Label
                                        </button>
                                        {order.status !== 'delivered' && (
                                            <button className="bg-red-100 hover:bg-red-200 text-red-700 text-sm px-3 py-2 rounded-lg" onClick={() => setStatus(order._id, 'failed')}>
                                                ❌ Mark as Failed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {items.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📋</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                                <p className="text-gray-600">Orders will appear here when customers make purchases</p>
                            </div>
                        )}
                    </>
                )}

                {/* Shipping Label Modal */}
                {label && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Shipping Label</h3>
                                <button onClick={() => setLabel(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                            </div>
                            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">{JSON.stringify(label, null, 2)}</pre>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
} 