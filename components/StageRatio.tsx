import Image from 'next/image'
import React from 'react'
import type { BrewMethod } from "@/lib/content";
import { RowIcon } from './icon/RowIcon';

interface StageRatioProps {
    robusta: number;
    arabica: number;
    setRobusta: (value: number) => void;
    selectedMethod: BrewMethod | null;
    setStage: (stage: number) => void;
}

/* ------------------------------------------------------------------ *
 * Ratio marker labels — declared OUTSIDE the component
 * ------------------------------------------------------------------ */
const RATIO_MARKERS = [
    { value: "100%", sub: "روبستا" },
    { value: "75/25", sub: "" },
    { value: "50/50", sub: "" },
    { value: "25/75", sub: "" },
    { value: "100%", sub: "عربیکا" },
];

function RatioLabels({ small = false }: { small?: boolean }) {
    return (
        <div
            className={`mt-4 flex w-full justify-between ${small ? "text-[9px]" : "text-[10px]"
                } font-medium text-caramel/80`}
            dir="rtl"
        >
            {RATIO_MARKERS.map((m, i) => (
                <div key={i} className="flex flex-col items-center leading-tight">
                    <span>{m.value}</span>
                    {m.sub && (
                        <span className="mt-0.5 text-caramel/60">{m.sub}</span>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * Main component
 * ------------------------------------------------------------------ */
export default function StageRatio({
    robusta,
    arabica,
    setRobusta,
    selectedMethod,
    setStage,
}: StageRatioProps) {
    // Keep ratio/mobile renders as render-prop variables so the layout
    // branching can be done purely with responsive wrappers (no window sniff).
    const renderMobile = (
        <div className="absolute inset-x-0 bottom-19 z-10 flex max-h-[min(62vh,520px)] flex-col gap-2 overflow-y-auto px-3 pb-2 hide-scrollbar md:hidden">
            <div className="mx-auto flex w-full items-center justify-between gap-4">
                <Image src="/images/bean-robusta.png" alt="Robusta" width={150} height={110} className="h-12 w-auto object-contain sm:h-15" />
                <Image src="/images/bean-arabica.png" alt="Arabica" width={150} height={110} className="h-12 w-auto object-contain sm:h-15" />
            </div>

            <div className="mx-auto flex w-fit gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-ink shadow-sm">
                <span>{robusta}% روبستا</span>
                <span className="text-ink/30">·</span>
                <span>{arabica}% عربیکا</span>
            </div>

            <div className="rounded-2xl bg-coffee-900 px-4 py-4 shadow-lg">
                <div className="relative flex w-full items-center justify-center pt-2">
                    <div
                        className="absolute -top-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-roast px-2 py-0.5 text-[10px] font-bold text-white shadow"
                        style={{ left: `${robusta}%` }}
                    >
                        {robusta}% · {arabica}%
                    </div>
                    <div className="mb-2 flex w-full justify-between px-1 text-[10px] font-extrabold text-caramel">
                        <span style={{ opacity: robusta <= 20 ? 0.2 : robusta < 45 ? 0.55 : 1 }}>
                            روبستا
                        </span>
                        <span style={{ opacity: robusta >= 80 ? 0.2 : robusta > 55 ? 0.55 : 1 }}>
                            عربیکا
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={10}
                        value={robusta}
                        onChange={(e) => setRobusta(Number(e.target.value))}
                        aria-label="نسبت روبستا به عربیکا"
                        aria-valuetext={`${robusta} درصد روبستا، ${arabica} درصد عربیکا`}
                        className="ratio-range absolute top-5 w-full touch-pan-y"
                    />
                </div>
                <RatioLabels small />
            </div>

            <div className="rounded-2xl bg-coffee-900 p-3 text-white shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-caramel">نتیجه انتخاب شما</h4>
                    <PencilIcon className="h-3.5 w-3.5 text-caramel/80" />
                </div>
                <dl className="divide-y divide-white/10 text-[10px]">
                    <SummaryRow icon="device" label="دستگاه" value={selectedMethod?.name} />
                    <SummaryRow icon="blend" label="ترکیب" value={`${robusta}% روبستا / ${arabica}% عربیکا`} />
                    <SummaryRow icon="pour" label="روش دم‌آوری" value={selectedMethod?.name} />
                    <SummaryRow icon="amount" label="میزان مصرف" value="—" />
                    <SummaryRow icon="taste" label="سلیقه و طعم" />
                </dl>
            </div>

            <div className="rounded-2xl bg-coffee-900 p-3 text-white shadow-lg">
                <h4 className="mb-1 text-xs font-bold text-caramel">تمای داری خودت پیشنهاد بده</h4>
                <p className="mb-2 text-[0.7rem] leading-relaxed text-white/70">
                    اجازه بده دمیو ما بهترین ترکیبو بر اساس توار پیشنهاد کند
                </p>
                <button
                    type="button"
                    className="mx-auto flex min-h-9 items-center gap-1.5 rounded-full border border-caramel/60 bg-transparent px-4 py-1.5 text-[10px] font-semibold text-caramel transition hover:bg-caramel/10 active:scale-95"
                >
                    <span>پیشنهاد بده</span>
                    <PencilIcon className="h-3 w-3" />
                </button>
            </div>
        </div>
    );

    const renderDesktop = (
        <>
            <div className="absolute bottom-[6%] left-1/2 z-10 hidden w-full max-w-[min(92vw,44rem)] -translate-x-1/2 flex-col gap-3 md:flex">
                <div className="flex items-center justify-between">
                    <Image src="/images/bean-robusta.png" alt="" width={150} height={110} className="h-16 w-auto sm:h-20" />
                    <Image src="/images/bean-arabica.png" alt="" width={150} height={110} className="h-16 w-auto sm:h-20" />
                </div>

                <div className="mx-auto flex w-fit gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-sm">
                    <span>{robusta} درصد روبستا</span>
                    <span className="text-ink/30">·</span>
                    <span>{arabica} درصد عربیکا</span>
                </div>

                <div className="rounded-3xl bg-coffee-900 px-6 py-5 shadow-lg">
                    <div className="relative flex w-full items-center justify-center pt-2">
                        <div
                            className="absolute -top-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-roast px-2 py-1 text-xs font-bold text-white shadow"
                            style={{ left: `${robusta}%` }}
                        >
                            {robusta}% · {arabica}%
                        </div>
                        <div className="mb-1 flex w-full justify-between text-xs font-extrabold text-caramel">
                            <span style={{ opacity: robusta <= 20 ? 0.2 : robusta < 45 ? 0.55 : 1 }}>
                                روبستا
                            </span>
                            <span style={{ opacity: robusta >= 80 ? 0.2 : robusta > 55 ? 0.55 : 1 }}>
                                عربیکا
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={10}
                            value={robusta}
                            onChange={(e) => setRobusta(Number(e.target.value))}
                            aria-label="نسبت روبستا به عربیکا"
                            aria-valuetext={`${robusta} درصد روبستا، ${arabica} درصد عربیکا`}
                            className="ratio-range absolute top-4 w-full"
                        />
                    </div>
                    <RatioLabels />
                </div>
            </div>

            <div className="absolute right-[3%] top-1/2 hidden w-full max-w-xs -translate-y-1/2 flex-col gap-3 md:flex">
                <div className="rounded-3xl bg-[#f5efe6] p-4 text-center shadow-lg">
                    <p className="mb-3 text-xs font-semibold text-ink/60">دستگاه انتخاب شده</p>
                    <div className="mb-3 flex items-center justify-center gap-4">
                        {selectedMethod ? (
                            <Image
                                src={selectedMethod.image}
                                alt={selectedMethod.name}
                                width={90}
                                height={160}
                                className="h-24 w-auto object-contain"
                            />
                        ) : (
                            <span className="grid h-24 w-24 place-items-center text-ink/20" aria-hidden>—</span>
                        )}
                        <div className="text-right">
                            <h4 className="text-lg font-extrabold text-ink">{selectedMethod?.name}</h4>
                            {selectedMethod?.description && (
                                <p className="mt-1 max-w-40 text-[0.7rem] leading-relaxed text-ink/70">
                                    {selectedMethod?.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setStage(1)}
                        className="mx-auto flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/70 px-3 py-1.5 text-[0.7rem] font-semibold text-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                    >
                        <span>تغییر دستگاه</span>
                        <PencilIcon className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="rounded-3xl bg-coffee-900 p-4 text-white shadow-lg">
                    <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-caramel">نتیجه انتخاب شما</h4>
                        <PencilIcon className="h-4 w-4 text-caramel/80" />
                    </div>
                    <dl className="divide-y divide-white/10 text-xs">
                        <SummaryRow icon="device" label="دستگاه" value={selectedMethod?.name} />
                        <SummaryRow icon="blend" label="ترکیب" value={`${robusta}% روبستا / ${arabica}% عربیکا`} />
                        <SummaryRow icon="pour" label="روش دم‌آوری" value={selectedMethod?.name} />
                        <SummaryRow icon="amount" label="میزان مصرف" value="—" />
                        <SummaryRow icon="taste" label="سلیقه و طعم" />
                    </dl>
                </div>

                <div className="rounded-3xl bg-coffee-900 p-4 text-white shadow-lg">
                    <h4 className="mb-1 text-sm font-bold text-caramel">تمای داری خودت پیشنهاد بده</h4>
                    <p className="mb-3 text-[0.7rem] leading-relaxed text-white/70">
                        اجازه بده دمیو ما بهترین ترکیبو بر اساس توار پیشنهاد کند
                    </p>
                    <button
                        type="button"
                        className="mx-auto flex min-h-9 items-center gap-1.5 rounded-full border border-caramel/60 bg-transparent px-4 py-1.5 text-xs font-semibold text-caramel transition hover:bg-caramel/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                    >
                        <span>پیشنهاد بده</span>
                        <PencilIcon className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile layout — in normal flow under the content stack */}
            <div className="md:hidden">{renderMobile}</div>

            {/* Desktop layout — anchored panels over the scene */}
            <div className="hidden md:contents">{renderDesktop}</div>
        </>
    );
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z" />
        </svg>
    );
}

function SummaryRow({
    icon,
    label,
    value,
}: {
    icon: "device" | "blend" | "pour" | "amount" | "taste";
    label: string;
    value?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3 py-1.5">
            <dt className="flex items-center gap-1.5 text-white/60">
                <RowIcon name={icon} />
                <span>{label}</span>
            </dt>
            <dd className="text-left font-semibold text-white">{value ?? "—"}</dd>
        </div>
    );
}