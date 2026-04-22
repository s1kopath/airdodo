import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Components/AdminLayout';

const STATUS_COLORS = {
    pending:           'bg-gray-100 text-gray-600',
    payment_submitted: 'bg-yellow-100 text-yellow-700',
    approved:          'bg-green-100 text-green-700',
    rejected:          'bg-red-100 text-red-700',
    cancelled:         'bg-gray-100 text-gray-400',
};

function Flash({ flash }) {
    if (!flash?.success && !flash?.error) return null;
    return (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${flash.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {flash.success || flash.error}
        </div>
    );
}

function RejectModal({ order, onClose }) {
    const { data, setData, post, processing } = useForm({ admin_note: '' });

    function submit(e) {
        e.preventDefault();
        post(`/admin/orders/${order.id}/reject`, { onSuccess: onClose });
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                <h3 className="font-bold text-[#1a1a2e] mb-1">Reject Order {order.reference}</h3>
                <p className="text-sm text-gray-500 mb-4">Optionally provide a reason for rejection.</p>
                <form onSubmit={submit} className="space-y-4">
                    <textarea
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
                        rows={3}
                        placeholder="Reason (optional)"
                        value={data.admin_note}
                        onChange={e => setData('admin_note', e.target.value)}
                    />
                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50">
                            {processing ? 'Rejecting…' : 'Reject'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminOrders({ orders, filters, flash }) {
    const [rejectTarget, setRejectTarget] = useState(null);
    const { data, setData, get } = useForm({ search: filters?.search ?? '', status: filters?.status ?? '' });

    function search(e) {
        e.preventDefault();
        get('/admin/orders', { preserveState: true, replace: true });
    }

    function approve(order) {
        if (!confirm(`Approve order ${order.reference}?`)) return;
        router.post(`/admin/orders/${order.id}/approve`);
    }

    return (
        <AdminLayout title="Orders">
            <Flash flash={flash} />

            {/* Filters */}
            <form onSubmit={search} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex gap-3 flex-wrap items-end">
                <div className="flex-1 min-w-48">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
                    <input
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        placeholder="Reference, name or email…"
                        value={data.search}
                        onChange={e => setData('search', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                    <select
                        className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        value={data.status}
                        onChange={e => setData('status', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="payment_submitted">Payment Submitted</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg">Filter</button>
                <span className="text-sm text-gray-400 self-center">{orders.total} orders</span>
            </form>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                {['Ref', 'Contact', 'Flight', 'Date', 'Pax', 'TxnID', 'Amount', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.data.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono font-bold text-indigo-600 whitespace-nowrap">
                                        <a href={`/admin/orders/${order.id}`} className="hover:underline">{order.reference}</a>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{order.contact_name}</div>
                                        <div className="text-gray-400 text-xs">{order.contact_email}</div>
                                        {order.contact_phone && <div className="text-gray-400 text-xs">{order.contact_phone}</div>}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div>{order.flight?.airline?.name}</div>
                                        <div className="text-gray-400 text-xs">{order.flight?.origin?.iata_code} → {order.flight?.destination?.iata_code}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        {new Date(order.travel_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-4 py-3 text-center">{order.passengers_count ?? '—'}</td>
                                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{order.payment?.txn_id ?? '—'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{order.payment ? `৳ ${order.payment.amount}` : '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_COLORS[order.status]}`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1.5 flex-wrap">
                                            <a href={`/admin/orders/${order.id}`} className="text-indigo-600 hover:underline text-xs whitespace-nowrap">View</a>
                                            <a href={`/admin/orders/${order.id}/edit`} className="text-gray-500 hover:underline text-xs whitespace-nowrap">Edit</a>
                                            {order.status === 'payment_submitted' && (
                                                <>
                                                    <button onClick={() => approve(order)} className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-0.5 rounded">Approve</button>
                                                    <button onClick={() => setRejectTarget(order)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded">Reject</button>
                                                </>
                                            )}
                                            {order.status === 'approved' && (
                                                <a href={`/admin/orders/${order.id}/download`} className="text-green-600 hover:underline text-xs whitespace-nowrap">PDF</a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.data.length === 0 && (
                        <div className="text-center py-10 text-gray-400">No orders found.</div>
                    )}
                </div>
            </div>

            {orders.links && (
                <div className="flex gap-2 mt-4 justify-center flex-wrap">
                    {orders.links.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => link.url && router.visit(link.url)}
                            disabled={!link.url}
                            className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border'} disabled:opacity-40`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            {rejectTarget && <RejectModal order={rejectTarget} onClose={() => setRejectTarget(null)} />}
        </AdminLayout>
    );
}
