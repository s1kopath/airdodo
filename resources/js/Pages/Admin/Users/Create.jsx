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
        <AdminLayout title={isEdit ? 'Modify Account' : 'Register New User'}>
            <Head title={isEdit ? 'Admin | Edit User' : 'Admin | Add User'} />

            <div className="max-w-3xl bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
                <form onSubmit={submit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text"
                                className={`w-full bg-slate-50 border-2 border-transparent focus:bg-white rounded-2xl px-6 py-4 font-bold text-navy transition-all outline-none ${errors.name ? 'border-rose-300 focus:border-rose-400' : 'focus:border-brand'}`}
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g. John Doe"
                            />
                            {errors.name && <p className="text-rose-500 text-[10px] font-black uppercase ml-1">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                className={`w-full bg-slate-50 border-2 border-transparent focus:bg-white rounded-2xl px-6 py-4 font-bold text-navy transition-all outline-none ${errors.email ? 'border-rose-300 focus:border-rose-400' : 'focus:border-brand'}`}
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="john@example.com"
                            />
                            {errors.email && <p className="text-rose-500 text-[10px] font-black uppercase ml-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Password {isEdit && <span className="text-slate-400 normal-case lowercase font-medium">(Leave blank to keep current)</span>}
                            </label>
                            <input
                                type="password"
                                className={`w-full bg-slate-50 border-2 border-transparent focus:bg-white rounded-2xl px-6 py-4 font-bold text-navy transition-all outline-none ${errors.password ? 'border-rose-300 focus:border-rose-400' : 'focus:border-brand'}`}
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-rose-500 text-[10px] font-black uppercase ml-1">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Status</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl px-6 py-4 font-bold text-navy transition-all outline-none appearance-none cursor-pointer"
                                    value={data.active ? '1' : '0'}
                                    onChange={e => setData('active', e.target.value === '1')}
                                >
                                    <option value="1">Active Account</option>
                                    <option value="0">Deactivated</option>
                                </select>
                                <svg className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-navy hover:bg-navy-light text-white font-black px-10 py-5 rounded-2xl transition-all shadow-2xl shadow-navy/20 active:scale-95 disabled:opacity-50 flex items-center gap-3"
                        >
                            {processing ? (
                                <svg className="animate-spin w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            ) : null}
                            {processing ? 'Processing...' : (isEdit ? 'Save Changes' : 'Create Account')}
                        </button>
                        <a 
                            href="/admin/users" 
                            className="bg-white border-2 border-slate-100 text-slate-400 font-black px-10 py-5 rounded-2xl hover:text-navy hover:border-navy transition-all active:scale-95"
                        >
                            Discard
                        </a>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
