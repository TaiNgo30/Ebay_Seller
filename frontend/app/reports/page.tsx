"use client"
import { useEffect, useState } from 'react'
import api from '../../components/api'
import Layout from '../../components/Layout'

type Point = { _id: string; orders: number; revenue: number }

export default function ReportsPage() {
    const [range, setRange] = useState<'week' | 'month'>('week')
    const [data, setData] = useState<Point[]>([])
    const [loading, setLoading] = useState(true)

    const load = async (r: 'week' | 'month') => {
        setLoading(true)
        try {
            const { data } = await api.get(`/api/reports/sales?range=${r}`)
            setData(data.data)
        } catch (err) {
            console.error('Failed to load reports:', err)
            setData([])
        }
        setLoading(false)
    }

    useEffect(() => { load(range) }, [range])

    const totalOrders = data.reduce((sum, p) => sum + p.orders, 0)
    const totalRevenue = data.reduce((sum, p) => sum + p.revenue, 0)

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Sales Reports</h1>
                    <p className="text-gray-600 mt-1">Track your sales performance and revenue trends</p>
                </div>

                <div className="flex space-x-3">
                    <button
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${range === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        onClick={() => setRange('week')}
                    >
                        📅 Last 7 Days
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${range === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        onClick={() => setRange('month')}
                    >
                        🗓️ Last 30 Days
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <span className="text-2xl">📋</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <span className="text-2xl">💰</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : data.length > 0 ? (
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Breakdown</h3>
                        <div className="overflow-x-auto">
                            <table className="table-modern">
                                <thead className="table-header">
                                    <tr>
                                        <th className="table-cell font-medium text-gray-900">Date</th>
                                        <th className="table-cell font-medium text-gray-900">Orders</th>
                                        <th className="table-cell font-medium text-gray-900">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(p => (
                                        <tr key={p._id} className="hover:bg-gray-50">
                                            <td className="table-cell">{new Date(p._id).toLocaleDateString()}</td>
                                            <td className="table-cell">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {p.orders}
                                                </span>
                                            </td>
                                            <td className="table-cell font-medium text-green-600">${p.revenue.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No sales data</h3>
                        <p className="text-gray-600">No confirmed orders found for the selected period</p>
                    </div>
                )}

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Performance Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Track your sales trends to identify peak selling periods</li>
                        <li>• Use this data to plan inventory and marketing campaigns</li>
                        <li>• Compare weekly vs monthly performance to spot growth opportunities</li>
                        <li>• Consider seasonal trends when analyzing your data</li>
                    </ul>
                </div>
            </div>
        </Layout>
    )
} 