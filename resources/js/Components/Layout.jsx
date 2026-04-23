import { usePage, router } from '@inertiajs/react';

export default function Layout({ children }) {
    const { auth } = usePage().props;

    function logout() {
        router.post('/logout');
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand selection:text-white">
            <header className="sticky top-0 z-30 bg-navy border-b border-white/5 shadow-xl shadow-black/20 backdrop-blur-md bg-opacity-95">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02] active:scale-95">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white shadow-lg shadow-brand/20 group-hover:shadow-brand/40 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.3-2.2.3-2.4 1.4l-.4 1.8L10 13l-4.7 4.7-2.8-.5c-.7-.1-1.4.3-1.6 1L.5 19.5c-.1.5.1 1 .5 1.3.3.3.8.4 1.3.3l1.3-.4c.7-.2 1.1-.9 1-1.6l-.5-2.8 4.7-4.7 3.1 7.5.9-.2c1.1-.3 1.7-1.4 1.4-2.5l-.2-1.2Z"/></svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-extrabold tracking-tight text-xl leading-none">AirDodo</span>
                            <span className="text-brand text-[11px] leading-tight font-semibold uppercase tracking-[0.1em]">Premium Itineraries</span>
                        </div>
                    </a>
                    <nav className="hidden md:flex items-center gap-2">
                        {auth.user ? (
                            <>
                                <a href="/my-bookings" className="text-slate-300 hover:text-white hover:bg-white/10 text-sm px-4 py-2 rounded-xl transition-all font-medium">
                                    My Bookings
                                </a>
                                <button onClick={logout} className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-colors">
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <a href="/login" className="text-slate-300 hover:text-white hover:bg-white/10 text-sm px-4 py-2 rounded-xl transition-all font-medium">
                                Sign In
                            </a>
                        )}
                        <a href="/" className="group relative overflow-hidden bg-brand hover:bg-brand-dark text-white text-sm px-5 py-2.5 rounded-xl transition-all font-bold shadow-lg shadow-brand/20">
                            <span className="relative z-10 flex items-center gap-2">
                                Book Flight
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                            </span>
                        </a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => document.getElementById('mobile-menu').classList.toggle('hidden')}
                        className="md:hidden p-2 text-slate-300 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>
                </div>

                {/* Mobile Dropdown */}
                <div id="mobile-menu" className="hidden md:hidden border-t border-white/5 bg-navy px-6 py-4 space-y-4 shadow-xl">
                    {auth.user ? (
                        <>
                            <a href="/my-bookings" className="block text-slate-300 hover:text-white font-bold py-2">My Bookings</a>
                            <button onClick={logout} className="block w-full text-left text-slate-400 font-black text-[10px] uppercase tracking-widest py-2">Sign Out</button>
                        </>
                    ) : (
                        <a href="/login" className="block text-slate-300 hover:text-white font-bold py-2">Sign In</a>
                    )}
                    <a href="/" className="block bg-brand text-white text-center py-4 rounded-xl font-bold">Book Flight</a>
                </div>
            </header>
            <main className="relative">{children}</main>
            <footer className="mt-20 border-t border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-10">
                        <div className="max-w-xs">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-white shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.3-2.2.3-2.4 1.4l-.4 1.8L10 13l-4.7 4.7-2.8-.5c-.7-.1-1.4.3-1.6 1L.5 19.5c-.1.5.1 1 .5 1.3.3.3.8.4 1.3.3l1.3-.4c.7-.2 1.1-.9 1-1.6l-.5-2.8 4.7-4.7 3.1 7.5.9-.2c1.1-.3 1.7-1.4 1.4-2.5l-.2-1.2Z"/></svg>
                                </div>
                                <span className="font-black text-slate-900 tracking-tight text-lg">AirDodo</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Providing premium flight itineraries for embassy and visa purposes worldwide. Fast, reliable, and compliant.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-16 gap-y-8">
                            <div className="flex flex-col gap-3">
                                <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider">Product</h4>
                                <a href="/" className="text-slate-500 hover:text-brand text-sm transition-colors font-medium">Search Flights</a>
                                <a href="/my-bookings" className="text-slate-500 hover:text-brand text-sm transition-colors font-medium">Track Order</a>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider">Company</h4>
                                <span className="text-slate-500 text-sm font-medium cursor-default">Privacy Policy</span>
                                <span className="text-slate-500 text-sm font-medium cursor-default">Terms of Service</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-slate-400 text-xs font-medium tracking-wide">
                            © {new Date().getFullYear()} AIRDODO LTD. ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Embassy Compliant Service</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

    );
}
