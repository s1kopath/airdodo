import Layout from '../../Components/Layout';

const STATUS_COLORS = {
    pending:           'bg-gray-100 text-gray-600',
    payment_submitted: 'bg-yellow-100 text-yellow-700',
    approved:          'bg-green-100 text-green-700',
    rejected:          'bg-red-100 text-red-700',
    cancelled:         'bg-gray-100 text-gray-400',
};

const STATUS_LABELS = {
    pending:           'Pending Payment',
    payment_submitted: 'Payment Submitted — Awaiting Verification',
    approved:          'Approved',
    rejected:          'Rejected',
    cancelled:         'Cancelled',
};

export default function BookingShow({ order, flash }) {
    const fmt = d => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <div>
                        <a href="/my-bookings" className="text-sm text-gray-400 hover:text-gray-600">← My Bookings</a>
                        <h1 className="text-2xl font-bold text-[#1a1a2e] mt-1">Booking {order.reference}</h1>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                    </span>
                </div>

                {flash?.success && <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-green-50 text-green-700 border border-green-200">{flash.success}</div>}
                {flash?.error && <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-700 border border-red-200">{flash.error}</div>}

                {/* Action buttons */}
                <div className="flex gap-3 mb-5 flex-wrap">
                    {['pending', 'payment_submitted'].includes(order.status) && (
                        <a href={`/my-bookings/${order.reference}/edit`}
                            className="text-sm border hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-lg">
                            Edit Booking
                        </a>
                    )}
                    {order.status === 'pending' && (
                        <a href={`/orders/${order.reference}/payment`}
                            className="text-sm bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium">
                            Complete Payment
                        </a>
                    )}
                    {order.status === 'approved' && (
                        <a href={`/my-bookings/${order.reference}/download`}
                            className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium">
                            Download PDF Itinerary
                        </a>
                    )}
                </div>

                {order.status === 'rejected' && order.admin_note && (
                    <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-700 border border-red-200">
                        <strong>Rejection reason:</strong> {order.admin_note}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Flight */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">Flight Details</h2>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div><dt className="text-gray-400 text-xs">Airline</dt><dd className="font-medium">{order.flight?.airline?.name}</dd></div>
                            <div><dt className="text-gray-400 text-xs">Flight</dt><dd className="font-mono font-medium">{order.flight?.flight_number}</dd></div>
                            <div><dt className="text-gray-400 text-xs">Route</dt><dd>{order.flight?.origin?.iata_code} → {order.flight?.destination?.iata_code}</dd></div>
                            <div><dt className="text-gray-400 text-xs">Travel Date</dt><dd>{fmt(order.travel_date)}</dd></div>
                            <div><dt className="text-gray-400 text-xs">Departure</dt><dd>{order.flight?.departure_time}</dd></div>
                            <div><dt className="text-gray-400 text-xs">Arrival</dt><dd>{order.flight?.arrival_time}</dd></div>
                        </dl>
                    </div>

                    {/* Passengers */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">Passengers ({order.passengers?.length})</h2>
                        <div className="space-y-3">
                            {order.passengers?.map((p, i) => (
                                <div key={p.id} className="flex justify-between items-start text-sm border-b pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <div className="font-medium">{p.title ? `${p.title} ` : ''}{p.first_name} {p.last_name}</div>
                                        <div className="text-gray-400 text-xs capitalize">{p.type} · DOB: {fmt(p.date_of_birth)} · {p.nationality}</div>
                                    </div>
                                    <div className="text-xs text-gray-400 font-mono">{p.passport_number || '—'}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment */}
                    {order.payment && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">Payment</h2>
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div><dt className="text-gray-400 text-xs">Transaction ID</dt><dd className="font-mono">{order.payment.txn_id}</dd></div>
                                <div><dt className="text-gray-400 text-xs">bKash Number</dt><dd>{order.payment.sender_number}</dd></div>
                                <div><dt className="text-gray-400 text-xs">Amount</dt><dd className="font-semibold text-indigo-600">৳ {order.payment.amount}</dd></div>
                                <div><dt className="text-gray-400 text-xs">Status</dt><dd className="capitalize">{order.payment.status}</dd></div>
                            </dl>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
