"use client"
import { useState } from 'react'
import api from '../../components/api'
import Layout from '../../components/Layout'

export default function FeedbackPage() {
    const [message, setMessage] = useState('')
    const [type, setType] = useState<'general' | 'issue' | 'feature'>('general')
    const [resp, setResp] = useState<any | null>(null)
    const [sending, setSending] = useState(false)

    const send = async () => {
        setSending(true)
        try {
            const { data } = await api.post('/api/feedback', { message, type })
            setResp(data)
            setMessage('')
            setTimeout(() => setResp(null), 5000)
        } catch (err) {
            alert('Failed to send feedback')
        }
        setSending(false)
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
                    <p className="text-gray-600 mt-1">Send feedback, report issues, or suggest new features</p>
                </div>

                <div className="card max-w-2xl">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
                            <select
                                className="input-field"
                                value={type}
                                onChange={e => setType(e.target.value as any)}
                            >
                                <option value="general">💬 General Feedback</option>
                                <option value="issue">🐛 Report Issue</option>
                                <option value="feature">💡 Feature Request</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea
                                className="input-field"
                                placeholder="Tell us what's on your mind..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={6}
                            />
                        </div>

                        <button
                            className="btn-primary"
                            onClick={send}
                            disabled={sending || !message.trim()}
                        >
                            {sending ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Sending...</span>
                                </div>
                            ) : (
                                'Send Feedback'
                            )}
                        </button>
                    </div>
                </div>

                {resp && (
                    <div className="card bg-green-50 border-green-200">
                        <div className="flex items-center space-x-3">
                            <div className="text-2xl">✅</div>
                            <div>
                                <h3 className="font-medium text-green-900">Feedback Sent Successfully!</h3>
                                <p className="text-sm text-green-700">Thank you for your feedback. We'll review it and get back to you if needed.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card text-center">
                        <div className="text-3xl mb-3">💬</div>
                        <h3 className="font-medium text-gray-900 mb-2">General Feedback</h3>
                        <p className="text-sm text-gray-600">Share your thoughts about the platform</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl mb-3">🐛</div>
                        <h3 className="font-medium text-gray-900 mb-2">Report Issues</h3>
                        <p className="text-sm text-gray-600">Let us know about bugs or problems</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl mb-3">💡</div>
                        <h3 className="font-medium text-gray-900 mb-2">Feature Requests</h3>
                        <p className="text-sm text-gray-600">Suggest new features or improvements</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
} 