'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    FiHome,
    FiMessageCircle,
    FiShoppingCart,
    FiBox,
    FiBarChart2,
    FiSettings,
    FiLogOut
} from 'react-icons/fi'
import { useSelector } from 'react-redux'

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/dashboard/all-products', label: 'Products', icon: FiBox },
    { href: '/dashboard/chat', label: 'Chat', icon: FiMessageCircle },
    { href: '/dashboard/orders', label: 'Orders', icon: FiShoppingCart },
    { href: '/dashboard/stats', label: 'Statistic', icon: FiBarChart2 },
    { href: '/dashboard/settings', label: 'Settings', icon: FiSettings },
    { href: '/logout', label: 'Logout', icon: FiLogOut }
]

export default function Sidebar() {
    const pathname = usePathname()
    const { user } = useSelector(state => state.auth)

    return (
        <aside className="w-1/6 bg-white p-6 border-r border-gray-200 flex flex-col justify-between">
            <div>
                <Link href="/" className="flex items-center mb-10">
                    <img
                        src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp"
                        alt="Upfrica Logo"
                        className="h-12"
                    />
                </Link>
                <nav className="space-y-4">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center px-4 py-2 rounded
                  ${active
                                        ? 'bg-purple-200 text-purple-700'
                                        : 'hover:bg-gray-100 text-gray-700'}`}
                            >
                                <Icon className="mr-2" /> {label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
                <p className="text-sm mb-3 text-gray-700">
                    Hi {user?.username}, upgrade your account for more features!
                </p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded">
                    Learn more
                </button>
            </div>
        </aside>
    )
}
