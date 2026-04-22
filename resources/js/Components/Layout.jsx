export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="sticky top-0 z-30 bg-[#0f172a] border-b border-white/5 shadow-lg shadow-black/20">
                <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-indigo-400 transition-colors">✈</div>
                        <div>
                            <span className="text-white font-bold tracking-wide text-base leading-none">AirDodo</span>
                            <span className="block text-indigo-400 text-[10px] leading-tight font-medium">Flight Itinerary</span>
                        </div>
                    </a>
                    <nav className="flex items-center gap-1">
                        <a href="/my-bookings" className="text-slate-400 hover:text-white hover:bg-white/10 text-sm px-3 py-1.5 rounded-lg transition-all font-medium">
                            My Bookings
                        </a>
                        <a href="/" className="text-white bg-indigo-600 hover:bg-indigo-500 text-sm px-4 py-1.5 rounded-lg transition-all font-semibold ml-1">
                            Book Now
                        </a>
                    </nav>
                </div>
            </header>
            <main>{children}</main>
            <footer className="mt-16 border-t border-gray-200 bg-white">
                <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs">✈</div>
                        <span className="font-bold text-gray-800">AirDodo</span>
                        <span className="text-gray-400 text-sm">— Flight Itinerary for Visa Applications</span>
                    </div>
                    <div className="flex gap-5 text-xs text-gray-400">
                        <a href="/my-bookings" className="hover:text-indigo-600 transition-colors">My Bookings</a>
                        <span>© {new Date().getFullYear()} AirDodo</span>
                        <span>For visa purpose only</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
