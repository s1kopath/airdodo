import { useForm } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';

const STATUSES = ['pending', 'payment_submitted', 'approved', 'rejected', 'cancelled'];

export default function AdminOrderEdit({ order, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        contact_name:  order.contact_name,
        contact_email: order.contact_email,
        contact_phone: order.contact_phone ?? '',
        travel_date:   order.travel_date?.split('T')[0] ?? '',
        status:        order.status,
        admin_note:    order.admin_note ?? '',
        passengers:    order.passengers.map(p => ({
            id:              p.id,
            type:            p.type,
            title:           p.title ?? '',
            first_name:      p.first_name,
            last_name:       p.last_name,
            date_of_birth:   p.date_of_birth?.split('T')[0] ?? '',
            nationality:     p.nationality,
            passport_number: p.passport_number ?? '',
            passport_expiry: p.passport_expiry?.split('T')[0] ?? '',
        })),
    });

    function submit(e) {
        e.preventDefault();
        put(`/admin/orders/${order.id}`);
    }

    function setPax(i, field, value) {
        const updated = [...data.passengers];
        updated[i] = { ...updated[i], [field]: value };
        setData('passengers', updated);
    }

    return (
        <AdminLayout title={`Edit Order ${order.reference}`}>
            {flash?.success && <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-green-50 text-green-700 border border-green-200">{flash.success}</div>}

            <a href={`/admin/orders/${order.id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-5 inline-block">← Back to Order</a>

            <form onSubmit={submit} className="space-y-5">
                {/* Contact */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Contact Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                            <input className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                value={data.contact_name} onChange={e => setData('contact_name', e.target.value)} />
                            {errors.contact_name && <p className="text-red-500 text-xs mt-1">{errors.contact_name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                            <input type="email" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                value={data.contact_email} onChange={e => setData('contact_email', e.target.value)} />
                            {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                            <input className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                value={data.contact_phone} onChange={e => setData('contact_phone', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Order fields */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Order Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Travel Date</label>
                            <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                value={data.travel_date} onChange={e => setData('travel_date', e.target.value)} />
                            {errors.travel_date && <p className="text-red-500 text-xs mt-1">{errors.travel_date}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                            <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                value={data.status} onChange={e => setData('status', e.target.value)}>
                                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Admin Note</label>
                            <input className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                value={data.admin_note} onChange={e => setData('admin_note', e.target.value)} placeholder="Optional note" />
                        </div>
                    </div>
                </div>

                {/* Passengers */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Passengers</h2>
                    <div className="space-y-6">
                        {data.passengers.map((p, i) => (
                            <div key={p.id} className="border border-gray-100 rounded-xl p-4">
                                <div className="text-xs font-semibold text-indigo-600 uppercase mb-3">Passenger {i + 1}</div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Type</label>
                                        <select className="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                            value={p.type} onChange={e => setPax(i, 'type', e.target.value)}>
                                            <option value="adult">Adult</option>
                                            <option value="child">Child</option>
                                            <option value="infant">Infant</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Title</label>
                                        <select className="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                            value={p.title} onChange={e => setPax(i, 'title', e.target.value)}>
                                            <option value="">—</option>
                                            {['Mr', 'Mrs', 'Ms', 'Miss', 'Dr'].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">First Name</label>
                                        <input className="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                            value={p.first_name} onChange={e => setPax(i, 'first_name', e.target.value)} />
                                        {errors[`passengers.${i}.first_name`] && <p className="text-red-500 text-xs mt-1">{errors[`passengers.${i}.first_name`]}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                                        <input className="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                            value={p.last_name} onChange={e => setPax(i, 'last_name', e.target.value)} />
                                        {errors[`passengers.${i}.last_name`] && <p className="text-red-500 text-xs mt-1">{errors[`passengers.${i}.last_name`]}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Date of Birth</label>
                                        <input type="date" className="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                            value={p.date_of_birth} onChange={e => setPax(i, 'date_of_birth', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Nationality</label>
                                        <input className="w-full border rounded-lg px-2 py-1.5 text-sm uppercase focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                            maxLength={2} value={p.nationality} onChange={e => setPax(i, 'nationality', e.target.value.toUpperCase())} />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Passport #</label>
                                        <input className="w-full border rounded-lg px-2 py-1.5 text-sm font-mono focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                            value={p.passport_number} onChange={e => setPax(i, 'passport_number', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Passport Expiry</label>
                                        <input type="date" className="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                            value={p.passport_expiry} onChange={e => setPax(i, 'passport_expiry', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-50">
                        {processing ? 'Saving…' : 'Save Changes'}
                    </button>
                    <a href={`/admin/orders/${order.id}`} className="px-6 py-2.5 border rounded-xl text-sm hover:bg-gray-50">Cancel</a>
                </div>
            </form>
        </AdminLayout>
    );
}
