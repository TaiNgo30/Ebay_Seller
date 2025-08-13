"use client"
import { useEffect, useState } from 'react'
import api from '../../components/api'
import Layout from '../../components/Layout'

type Store = { storeName: string; description?: string; bannerImageURL?: string }

export default function StorePage() {
    const [store, setStore] = useState<Store>({ storeName: '' })
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const loadStore = async () => {
            try {
                const { data } = await api.get('/api/seller/me')
                if (data.store) setStore({ storeName: data.store.storeName, description: data.store.description, bannerImageURL: data.store.bannerImageURL })
            } catch (err) {
                console.error('Failed to load store:', err)
            }
            setLoading(false)
        }
        loadStore()
    }, [])

    const save = async () => {
        setSaving(true)
        try {
            const fd = new FormData()
            fd.append('storeName', store.storeName)
            if (store.description) fd.append('description', store.description)
            if (file) fd.append('banner', file)
            await api.put('/api/seller/store', fd)
            alert('Store profile saved successfully!')
        } catch (err) {
            alert('Failed to save store profile')
        }
        setSaving(false)
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
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Store Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your store information and branding</p>
                </div>

                <div className="card max-w-2xl">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                            <input
                                className="input-field"
                                value={store.storeName}
                                onChange={e => setStore(prev => ({ ...prev, storeName: e.target.value }))}
                                placeholder="Enter your store name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                className="input-field"
                                value={store.description || ''}
                                onChange={e => setStore(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Tell customers about your store"
                                rows={4}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                            <input
                                type="file"
                                onChange={e => setFile(e.target.files?.[0] || null)}
                                className="input-field"
                                accept="image/*"
                            />
                            {store.bannerImageURL && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600 mb-2">Current banner:</p>
                                    <img src={store.bannerImageURL} className="max-h-40 rounded-lg border" alt="Store banner" />
                                </div>
                            )}
                        </div>

                        <button
                            className="btn-primary"
                            onClick={save}
                            disabled={saving || !store.storeName}
                        >
                            {saving ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                'Save Store Profile'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
} 