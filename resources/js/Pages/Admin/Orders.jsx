import { router, useForm, Head } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Components/AdminLayout';

const STATUS_COLORS = {
    pending:           'bg-amber-50 text-amber-600 border-amber-100',
    payment_submitted: 'bg-blue-50 text-blue-600 border-blue-100',
    approved:          'bg-emerald-50 text-emerald-600 border-emerald-100',
    rejected:          'bg-rose-50 text-rose-600 border-rose-100',
    cancelled:         'bg-slate-50 text-slate-400 border-slate-100',
};

function RejectModal({ order, onClose }) {
    const { data, setData, post, processing } = useForm({ admin_note: '' });

    function submit(e) {
        e.preventDefault();
        post(`/admin/orders/${order.id}/reject`, { onSuccess: onClose });
    }

    return (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md border border-slate-100 animate-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-black text-navy mb-2 tracking-tight">Reject Reservation</h3>
                <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Please provide a reason for rejecting order <span className="text-brand font-black font-mono">{order.reference}</span>.</p>
                <form onSubmit={submit} className="space-y-6">
                    <textarea
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-400 focus:bg-white rounded-2xl px-6 py-4 font-bold text-navy transition-all outline-none resize-none"
                        rows={4}
                        placeholder="Internal notes or feedback for user..."
                        value={data.admin_note}
                        onChange={e => setData('admin_note', e.target.value)}
                    />
                    <div className="flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-navy hover:border-navy transition-all">Cancel</button>
                        <button type="submit" disabled={processing} className="flex-1 px-6 py-4 bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-500/20 disabled:opacity-50 transition-all">
                            {processing ? 'Processing...' : 'Reject Order'}
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
        <AdminLayout title="Reservations">
            <Head title="Admin | Reservations" />
            
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Orders</div>
                    <div className="text-3xl font-black text-navy leading-none">{orders.total}</div>
                </div>
            </div>

            {/* Filters */}
            <form onSubmit={search} className="bg-white rounded-[2rem] border border-slate-100 p-3 shadow-sm mb-12 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
                <div className="flex-1 relative">
                    <svg className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <input
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl pl-14 pr-6 py-4 font-bold text-navy transition-all outline-none"
                        placeholder="Search by Reference, Passenger Name or Email..."
                        value={data.search}
                        onChange={e => setData('search', e.target.value)}
                    />
                </div>
                <button type="submit" className="bg-navy hover:bg-navy-light text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-navy/20 active:scale-95">Filter</button>
            </form>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                {['Reference', 'Passenger', 'Route', 'Travel Date', 'Actions'].map(h => (
                                    <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.data.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <a href={`/admin/orders/${order.id}`} className="font-mono font-black text-brand text-sm tracking-widest hover:underline mb-1">{order.reference}</a>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Order ID: {order.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-navy leading-none mb-1">{order.contact_name}</span>
                                            <span className="text-slate-400 text-xs font-medium">{order.contact_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-navy">{order.flight?.origin?.iata_code}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><path d="m9 18 6-6-6-6"/></svg>
                                            <span className="font-black text-navy">{order.flight?.destination?.iata_code}</span>
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{order.flight?.airline?.code} Flight</div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="font-black text-navy text-sm">
                                            {new Date(order.travel_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <a href={`/admin/orders/${order.id}`} className="text-[10px] font-black text-navy uppercase tracking-widest hover:text-brand transition-colors">Details</a>
                                            <a href={`/admin/orders/${order.id}/edit`} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-navy transition-colors">Edit</a>
                                            <a href={`/admin/orders/${order.id}/download`} className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-600 transition-colors">PDF</a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50">
                             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="19" x2="13" y2="19"/></svg>
                             </div>
                             <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No Reservations Found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {orders.links && orders.total > orders.per_page && (
                <div className="flex gap-2 mt-12 justify-center">
                    {orders.links.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => link.url && router.visit(link.url)}
                            disabled={!link.url}
                            className={`min-w-[40px] h-10 px-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                                ${link.active 
                                    ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                                    : 'bg-white text-slate-400 border border-slate-100 hover:text-navy hover:border-navy'
                                } disabled:opacity-30`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            {rejectTarget && <RejectModal order={rejectTarget} onClose={() => setRejectTarget(null)} />}
        </AdminLayout>
    );
}
