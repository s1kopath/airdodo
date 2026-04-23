import { useForm, Head } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <Layout>
            <Head title="Login" />
            <div className="max-w-md mx-auto px-6 py-20">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-brand/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <h1 className="text-3xl font-black text-navy tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-slate-500 font-medium">Sign in to manage your flight itineraries</p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold text-navy transition-all outline-none
                                    ${errors.email ? 'border-rose-100 bg-rose-50' : 'border-transparent focus:border-brand focus:bg-white hover:bg-slate-100'}`}
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="name@example.com"
                                autoFocus
                            />
                            {errors.email && <p className="text-rose-500 text-[10px] font-black uppercase tracking-tight ml-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password"
                                className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold text-navy transition-all outline-none
                                    ${errors.password ? 'border-rose-100 bg-rose-50' : 'border-transparent focus:border-brand focus:bg-white hover:bg-slate-100'}`}
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-rose-500 text-[10px] font-black uppercase tracking-tight ml-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between ml-1">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-2 border-slate-200 text-brand focus:ring-brand"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                />
                                <span className="text-sm font-bold text-slate-500 group-hover:text-navy transition-colors">Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-navy hover:bg-navy-light text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-navy/20 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-4 text-xl"
                        >
                            {processing ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-10 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    Account restricted to authorized users only
                </p>
            </div>
        </Layout>
    );
}
