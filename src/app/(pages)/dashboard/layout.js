'use client'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen bg-white text-gray-900">
            <Sidebar />

            {/* All /dashboard/* pages will be rendered here */}
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
