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

            <div className="max-w-xl mx-auto px-4 py-8">
                {/* Status hero */}
                {isApproved && (
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white text-center mb-6 shadow-xl shadow-emerald-200 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 0%, transparent 60%)' }} />
                        <div className="relative">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">✓</div>
                            <div className="text-2xl font-extrabold mb-1">Itinerary Ready!</div>
                            <div className="text-emerald-100 text-sm mb-4">Your payment has been verified. Download your PDF below.</div>
                            <a
                                href={`/orders/${order.reference}/download`}
                                className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all shadow-sm text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Itinerary PDF
                            </a>
                        </div>
                    </div>
                )}

                {isRejected && (
                    <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white text-center mb-6 shadow-xl shadow-red-200">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">✕</div>
                        <div className="text-xl font-extrabold mb-1">Payment Rejected</div>
                        {order.admin_note && (
                            <div className="bg-white/15 rounded-xl px-4 py-3 mt-3 text-sm text-red-100 text-left">
                                <span className="font-semibold block mb-1">Reason:</span>
                                {order.admin_note}
                            </div>
                        )}
                        <a href="/" className="inline-block mt-4 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
                            Try again
                        </a>
                    </div>
                )}

                {!isApproved && !isRejected && (
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white text-center mb-6 shadow-xl shadow-indigo-200">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-7 h-7 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        </div>
                        <div className="text-xl font-extrabold mb-1">
                            {order.status === 'pending' ? 'Awaiting Payment' : 'Verifying Payment…'}
                        </div>
                        <div className="text-indigo-200 text-sm">
                            {order.status === 'pending'
                                ? 'Complete your bKash payment to proceed.'
                                : 'Our team is reviewing your payment. Usually takes 1–2 hours.'}
                        </div>
                        {order.status === 'pending' && (
                            <a
                                href={`/orders/${order.reference}/payment`}
                                className="inline-block mt-4 bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-all"
                            >
                                Complete Payment →
                            </a>
                        )}
                    </div>
                )}

                {/* Order detail card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
                    <div className="px-5 py-3.5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking Details</h3>
                        <span className="font-mono text-indigo-600 text-sm font-bold">{order.reference}</span>
                    </div>
                    <div className="px-5 py-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">Route</div>
                            <div className="font-bold text-gray-800">
                                {order.flight?.origin?.iata_code}
                                <span className="text-indigo-400 mx-1.5">→</span>
                                {order.flight?.destination?.iata_code}
                            </div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Airline</span>
                            <span className="font-medium">{order.flight?.airline?.name} · {order.flight?.flight_number}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Travel Date</span>
                            <span className="font-medium">{fmt(order.travel_date)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Passengers</span>
                            <span className="font-medium">{order.passengers?.length}</span>
                        </div>
                        {order.payment && (
                            <>
                                <div className="border-t pt-3 flex justify-between text-sm">
                                    <span className="text-gray-500">TxnID</span>
                                    <span className="font-mono font-medium text-gray-800">{order.payment.txn_id}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Amount Paid</span>
                                    <span className="font-bold text-gray-900">৳ {order.payment.amount}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Progress timeline */}
                {!isRejected && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
                        <div className="px-5 py-3.5 border-b border-gray-50 bg-gray-50/50">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking Progress</h3>
                        </div>
                        <div className="px-5 pt-5 pb-1">
                            {TIMELINE.map((step, i) => {
                                const stepIdx = STATUS_ORDER.indexOf(step.key);
                                const reached = statusIdx >= stepIdx;
                                const current = statusIdx === stepIdx;
                                const isLast  = i === TIMELINE.length - 1;
                                return (
                                    <div key={step.key} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                                                ${current  ? 'border-indigo-500 bg-indigo-500 text-white shadow-md shadow-indigo-100' : ''}
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
                                                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                                                )}
                                            </div>
                                            {!isLast && <div className={`w-0.5 flex-1 mt-1 mb-1 ${reached ? 'bg-indigo-200' : 'bg-gray-100'}`} style={{ minHeight: 24 }} />}
                                        </div>
                                        <div className={`pb-5 ${isLast ? 'pb-5' : ''}`}>
                                            <div className={`text-sm font-semibold leading-tight ${current ? 'text-indigo-700' : reached ? 'text-gray-700' : 'text-gray-300'}`}>
                                                {step.label}
                                            </div>
                                            <div className={`text-xs mt-0.5 leading-relaxed ${current || reached ? 'text-gray-500' : 'text-gray-300'}`}>
                                                {step.desc}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="text-center">
                    <a href="/my-bookings" className="text-sm text-indigo-600 hover:underline font-medium">View all my bookings →</a>
                </div>
            </div>
        </Layout>
    );
}
