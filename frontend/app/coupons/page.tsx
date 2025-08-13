"use client"
import { useEffect, useState } from 'react'
import api from '../../components/api'
import Layout from '../../components/Layout'

export default function CouponsPage() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [code, setCode] = useState('')
    const [discountPercent, setDiscountPercent] = useState<number>(10)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [productId, setProductId] = useState('')

    const load = async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/api/coupons')
            setItems(data.items)
        } catch (err) {
            console.error('Failed to load coupons:', err)
        }
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const create = async () => {
        setCreating(true)
        try {
            await api.post('/api/coupons', { code, discountPercent, startDate, endDate, productId })
            setCode(''); setDiscountPercent(10); setStartDate(''); setEndDate(''); setProductId('')
            setShowForm(false)
            await load()
            alert('Coupon created successfully!')
        } catch (err) {
            alert('Failed to create coupon')
        }
        setCreating(false)
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
                        <p className="text-gray-600 mt-1">Create and manage discount coupons for your products</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <span>🎫</span>
                        <span>Create Coupon</span>
                    </button>
                </div>

                {showForm && (
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Coupon</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                                <input className="input-field" placeholder="e.g. SAVE20" value={code} onChange={e => setCode(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Discount %</label>
                                <input className="input-field" placeholder="10" type="number" min="1" max="100" value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value))} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input className="input-field" type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <input className="input-field" type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
                            <input className="input-field" placeholder="Product ID this coupon applies to" value={productId} onChange={e => setProductId(e.target.value)} />
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                className="btn-primary"
                                onClick={create}
                                disabled={creating || !code || !productId}
                            >
                                {creating ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Creating...</span>
                                    </div>
                                ) : (
                                    'Create Coupon'
                                )}
                            </button>
                            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                {items.length > 0 ? (
                    <div className="grid gap-4">
                        {items.map(c => (
                            <div key={c._id} className="card">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-yellow-100 p-3 rounded-lg">
                                            <span className="text-2xl">🎫</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{c.code}</h3>
                                            <p className="text-sm text-gray-500">Product: {c.productId}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">{c.discountPercent}% OFF</p>
                                        <p className="text-sm text-gray-500">Used: {c.usedCount || 0} times</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎫</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
                        <p className="text-gray-600 mb-4">Create discount coupons to boost sales</p>
                        <button onClick={() => setShowForm(true)} className="btn-primary">Create Your First Coupon</button>
                    </div>
                )}
            </div>
        </Layout>
    )
} 