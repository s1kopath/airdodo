import { router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Components/AdminLayout';

const STATUS_COLORS = {
    pending:           'bg-gray-100 text-gray-700',
    payment_submitted: 'bg-yellow-100 text-yellow-700',
    approved:          'bg-green-100 text-green-700',
    rejected:          'bg-red-100 text-red-700',
    cancelled:         'bg-gray-100 text-gray-400',
};

function RejectModal({ order, onClose }) {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    function submit(e) {
        e.preventDefault();
        setLoading(true);
        router.post(`/admin/orders/${order.id}/reject`, { admin_note: note }, { onFinish: () => { setLoading(false); onClose(); } });
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                <h3 className="font-bold text-[#1a1a2e] mb-3">Reject Order {order.reference}</h3>
                <form onSubmit={submit} className="space-y-4">
                    <textarea
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
                        rows={3} placeholder="Reason (optional)"
                        value={note} onChange={e => setNote(e.target.value)}
                    />
                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50">
                            {loading ? 'Rejecting…' : 'Reject'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminOrderDetail({ order, flash }) {
    const [rejectOpen, setRejectOpen] = useState(false);

    function approve() {
        if (!confirm(`Approve order ${order.reference}?`)) return;
        router.post(`/admin/orders/${order.id}/approve`);
    }

    const fmt = d => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    return (
        <AdminLayout title={`Order ${order.reference}`}>
            {flash?.success && <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-green-50 text-green-700 border border-green-200">{flash.success}</div>}
            {flash?.error && <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200">{flash.error}</div>}

            <div className="flex gap-3 mb-5 flex-wrap">
                <a href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-700">← Back to Orders</a>
                <a href={`/admin/orders/${order.id}/edit`} className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg">Edit</a>
                {order.status === 'payment_submitted' && (
                    <>
                        <button onClick={approve} className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg">Approve</button>
                        <button onClick={() => setRejectOpen(true)} className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg">Reject</button>
                    </>
                )}
                {order.status === 'approved' && (
                    <a href={`/admin/orders/${order.id}/download`} className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg">Download PDF</a>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Order Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Order Info</h2>
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between"><dt className="text-gray-500">Reference</dt><dd className="font-mono font-bold text-indigo-600">{order.reference}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Status</dt>
                            <dd><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>{order.status.replace('_', ' ')}</span></dd>
                        </div>
                        <div className="flex justify-between"><dt className="text-gray-500">Travel Date</dt><dd>{fmt(order.travel_date)}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Created</dt><dd>{fmt(order.created_at)}</dd></div>
                        {order.admin_note && <div className="pt-2 border-t"><dt className="text-gray-500 mb-1">Admin Note</dt><dd className="text-red-600 text-xs">{order.admin_note}</dd></div>}
                    </dl>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Contact</h2>
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between"><dt className="text-gray-500">Name</dt><dd>{order.contact_name}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd>{order.contact_email}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Phone</dt><dd>{order.contact_phone || '—'}</dd></div>
                    </dl>
                </div>

                {/* Flight */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Flight</h2>
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between"><dt className="text-gray-500">Airline</dt><dd>{order.flight?.airline?.name}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Flight #</dt><dd className="font-mono">{order.flight?.flight_number}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Route</dt><dd>{order.flight?.origin?.iata_code} → {order.flight?.destination?.iata_code}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Departure</dt><dd>{order.flight?.departure_time}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Arrival</dt><dd>{order.flight?.arrival_time}</dd></div>
                    </dl>
                </div>

                {/* Payment */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Payment</h2>
                    {order.payment ? (
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="text-gray-500">Method</dt><dd className="capitalize">{order.payment.method}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">TxnID</dt><dd className="font-mono">{order.payment.txn_id}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Sender #</dt><dd>{order.payment.sender_number}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Amount</dt><dd className="font-semibold text-indigo-600">৳ {order.payment.amount}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd className="capitalize">{order.payment.status}</dd></div>
                            {order.payment.verified_at && <div className="flex justify-between"><dt className="text-gray-500">Verified</dt><dd>{fmt(order.payment.verified_at)}</dd></div>}
                        </dl>
                    ) : (
                        <p className="text-gray-400 text-sm">No payment submitted yet.</p>
                    )}
                </div>
            </div>

            {/* Passengers */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-5">
                <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Passengers ({order.passengers?.length})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                {['#', 'Type', 'Name', 'DOB', 'Nationality', 'Passport #', 'Expiry'].map(h => (
                                    <th key={h} className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {order.passengers?.map((p, i) => (
                                <tr key={p.id}>
                                    <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                                    <td className="px-3 py-2 capitalize">{p.type}</td>
                                    <td className="px-3 py-2 font-medium">{p.title ? `${p.title} ` : ''}{p.first_name} {p.last_name}</td>
                                    <td className="px-3 py-2">{fmt(p.date_of_birth)}</td>
                                    <td className="px-3 py-2 uppercase">{p.nationality}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{p.passport_number || '—'}</td>
                                    <td className="px-3 py-2">{p.passport_expiry ? fmt(p.passport_expiry) : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {rejectOpen && <RejectModal order={order} onClose={() => setRejectOpen(false)} />}
        </AdminLayout>
    );
}
