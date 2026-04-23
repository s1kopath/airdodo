import Layout from '../Components/Layout';
import StepBar from '../Components/StepBar';

const TIMELINE = [
    { key: 'pending',           label: 'Order Created',         desc: 'Your booking details have been saved.' },
    { key: 'payment_submitted', label: 'Payment Submitted',      desc: 'We\'ve received your payment details.' },
    { key: 'approved',          label: 'Payment Verified',       desc: 'Payment confirmed — your PDF is ready.' },
];

const STATUS_ORDER = ['pending', 'payment_submitted', 'approved'];

function TimelineStep({ step, reached, current }) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${current  ? 'border-indigo-500 bg-indigo-500 text-white shadow-md shadow-indigo-200' : ''}
                    ${reached && !current ? 'border-indigo-300 bg-indigo-50 text-indigo-500' : ''}
                    ${!reached ? 'border-gray-200 bg-white text-gray-300' : ''}
                `}>
                    {reached && !current ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : current ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    )}
                </div>
                <div className={`flex-1 w-0.5 mt-1 ${reached ? 'bg-indigo-200' : 'bg-gray-100'}`} style={{ minHeight: 28 }} />
            </div>
            <div className="pb-7">
                <div className={`text-sm font-semibold ${current ? 'text-indigo-700' : reached ? 'text-gray-700' : 'text-gray-300'}`}>
                    {step.label}
                </div>
                <div className={`text-xs mt-0.5 ${current || reached ? 'text-gray-500' : 'text-gray-300'}`}>
                    {step.desc}
                </div>
            </div>
        </div>
    );
}

export default function OrderStatus({ order }) {
    const statusIdx  = STATUS_ORDER.indexOf(order.status);
    const isApproved = order.status === 'approved';
    const isRejected = order.status === 'rejected';

    const fmt = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <Layout>
            <StepBar current={4} />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Status Column */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Status Hero Card */}
                        {isApproved ? (
                            <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
                                <div className="absolute right-[-10%] bottom-[-20%] opacity-10 transform -rotate-12 transition-transform group-hover:scale-110 duration-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                                </div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-white/20 rounded-[1.8rem] flex items-center justify-center mb-6 text-4xl shadow-inner backdrop-blur-md border border-white/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight mb-3">Itinerary Ready</h2>
                                    <p className="text-emerald-50 text-lg font-medium mb-8 leading-relaxed">Your reservation has been confirmed. You can now download your official itinerary for visa processing.</p>
                                    <a
                                        href={`/orders/${order.reference}/download`}
                                        className="inline-flex items-center gap-3 bg-white text-emerald-700 font-black px-10 py-5 rounded-2xl hover:bg-emerald-50 transition-all shadow-2xl active:scale-95 group/btn"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-y-1 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                        Download PDF Itinerary
                                    </a>
                                </div>
                            </div>
                        ) : isRejected ? (
                            <div className="bg-rose-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-rose-200">
                                <div className="w-20 h-20 bg-white/20 rounded-[1.8rem] flex items-center justify-center mb-6 text-4xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </div>
                                <h2 className="text-4xl font-black tracking-tight mb-3">Verification Failed</h2>
                                <div className="bg-white/10 rounded-2xl p-6 mb-8 border border-white/10">
                                    <p className="text-rose-100 font-bold uppercase tracking-widest text-[10px] mb-2">Admin Feedback</p>
                                    <p className="text-white text-lg font-bold">{order.admin_note || 'We could not verify your payment details. Please contact support.'}</p>
                                </div>
                                <a href="/" className="inline-flex items-center gap-2 text-white font-black text-sm uppercase tracking-widest hover:translate-x-2 transition-transform">
                                    Start New Search <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                                </a>
                            </div>
                        ) : (
                            <div className="bg-navy rounded-[2.5rem] p-10 text-white shadow-2xl shadow-navy/20">
                                <div className="w-20 h-20 bg-white/10 rounded-[1.8rem] flex items-center justify-center mb-6 border border-white/10">
                                    <svg className="w-10 h-10 text-brand animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                </div>
                                <h2 className="text-4xl font-black tracking-tight mb-3">
                                    Finalizing Reservation
                                </h2>
                                <p className="text-slate-400 text-lg font-medium mb-8 leading-relaxed">
                                    We are generating your official itinerary. This will only take a few seconds.
                                </p>
                            </div>
                        )}

                        {/* Order Progress Info */}
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-8 bg-brand rounded-full" />
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Status Update</h3>
                            </div>
                            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center shrink-0 shadow-lg shadow-navy/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                </div>
                                <div>
                                    <div className="text-navy font-black text-lg leading-tight mb-1">Reservation Received</div>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                        Your booking is now in our system. Our team is working on issuing your official travel document.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Booking Details */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden sticky top-32">
                            <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking #</div>
                                <div className="font-mono text-navy font-black text-lg uppercase tracking-wider">{order.reference}</div>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-black text-navy">{order.flight?.origin?.iata_code}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><path d="m9 18 6-6-6-6"/></svg>
                                            <span className="text-2xl font-black text-navy">{order.flight?.destination?.iata_code}</span>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Airline</div>
                                        <div className="font-black text-slate-900">{order.flight?.airline?.name}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-50">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departure</div>
                                        <div className="font-black text-slate-900">{fmt(order.travel_date)}</div>
                                        <div className="text-brand font-black text-xs">{order.flight?.departure_time}</div>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passengers</div>
                                        <div className="font-black text-slate-900">{order.passengers?.length} Person(s)</div>
                                        <div className="text-slate-400 font-bold text-[10px] uppercase">{order.flight?.cabin_class}</div>
                                    </div>
                                </div>

                                {order.payment?.txn_id && (
                                    <div className="bg-slate-50 rounded-2xl p-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</span>
                                            <span className="font-mono font-black text-navy">{order.payment.txn_id}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-8 pt-0">
                                <a href="/my-bookings" className="block w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest text-center rounded-2xl transition-colors">
                                    View All Bookings
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
