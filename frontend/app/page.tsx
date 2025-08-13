"use client"
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../components/api'

export default function Page() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        activeProducts: 0,
        monthlyRevenue: 0,
        pendingOrders: 0,
        rating: 4.8
    })

    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true)
            try {
                // Load real data from APIs
                const [productsRes, ordersRes] = await Promise.all([
                    api.get('/api/products?limit=100'),
                    api.get('/api/orders?limit=100')
                ])

                const products = productsRes.data.items || []
                const orders = ordersRes.data.items || []

                // Calculate stats
                const activeProducts = products.filter((p: any) => p.status === 'active').length
                const pendingOrders = orders.filter((o: any) => o.status === 'pending').length

                // Calculate monthly revenue (last 30 days)
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                const recentOrders = orders.filter((o: any) =>
                    ['confirmed', 'shipped', 'delivered'].includes(o.status) &&
                    new Date(o.orderDate) >= thirtyDaysAgo
                )
                const monthlyRevenue = recentOrders.reduce((sum: number, o: any) => sum + o.totalPrice, 0)

                setStats({
                    activeProducts,
                    monthlyRevenue,
                    pendingOrders,
                    rating: 4.8 // Mock rating for now
                })
            } catch (err) {
                console.error('Failed to load dashboard:', err)
            }
            setLoading(false)
        }

        loadDashboard()
    }, [])

    if (loading) {
        return (
            <Layout>
                <LoadingSpinner size="lg" text="Loading dashboard..." />
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage your selling business efficiently</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <span className="text-2xl">📦</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Products</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <span className="text-2xl">💰</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <span className="text-2xl">📋</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Rating</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <a href="/products" className="btn-primary flex items-center justify-center space-x-2">
                                <span>📦</span>
                                <span>Add Product</span>
                            </a>
                            <a href="/reports" className="btn-secondary flex items-center justify-center space-x-2">
                                <span>📊</span>
                                <span>View Reports</span>
                            </a>
                            <a href="/coupons" className="btn-secondary flex items-center justify-center space-x-2">
                                <span>🎫</span>
                                <span>Create Coupon</span>
                            </a>
                            <a href="/orders" className="btn-secondary flex items-center justify-center space-x-2">
                                <span>📋</span>
                                <span>Manage Orders</span>
                            </a>
                            <a href="/policies" className="btn-secondary flex items-center justify-center space-x-2">
                                <span>⚙️</span>
                                <span>Business Policies</span>
                            </a>
                            <a href="/messages" className="btn-secondary flex items-center justify-center space-x-2">
                                <span>💬</span>
                                <span>Messages</span>
                            </a>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Dashboard loaded successfully</p>
                                    <p className="text-xs text-gray-500">Just now</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Stats updated</p>
                                    <p className="text-xs text-gray-500">1 minute ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Monitoring your business</p>
                                    <p className="text-xs text-gray-500">Ongoing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
} 