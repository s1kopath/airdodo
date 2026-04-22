import { useForm } from '@inertiajs/react';
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
    payment_submitted: 'Payment Submitted',
    approved:          'Approved',
    rejected:          'Rejected',
    cancelled:         'Cancelled',
};

export default function BookingList({ orders, email }) {
    const { data, setData, post } = useForm({ email: '' });

    const fmt = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a2e]">My Bookings</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Showing bookings for <span className="font-medium text-indigo-600">{email}</span></p>
                    </div>
                    <a href="/my-bookings" className="text-sm text-indigo-600 hover:underline">← Search different email</a>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                        <span className="text-4xl">📭</span>
                        <p className="text-gray-500 mt-3">No bookings found for this email.</p>
                        <a href="/" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">Book a flight →</a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-mono font-bold text-indigo-600 text-sm">{order.reference}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                                            {STATUS_LABELS[order.status]}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-700 font-medium">
                                        {order.flight?.airline?.name} — {order.flight?.origin?.iata_code} → {order.flight?.destination?.iata_code}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {fmt(order.travel_date)} · {order.passengers_count} passenger{order.passengers_count !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <a href={`/my-bookings/${order.reference}`}
                                        className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg">
                                        View
                                    </a>
                                    {['pending', 'payment_submitted'].includes(order.status) && (
                                        <a href={`/my-bookings/${order.reference}/edit`}
                                            className="text-sm border hover:bg-gray-50 text-gray-600 px-4 py-1.5 rounded-lg">
                                            Edit
                                        </a>
                                    )}
                                    {order.status === 'approved' && (
                                        <a href={`/my-bookings/${order.reference}/download`}
                                            className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg">
                                            Download PDF
                                        </a>
                                    )}
                                    {order.status === 'pending' && (
                                        <a href={`/orders/${order.reference}/payment`}
                                            className="text-sm bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-lg">
                                            Pay Now
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
