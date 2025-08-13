"use client"
import { useState } from 'react'
import api from '../../components/api'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('seller1')
    const [email, setEmail] = useState('s1@mail.com')
    const [password, setPassword] = useState('123456')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const register = async () => {
        setLoading(true)
        setMessage('')
        try {
            const { data } = await api.post('/api/auth/register', { username, email, password, isSeller: true })
            localStorage.setItem('token', data.token)
            setMessage('Successfully registered and logged in!')
            setTimeout(() => window.location.href = '/', 1500)
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Registration failed')
        }
        setLoading(false)
    }

    const login = async () => {
        setLoading(true)
        setMessage('')
        try {
            const { data } = await api.post('/api/auth/login', { usernameOrEmail: username, password })
            localStorage.setItem('token', data.token)
            setMessage('Successfully logged in!')
            setTimeout(() => window.location.href = '/', 1500)
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Login failed')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">SellerHub</h1>
                    <p className="text-gray-600 mt-2">Your marketplace dashboard</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex mb-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-center rounded-lg font-medium transition-colors ${isLogin ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-center rounded-lg font-medium transition-colors ${!isLogin ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="space-y-4">
                        <input
                            className="input-field"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        {!isLogin && (
                            <input
                                className="input-field"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        )}
                        <input
                            className="input-field"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <button
                            className="btn-primary w-full py-3 text-lg"
                            onClick={isLogin ? login : register}
                            disabled={loading}
                        >
                            {loading ? '...' : isLogin ? 'Sign In' : 'Create Seller Account'}
                        </button>
                    </div>

                    {message && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${message.includes('Success')
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                            {message}
                        </div>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 