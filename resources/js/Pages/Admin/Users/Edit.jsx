import { useForm, Head } from '@inertiajs/react';
import AdminLayout from '../../../Components/AdminLayout';

export default function UserForm({ user = null }) {
    const isEdit = !!user;
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        active: user?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/users/${user.id}`);
        } else {
            post('/admin/users');
        }
    }

    return (
        <AdminLayout title={isEdit ? 'Edit User' : 'Add New User'}>
            <Head title={isEdit ? 'Admin - Edit User' : 'Admin - Add User'} />

            <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                            <input
                                type="text"
                                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-200'}`}
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g. John Doe"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                            <input
                                type="email"
                                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-200'}`}
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="john@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Password {isEdit && <span className="text-gray-400 normal-case">(Leave blank to keep current)</span>}
                            </label>
                            <input
                                type="password"
                                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-200'}`}
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Account Status</label>
                            <select
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all appearance-none"
                                value={data.active ? '1' : '0'}
                                onChange={e => setData('active', e.target.value === '1')}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save User'}
                        </button>
                        <a 
                            href="/admin/users" 
                            className="bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold px-8 py-3 rounded-xl transition"
                        >
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
