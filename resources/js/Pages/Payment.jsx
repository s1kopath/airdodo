import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Layout from '../Components/Layout';
import StepBar from '../Components/StepBar';

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    function copy() {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <button
            type="button"
            onClick={copy}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
                ${copied ? 'bg-green-100 text-green-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
            {copied ? '✓ Copied' : 'Copy'}
        </button>
    );
}

export default function Payment({ order, bkash_number, amount }) {
    const { data, setData, post, processing, errors } = useForm({
        txn_id:        '',
        sender_number: '',
    });

    const [step, setStep] = useState(1);

    function submit(e) {
        e.preventDefault();
        post(`/orders/${order.reference}/payment`);
    }

    const fmt = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <Layout>
            <StepBar current={3} />

            <div className="max-w-lg mx-auto px-4 py-8">
                {/* Amount hero */}
                <div className="bg-gradient-to-br from-[#e2136e] to-[#c01059] rounded-2xl p-6 text-white text-center mb-6 shadow-xl shadow-pink-200 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
                    <div className="relative">
                        <div className="text-pink-200 text-sm font-medium mb-1">Total Amount Due</div>
                        <div className="text-5xl font-extrabold tracking-tight mb-1">৳ {amount}</div>
                        <div className="text-pink-200 text-xs">Order <span className="font-mono font-bold text-white">{order.reference}</span></div>
                    </div>
                </div>

                {/* Order summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-5 overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Summary</h3>
                    </div>
                    <div className="px-5 py-4 space-y-2.5">
                        {[
                            ['Flight', `${order.flight?.airline?.name} ${order.flight?.flight_number}`],
                            ['Route', `${order.flight?.origin?.iata_code} → ${order.flight?.destination?.iata_code}`],
                            ['Date', fmt(order.travel_date)],
                            ['Passengers', `${order.passengers?.length} passenger${order.passengers?.length !== 1 ? 's' : ''}`],
                        ].map(([label, val]) => (
                            <div key={label} className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">{label}</span>
                                <span className="font-medium text-gray-800">{val}</span>
                            </div>
                        ))}
                        <div className="border-t pt-2.5 flex justify-between items-center">
                            <span className="font-bold text-gray-800">Total</span>
                            <span className="text-xl font-extrabold text-[#e2136e]">৳ {amount}</span>
                        </div>
                    </div>
                </div>

                {/* bKash instructions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-5 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#e2136e] to-[#c01059] px-5 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <span className="text-xl">📱</span>
                                <span>Pay via bKash</span>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                            <div>
                                <div className="text-pink-200 text-xs mb-0.5">Send Money to</div>
                                <div className="text-white text-2xl font-extrabold tracking-widest font-mono">{bkash_number}</div>
                            </div>
                            <CopyButton text={bkash_number} />
                        </div>
                    </div>

                    <div className="px-5 py-4">
                        <div className="space-y-3">
                            {[
                                { n: 1, text: <>Open bKash app and tap <strong>Send Money</strong></> },
                                { n: 2, text: <>Enter number <span className="font-mono font-bold text-[#e2136e]">{bkash_number}</span> and amount <strong>৳ {amount}</strong></> },
                                { n: 3, text: <>Enter your PIN and complete the transaction</> },
                                { n: 4, text: <>Copy the <strong>Transaction ID</strong> from the confirmation screen</> },
                            ].map(({ n, text }) => (
                                <div key={n} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-pink-100 text-[#e2136e] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submission form */}
                <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Enter Payment Details</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">bKash Transaction ID</label>
                            <input
                                className={`w-full border-2 rounded-xl px-4 py-3 font-mono text-lg tracking-widest uppercase transition-all outline-none
                                    ${errors.txn_id ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#e2136e] hover:border-gray-300'}`}
                                placeholder="e.g. 8N7TK8LO1X"
                                value={data.txn_id}
                                onChange={e => setData('txn_id', e.target.value.toUpperCase())}
                            />
                            {errors.txn_id && <p className="text-red-500 text-xs mt-1">{errors.txn_id}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Your bKash Number</label>
                            <input
                                className={`w-full border-2 rounded-xl px-4 py-3 font-mono text-lg tracking-wider transition-all outline-none
                                    ${errors.sender_number ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#e2136e] hover:border-gray-300'}`}
                                placeholder="01XXXXXXXXX"
                                value={data.sender_number}
                                onChange={e => setData('sender_number', e.target.value)}
                            />
                            {errors.sender_number && <p className="text-red-500 text-xs mt-1">{errors.sender_number}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || !data.txn_id || !data.sender_number}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#e2136e] to-[#c01059] hover:from-[#c01059] hover:to-[#a80d4f] active:scale-[0.99] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-pink-200 text-base"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Submitting…
                                </>
                            ) : 'Submit Payment →'}
                        </button>

                        <p className="text-xs text-gray-400 text-center">
                            Your itinerary will be ready once our team verifies the payment — usually within 1–2 hours.
                        </p>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
