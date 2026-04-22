const STEPS = [
    { n: 1, label: 'Search' },
    { n: 2, label: 'Details' },
    { n: 3, label: 'Payment' },
    { n: 4, label: 'Confirm' },
];

export default function StepBar({ current }) {
    return (
        <div className="bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-3xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between relative">
                    {/* connecting line */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gray-200 mx-8 z-0" />
                    {STEPS.map((s, i) => {
                        const done    = s.n < current;
                        const active  = s.n === current;
                        const future  = s.n > current;
                        return (
                            <div key={s.n} className="flex flex-col items-center gap-1 z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                    ${done   ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' : ''}
                                    ${active ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-sm shadow-indigo-200' : ''}
                                    ${future ? 'bg-gray-100 text-gray-400' : ''}
                                `}>
                                    {done ? '✓' : s.n}
                                </div>
                                <span className={`text-xs font-medium hidden sm:block ${active ? 'text-indigo-600' : done ? 'text-gray-500' : 'text-gray-300'}`}>
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
