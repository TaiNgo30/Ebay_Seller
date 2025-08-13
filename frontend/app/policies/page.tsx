"use client"
import { useEffect, useState } from 'react'
import api from '../../components/api'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'

type Policy = { _id: string; type: 'payment' | 'shipping' | 'return'; name: string; data: any; active: boolean }

export default function PoliciesPage() {
    const [items, setItems] = useState<Policy[]>([])
    const [loading, setLoading] = useState(true)
    const [type, setType] = useState<'payment' | 'shipping' | 'return'>('shipping')
    const [name, setName] = useState('')
    const [data, setData] = useState('{}')

    const load = async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/api/policies')
            setItems(data)
        } finally { setLoading(false) }
    }
    useEffect(() => { load() }, [])

    const create = async () => {
        try {
            const payload = { type, name, data: JSON.parse(data) }
            await api.post('/api/policies', payload)
            setName(''); setData('{}')
            await load()
        } catch {
            alert('Invalid JSON or request failed')
        }
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Business Policies</h1>
                    <p className="text-gray-600 mt-1">Reusable settings for shipping, payment, and returns</p>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Policy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select className="input-field" value={type} onChange={e => setType(e.target.value as any)}>
                            <option value="shipping">Shipping</option>
                            <option value="payment">Payment</option>
                            <option value="return">Return</option>
                        </select>
                        <input className="input-field" placeholder="Policy name" value={name} onChange={e => setName(e.target.value)} />
                        <textarea className="input-field md:col-span-3" rows={4} placeholder='Policy JSON e.g. {"handlingTime":"2 days"}' value={data} onChange={e => setData(e.target.value)} />
                    </div>
                    <button className="btn-primary mt-4" onClick={create} disabled={!name}>Create Policy</button>
                </div>

                {loading ? <LoadingSpinner size="lg" text="Loading policies..." /> : (
                    <div className="grid gap-4">
                        {items.map(p => (
                            <div key={p._id} className="card">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{p.type.toUpperCase()}</p>
                                        <h3 className="font-semibold text-gray-900">{p.name}</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{p.active ? 'Active' : 'Inactive'}</span>
                                </div>
                                <pre className="bg-gray-50 p-3 rounded-lg mt-3 text-sm overflow-x-auto">{JSON.stringify(p.data, null, 2)}</pre>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
} 