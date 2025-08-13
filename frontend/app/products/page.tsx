"use client"
import { useEffect, useState } from 'react'
import api from '../../components/api'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'

type Product = { _id: string; title: string; price: number; status: string; images?: string[] }

export default function ProductsPage() {
    const [items, setItems] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(0)
    const [attributes, setAttributes] = useState('{}')
    const [files, setFiles] = useState<FileList | null>(null)

    const load = async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/api/products?limit=50')
            setItems(data.items)
        } catch (err) {
            console.error('Failed to load products:', err)
        }
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const create = async () => {
        setCreating(true)
        try {
            const fd = new FormData()
            fd.append('title', title)
            fd.append('price', String(price))
            fd.append('quantity', String(quantity))
            fd.append('attributes', attributes)
            if (files) Array.from(files).forEach(f => fd.append('images', f))
            await api.post('/api/products', fd)
            setTitle(''); setPrice(0); setQuantity(0); setAttributes('{}'); setFiles(null)
            setShowForm(false)
            await load()
        } catch (err) {
            alert('Failed to create product')
        }
        setCreating(false)
    }

    const hide = async (id: string) => {
        try {
            await api.put(`/api/products/${id}/hide`)
            await load()
        } catch (err) {
            alert('Failed to hide product')
        }
    }

    const unhide = async (id: string) => {
        try {
            await api.put(`/api/products/${id}/unhide`)
            await load()
        } catch (err) {
            alert('Failed to unhide product')
        }
    }

    const remove = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/api/products/${id}`)
                await load()
            } catch (err) {
                alert('Failed to delete product')
            }
        }
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-600 mt-1">Manage your product listings</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <span>➕</span>
                        <span>Add Product</span>
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Product</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="input-field" placeholder="Product title" value={title} onChange={e => setTitle(e.target.value)} />
                            <input className="input-field" placeholder="Price ($)" value={price} type="number" onChange={e => setPrice(Number(e.target.value))} />
                            <input className="input-field" placeholder="Initial quantity" value={quantity} type="number" onChange={e => setQuantity(Number(e.target.value))} />
                            <input type="file" multiple onChange={e => setFiles(e.target.files)} className="input-field" />
                        </div>
                        <textarea className="input-field mt-4" placeholder="Attributes (JSON format)" value={attributes} onChange={e => setAttributes(e.target.value)} rows={3} />
                        <div className="flex space-x-3 mt-4">
                            <button className="btn-primary" onClick={create} disabled={creating}>
                                {creating ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Creating...</span>
                                    </div>
                                ) : (
                                    'Create Product'
                                )}
                            </button>
                            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <LoadingSpinner size="lg" text="Loading products..." />
                ) : (
                    <>
                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map(p => (
                                <div key={p._id} className="card hover:shadow-lg transition-shadow">
                                    {p.images && p.images[0] && (
                                        <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                                    )}
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 truncate">{p.title}</h3>
                                            <p className="text-2xl font-bold text-blue-600">${p.price}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    p.status === 'hidden' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            {p.status === 'hidden' ? (
                                                <button className="btn-secondary text-sm flex-1" onClick={() => unhide(p._id)}>Show</button>
                                            ) : (
                                                <button className="btn-secondary text-sm flex-1" onClick={() => hide(p._id)}>Hide</button>
                                            )}
                                            <button className="bg-red-100 hover:bg-red-200 text-red-700 text-sm px-3 py-2 rounded-lg flex-1" onClick={() => remove(p._id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {items.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                                <p className="text-gray-600 mb-4">Start by adding your first product to begin selling</p>
                                <button onClick={() => setShowForm(true)} className="btn-primary">Add Your First Product</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    )
} 