import Link from 'next/link'
import { ReactNode } from 'react'

const navItems = [
    { href: '/store', label: 'Store Profile', icon: '🏪' },
    { href: '/products', label: 'Products', icon: '📦' },
    { href: '/inventory', label: 'Inventory', icon: '📊' },
    { href: '/coupons', label: 'Coupons', icon: '🎫' },
    { href: '/orders', label: 'Orders', icon: '📋' },
    { href: '/reviews', label: 'Reviews', icon: '⭐' },
    { href: '/feedback', label: 'Feedback', icon: '💬' },
    { href: '/reports', label: 'Reports', icon: '📈' },
]

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="text-2xl font-bold text-blue-600">
                                SellerHub
                            </Link>
                            <span className="text-sm text-gray-500">Your marketplace dashboard</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Welcome back, Seller!</span>
                            <Link href="/auth" className="btn-secondary text-sm">
                                Account
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <nav className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
                    <div className="p-6">
                        <div className="space-y-2">
                            {navItems.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Main content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
} 