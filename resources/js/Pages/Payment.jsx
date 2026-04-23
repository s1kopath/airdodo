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
            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all
                ${copied ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-md'}`}
        >
            {copied ? '✓ Copied' : 'Copy Number'}
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

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Instructions & Payment Form */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Amount Card */}
                        <div className="bg-[#e2136e] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-pink-200 relative overflow-hidden group">
                            <div className="absolute right-[-10%] top-[-10%] opacity-10 transform rotate-12 transition-transform group-hover:scale-110 duration-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.84-.23-3.32-1.35-3.38-3.14h2.15c.04.81.71 1.41 1.41 1.41.87 0 1.45-.48 1.45-1.12 0-1.74-4.83-1.07-4.83-4.13 0-1.57 1.15-2.61 2.82-2.91V7h2.82v1.92c1.47.24 2.76 1.05 2.86 2.7h-2.15c-.07-.73-.55-1.2-1.25-1.2-.68 0-1.41.34-1.41 1.05 0 1.74 4.83 1.03 4.83 4.14 0 1.54-1.14 2.56-2.82 2.88z"/></svg>
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <div className="text-pink-100 text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Total Payable Amount</div>
                                    <div className="text-6xl font-black tracking-tighter mb-2 leading-none flex items-baseline gap-2">
                                        <span className="text-3xl opacity-60">৳</span>
                                        {amount}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-white/10 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border border-white/10">Reference: {order.reference}</span>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-6 border border-white/10 w-full md:w-auto text-center md:text-left">
                                    <div className="text-pink-100 text-[10px] font-black uppercase tracking-widest mb-3 opacity-80">Send Money To</div>
                                    <div className="text-3xl font-black font-mono tracking-widest mb-4">{bkash_number}</div>
                                    <CopyButton text={bkash_number} />
                                </div>
                            </div>
                        </div>

                        {/* Payment Steps */}
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-2 h-8 bg-brand rounded-full" />
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Payment Instructions</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { n: 1, title: 'Open bKash', text: 'Launch your bKash app and select the "Send Money" option.' },
                                    { n: 2, title: 'Enter Number', text: `Send exactly ৳${amount} to our official bKash: ${bkash_number}` },
                                    { n: 3, title: 'Add Reference', text: `Use your booking ID "${order.reference}" in the reference field.` },
                                    { n: 4, title: 'Copy TxnID', text: 'Keep the 10-character Transaction ID (TxnID) ready.' },
                                ].map(({ n, title, text }) => (
                                    <div key={n} className="flex gap-4 group">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 font-black flex items-center justify-center shrink-0 group-hover:bg-[#e2136e] group-hover:text-white transition-all">
                                            {n}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-wider">{title}</h4>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submission Form */}
                        <div className="bg-white rounded-[2.5rem] p-10 border-2 border-brand/20 shadow-xl shadow-brand/5">
                            <form onSubmit={submit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transaction ID (TxnID)</label>
                                        <input
                                            className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-lg tracking-[0.3em] uppercase transition-all outline-none
                                                ${errors.txn_id ? 'border-rose-100 bg-rose-50' : 'border-transparent focus:border-brand focus:bg-white hover:bg-slate-100'}`}
                                            placeholder="8N7TK8LO1X"
                                            value={data.txn_id}
                                            onChange={e => setData('txn_id', e.target.value.toUpperCase())}
                                        />
                                        {errors.txn_id && <p className="text-rose-500 text-[10px] font-black uppercase tracking-tight ml-1">{errors.txn_id}</p>}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Sender Number</label>
                                        <input
                                            className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-lg tracking-widest transition-all outline-none
                                                ${errors.sender_number ? 'border-rose-100 bg-rose-50' : 'border-transparent focus:border-brand focus:bg-white hover:bg-slate-100'}`}
                                            placeholder="01XXXXXXXXX"
                                            value={data.sender_number}
                                            onChange={e => setData('sender_number', e.target.value)}
                                        />
                                        {errors.sender_number && <p className="text-rose-500 text-[10px] font-black uppercase tracking-tight ml-1">{errors.sender_number}</p>}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !data.txn_id || !data.sender_number}
                                    className="w-full group bg-navy hover:bg-navy-light text-white font-black py-5 rounded-[2rem] transition-all shadow-2xl shadow-navy/20 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-4 text-xl"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            <span className="tracking-tight">Verifying Transaction...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="tracking-tight">Submit Payment Details</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Manual verification takes ~15-60 minutes
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden sticky top-32">
                            <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Summary</h3>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</div>
                                            <div className="font-black text-navy text-xl">
                                                {order.flight?.origin?.iata_code} <span className="text-brand">→</span> {order.flight?.destination?.iata_code}
                                            </div>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flight</div>
                                            <div className="font-black text-slate-900">{order.flight?.flight_number}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</div>
                                            <div className="font-bold text-slate-900 text-sm">{fmt(order.travel_date)}</div>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passengers</div>
                                            <div className="font-bold text-slate-900 text-sm">{order.passengers?.length} Person(s)</div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Fee</span>
                                        <span className="font-black text-slate-900">৳ 0</span>
                                    </div>
                                    <div className="pt-4 flex justify-between items-center border-t border-slate-200">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                                        <span className="text-3xl font-black text-navy leading-none flex items-baseline gap-1">
                                            <span className="text-sm opacity-40 font-bold tracking-normal">BDT</span>
                                            {amount}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                    </div>
                                    <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider leading-relaxed">Price guaranteed for the next 15:00 minutes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
