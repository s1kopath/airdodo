import { useForm } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function Lookup({ flash }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    function submit(e) {
        e.preventDefault();
        post('/my-bookings');
    }

    return (
        <Layout>
            <div className="max-w-md mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <span className="text-5xl">📋</span>
                    <h1 className="text-2xl font-bold text-[#1a1a2e] mt-3">My Bookings</h1>
                    <p className="text-gray-500 text-sm mt-2">Enter the email you used when booking to view your itineraries.</p>
                </div>

                {flash?.error && (
                    <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-700 border border-red-200">{flash.error}</div>
                )}

                <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="your@email.com"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            autoFocus
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
                    >
                        {processing ? 'Looking up…' : 'Find My Bookings'}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-4">
                    Have a reference code?{' '}
                    <a href="/orders" className="text-indigo-500 hover:underline">Check order status directly</a>
                </p>
            </div>
        </Layout>
    );
}
