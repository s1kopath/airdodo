const STEPS = [
    { n: 1, label: 'Search' },
    { n: 2, label: 'Details' },
    { n: 3, label: 'Payment' },
    { n: 4, label: 'Confirm' },
];

export default function StepBar({ current }) {
    return (
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-[73px] z-20">
            <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between relative">
                    {/* Progress Track */}
                    <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-slate-100 z-0" />
                    <div 
                        className="absolute left-8 top-1/2 -translate-y-1/2 h-[2px] bg-brand z-0 transition-all duration-500 ease-out" 
                        style={{ width: `${((current - 1) / (STEPS.length - 1)) * 100 - (current === STEPS.length ? 0 : 5)}%` }}
                    />

                    {STEPS.map((s, i) => {
                        const done    = s.n < current;
                        const active  = s.n === current;
                        const future  = s.n > current;

                        const handleClick = () => {
                            if (done) {
                                window.history.back();
                            }
                        };

                        return (
                            <div 
                                key={s.n} 
                                className={`flex flex-col items-center gap-2 z-10 ${done ? 'cursor-pointer group/step' : ''}`}
                                onClick={handleClick}
                            >
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500
                                    ${done   ? 'bg-brand text-white shadow-lg shadow-brand/20 group-hover/step:scale-110 group-hover/step:shadow-brand/40' : ''}
                                    ${active ? 'bg-navy text-white ring-8 ring-brand/10 shadow-lg shadow-navy/20 scale-110' : ''}
                                    ${future ? 'bg-white text-slate-300 border-2 border-slate-100' : ''}
                                `}>
                                    {done ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                    ) : s.n}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block transition-colors duration-300 ${active ? 'text-navy' : done ? 'text-brand group-hover/step:text-navy' : 'text-slate-300'}`}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

    );
}
