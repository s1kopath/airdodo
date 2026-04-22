import { router } from '@inertiajs/react';

export default function AdminLayout({ children, title }) {
    function logout() {
        router.post('/admin/logout');
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-[#1a1a2e] text-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <span className="text-lg font-bold tracking-widest">✈ AirDodo Admin</span>
                        <nav className="flex gap-4 text-sm">
                            <a href="/admin/orders" className="text-indigo-200 hover:text-white transition">Orders</a>
                            <a href="/admin/flights" className="text-indigo-200 hover:text-white transition">Flights</a>
                        </nav>
                    </div>
                    <button
                        onClick={logout}
                        className="text-xs text-indigo-300 hover:text-white transition"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 py-6">
                {title && <h1 className="text-2xl font-bold text-[#1a1a2e] mb-5">{title}</h1>}
                {children}
            </main>
        </div>
    );
}
