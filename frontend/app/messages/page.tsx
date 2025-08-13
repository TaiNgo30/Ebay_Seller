"use client"
import { useState } from 'react'
import api from '../../components/api'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function MessagesPage() {
    const [threadId, setThreadId] = useState('')
    const [receiverId, setReceiverId] = useState('')
    const [content, setContent] = useState('')
    const [items, setItems] = useState<any[] | null>(null)
    const [loading, setLoading] = useState(false)

    const load = async () => {
        setLoading(true)
        try {
            const { data } = await api.get(`/api/messages?threadId=${threadId}`)
            setItems(data)
        } catch { setItems([]) }
        setLoading(false)
    }

    const send = async () => {
        await api.post('/api/messages', { threadId, receiverId, content })
        setContent('')
        await load()
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                    <p className="text-gray-600 mt-1">Communicate with buyers about products and orders</p>
                </div>

                <div className="card max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input className="input-field" placeholder="Thread ID" value={threadId} onChange={e => setThreadId(e.target.value)} />
                        <input className="input-field" placeholder="Receiver User ID" value={receiverId} onChange={e => setReceiverId(e.target.value)} />
                        <button className="btn-secondary" onClick={load} disabled={!threadId || loading}>Load Thread</button>
                        {loading && <LoadingSpinner size="sm" />}
                    </div>
                    {items && (
                        <div className="mt-4 space-y-3 max-h-96 overflow-auto bg-gray-50 p-3 rounded-lg">
                            {items.map(m => (
                                <div key={m._id} className="flex items-start space-x-2">
                                    <div className={`px-3 py-2 rounded-lg ${m.senderId === 'me' ? 'bg-blue-100' : 'bg-white border'}`}>
                                        <div className="text-sm text-gray-600">{new Date(m.timestamp).toLocaleString()}</div>
                                        <div className="text-gray-900">{m.content}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3">
                        <textarea className="input-field md:col-span-4" rows={2} placeholder="Write a message" value={content} onChange={e => setContent(e.target.value)} />
                        <button className="btn-primary" onClick={send} disabled={!content.trim() || !threadId || !receiverId}>Send</button>
                    </div>
                </div>
            </div>
        </Layout>
    )
} 