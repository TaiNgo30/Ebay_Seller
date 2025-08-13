"use client"
import { useState } from 'react'
import api from '../../components/api'
import Layout from '../../components/Layout'

export default function InventoryPage() {
    const [productId, setProductId] = useState('')
    const [quantity, setQuantity] = useState<number>(0)
    const [data, setData] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    const load = async () => {
        if (!productId) return
        setLoading(true)
        try {
            const { data } = await api.get(`/api/inventory/${productId}`)
            setData(data)
            setQuantity(data.quantity)
        } catch (err) {
            alert('Product not found or error loading inventory')
            setData(null)
        }
        setLoading(false)
    }

    const save = async () => {
        setSaving(true)
        try {
            await api.put(`/api/inventory/${productId}`, { quantity })
            await load()
            alert('Inventory updated successfully!')
        } catch (err) {
            alert('Failed to update inventory')
        }
        setSaving(false)
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-600 mt-1">Update stock quantities for your products</p>
                </div>

                <div className="card max-w-2xl">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
                            <div className="flex space-x-3">
                                <input
                                    className="input-field flex-1"
                                    placeholder="Enter product ID to manage inventory"
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
                                        'Load'
                                    )}
                                </button>
                            </div>
                        </div>

                        {data && (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-900">Current Inventory</h3>
                                    <p className="text-2xl font-bold text-blue-600">{data.quantity} units</p>
                                    <p className="text-sm text-gray-500">Last updated: {new Date(data.lastUpdated).toLocaleString()}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Quantity</label>
                                    <input
                                        className="input-field"
                                        type="number"
                                        min="0"
                                        value={quantity}
                                        onChange={e => setQuantity(Number(e.target.value))}
                                    />
                                </div>

                                <button
                                    className="btn-primary"
                                    onClick={save}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Updating...</span>
                                        </div>
                                    ) : (
                                        'Update Inventory'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Keep inventory counts accurate to avoid overselling</li>
                        <li>• Set up low stock alerts for popular items</li>
                        <li>• Update quantities immediately after receiving new stock</li>
                    </ul>
                </div>
            </div>
        </Layout>
    )
} 