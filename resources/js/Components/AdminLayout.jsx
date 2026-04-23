import { router, usePage } from '@inertiajs/react';

export default function AdminLayout({ children, title }) {
    const { url } = usePage();

    function logout() {
        router.post('/admin/logout');
    }

    const navItems = [
        { label: 'Reservations', href: '/admin/orders', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="19" x2="13" y2="19"/></svg> },
        { label: 'Flight Inventory', href: '/admin/flights', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.3-2.2.3-2.4 1.4l-.4 1.8L10 13l-4.7 4.7-2.8-.5c-.7-.1-1.4.3-1.6 1L.5 19.5c-.1.5.1 1 .5 1.3.3.3.8.4 1.3.3l1.3-.4c.7-.2 1.1-.9 1-1.6l-.5-2.8 4.7-4.7 3.1 7.5.9-.2c1.1-.3 1.7-1.4 1.4-2.5l-.2-1.2Z"/></svg> },
        { label: 'User Management', href: '/admin/users', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="3"/></svg> },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
            {/* Sidebar Toggle for Mobile */}
            <div className="md:hidden bg-navy p-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                    </div>
                    <span className="text-white font-black text-sm tracking-tight">AirDodo Admin</span>
                </div>
                <button 
                    onClick={() => document.getElementById('admin-sidebar').classList.toggle('-translate-x-full')}
                    className="p-2 text-slate-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </button>
            </div>

            {/* Sidebar */}
            <aside id="admin-sidebar" className="w-72 bg-navy text-white flex flex-col fixed md:sticky top-0 h-screen z-30 shadow-2xl transition-transform -translate-x-full md:translate-x-0">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-brand rounded-[1rem] flex items-center justify-center shadow-lg shadow-brand/20">
                             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                        </div>
                        <span className="text-xl font-black tracking-tight">AirDodo <span className="text-brand">Admin</span></span>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = url.startsWith(item.href);
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                                        ${isActive 
                                            ? 'bg-brand text-white shadow-xl shadow-brand/20' 
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </a>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-white/5">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 min-h-screen overflow-x-hidden">
                <div className="max-w-6xl mx-auto">
                    {title && (
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
                            <h1 className="text-2xl md:text-4xl font-black text-navy tracking-tight leading-none">{title}</h1>
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <div className="text-xs font-black text-navy uppercase tracking-widest leading-none mb-1">System Status</div>
                                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Operational
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
}
