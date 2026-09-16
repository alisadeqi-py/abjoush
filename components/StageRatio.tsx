import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import type { BrewMethod } from "@/lib/content";
import { RowIcon } from './icon/RowIcon';

interface StageRatioProps {
    robusta: number;
    arabica: number;
    setRobusta: (value: number) => void;
    selectedMethod: BrewMethod | null;
    setStage: (stage: number) => void;
}

export default function StageRatio({
    robusta,
    arabica,
    setRobusta,
    selectedMethod,
    setStage,
}: StageRatioProps) {
    // 1. Proper mobile detection to avoid hydration mismatch
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile(); // Check on mount
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const renderMobile = (
        <div className="absolute bottom-0 left-0 w-full z-10 flex flex-col gap-3 px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] max-h-[75vh] overflow-y-auto hide-scrollbar">
            {/* Bean Bags & Slider Container */}
            <div className="w-full mx-auto">
                <div className="flex items-center justify-between gap-6">
                    <Image src="/images/bean-robusta.png" alt="Robusta" width={150} height={110} className="h-15 w-auto object-contain" />
                    <Image src="/images/bean-arabica.png" alt="Arabica" width={150} height={110} className="h-15 w-auto object-contain" />
                </div>

                <div className="mx-auto mb-3 flex w-fit gap-2 rounded-md bg-white px-3 py-1 text-[10px] font-semibold text-black shadow-sm">
                    <span>{robusta}% روبستا</span>
                    <span>{arabica}% عربیکا</span>
                </div>

                <div className="rounded-2xl bg-mauve-900 px-4 py-4 shadow-lg">
                    <div className="relative flex w-full items-center justify-center">
                        <div
                            className="absolute -top-5 -translate-x-1/2 rounded-md bg-roast px-2 py-0.5 text-[10px] text-white whitespace-nowrap"
                            style={{ left: `${robusta}%` }}
                        >
                            {robusta}% {arabica}%
                        </div>
                        <div className="mb-2 flex w-full justify-between text-[10px] font-extrabold text-caramel px-1">
                            <span style={{ opacity: robusta <= 20 ? 0.1 : robusta < 45 ? 0.5 : 1 }}>
                                روبستا
                            </span>
                            <span style={{ opacity: robusta >= 80 ? 0.1 : robusta > 55 ? 0.5 : 1 }}>
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
                            className="ratio-range absolute top-4 w-full touch-pan-y"
                        />
                    </div>
                </div>
            </div>

            {/* Summary Cards (Visible on Mobile) */}
            <div className="w-full flex flex-col gap-2">


                {/* Card 2: Summary */}
                <div className="rounded-2xl bg-[#1a1512] p-3 text-white shadow-lg">
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

                {/* Card 3: Custom Suggestion */}
                <div className="rounded-2xl bg-[#1a1512] p-3 text-white shadow-lg mb-2">
                    <h4 className="mb-1 text-xs font-bold text-caramel">تمای داری خودت پیشنهاد بده</h4>
                    <p className="mb-2 text-[9px] leading-relaxed text-white/70">
                        اجازه بده دمیو ما بهترین ترکیبو بر اساس توار پیشنهاد کند
                    </p>
                    <button
                        type="button"
                        className="mx-auto flex items-center gap-1.5 rounded-full border border-caramel/60 bg-transparent px-4 py-1.5 text-[10px] font-semibold text-caramel transition hover:bg-caramel/10 active:scale-95"
                    >
                        <span>پیشنهاد بده</span>
                        <PencilIcon className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderDesktop = (
        <>
            <div className="absolute bottom-[6%] left-1/2 z-10 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-176">
                <div className="mb-2 flex items-center justify-around">
                    <Image src="/images/bean-robusta.png" alt="" width={150} height={110} className="h-16 w-auto sm:h-20" />
                    <Image src="/images/bean-arabica.png" alt="" width={150} height={110} className="h-16 w-auto sm:h-20" />
                </div>

                <div className="mx-auto mb-2 flex w-fit gap-2 rounded-md bg-white px-3 py-1 text-xs font-semibold">
                    <span>{robusta} درصد روبستا</span>
                    <span>{arabica} درصد عربیکا</span>
                </div>

                <div className="rounded-3xl bg-mauve-900 px-6 py-5">
                    <div className="relative flex w-full items-center justify-center">
                        <div
                            className="absolute -top-6 -translate-x-1/2 rounded-md bg-roast px-2 py-1 text-xs text-white"
                            style={{ left: `${robusta}%` }}
                        >
                            {robusta} % {arabica}
                        </div>
                        <div className="mb-1 flex w-full justify-between text-xs font-extrabold text-caramel">
                            <span style={{ opacity: robusta <= 20 ? 0.1 : robusta < 45 ? 0.5 : 1 }}>
                                روبستا
                            </span>
                            <span style={{ opacity: robusta >= 80 ? 0.1 : robusta > 55 ? 0.5 : 1 }}>
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
                            className="ratio-range absolute top-3 w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="md:flex absolute top-1/2 -translate-y-1/2 w-full my-auto right-[5%] hidden max-w-xs flex-col gap-3">
                {/* Card 1: selected device */}
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

                {/* Card 2: summary */}
                <div className="rounded-3xl bg-[#1a1512] p-4 text-white shadow-lg">
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

                {/* Card 3: custom suggestion */}
                <div className="rounded-3xl bg-[#1a1512] p-4 text-white shadow-lg">
                    <h4 className="mb-1 text-sm font-bold text-caramel">تمای داری خودت پیشنهاد بده</h4>
                    <p className="mb-3 text-[0.7rem] leading-relaxed text-white/70">
                        اجازه بده دمیو ما بهترین ترکیبو بر اساس توار پیشنهاد کند
                    </p>
                    <button
                        type="button"
                        className="mx-auto flex items-center gap-1.5 rounded-full border border-caramel/60 bg-transparent px-4 py-1.5 text-xs font-semibold text-caramel transition hover:bg-caramel/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                    >
                        <span>پیشنهاد بده</span>
                        <PencilIcon className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </>
    );

    // 2. Fixed the return statement syntax
    return isMobile ? renderMobile : renderDesktop;
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