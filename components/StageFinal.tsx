"use client";

import Image from "next/image";
import React from "react";

import type { BrewMethod, Origin } from "@/lib/content";

/* ------------------------------------------------------------------ *
 * Dummy assets
 * ------------------------------------------------------------------ */

function dummyBag(): string {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 220">
      <defs>
        <linearGradient id="bagBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2a1c14"/>
          <stop offset="100%" stop-color="#150d09"/>
        </linearGradient>
        <linearGradient id="label" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e0b25e"/>
          <stop offset="100%" stop-color="#b8853a"/>
        </linearGradient>
      </defs>
      <path d="M40 40h80v150a10 10 0 0 1-10 10H50a10 10 0 0 1-10-10z" fill="url(#bagBody)"/>
      <path d="M40 40l10-18h60l10 18z" fill="#2a1c14"/>
      <rect x="55" y="70" width="50" height="70" rx="6" fill="url(#label)"/>
      <circle cx="80" cy="100" r="18" fill="#f5efe6"/>
      <text x="80" y="106" font-size="18" text-anchor="middle"
            font-family="system-ui, sans-serif" fill="#1f1410">☕</text>
    </svg>
  `.trim();
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function dummyFlag(): string {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect width="32" height="11" fill="#fcd116" />
      <rect y="11" width="32" height="10" fill="#003893" />
      <rect y="21" width="32" height="11" fill="#ce1126" />
    </svg>
  `.trim();
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const DUMMY_BAG = dummyBag();
const DUMMY_FLAG = dummyFlag();

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

interface SummaryProps {
    selectedMethod: BrewMethod | null;
    selectedOrigin: Origin | null;
    robusta: number;
    arabica: number;
    selectedTasteLabel?: string;
    selectedConsumptionRange?: string;
    onEditDevice?: () => void;
    onEditOrigin?: () => void;
    onEditTaste?: () => void;
    onEditConsumption?: () => void;
    onContinue: () => void;
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function StageFinal({
    selectedMethod,
    selectedOrigin,
    robusta,
    arabica,
    selectedTasteLabel,
    selectedConsumptionRange,
    onEditDevice,
    onEditOrigin,
    onEditTaste,
    onEditConsumption,
    onContinue,
}: SummaryProps) {
    return (
        <section
            aria-label="خلاصه سفارش"
            // Removed absolute positioning, using flex to push the button to the bottom
            className="absolute inset-x-0 bottom-0 z-10 flex flex-col h-full"
        >
            {/* --- Scrollable Content Area (Cards) --- */}
            <div className="flex-1 overflow-y-auto px-3 pt-6 pb-4 sm:px-6 hide-scrollbar content-end">
                <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* --- Product Card --- */}
                    <article
                        aria-label="قهوه پیشنهادی"
                        className="group relative overflow-hidden rounded-3xl md:w-md w-full border border-white/40 bg-linear-to-b from-[#fbf6ec] to-[#efe4d0] p-5 shadow-2xl ring-1 ring-black/5 md:order-2"
                    >
                        <span className="absolute -left-10 top-5 -rotate-45 bg-caramel px-10 py-1 text-[0.6rem] font-extrabold text-white shadow-md">
                            ویژه
                        </span>

                        <div className="mb-4 flex items-center justify-center gap-2">
                            <SparkleIcon className="h-3 w-3 text-caramel" />
                            <span className="text-[0.75rem] font-bold tracking-wide text-ink/70">
                                پیشنهاد ما برای شما
                            </span>
                            <SparkleIcon className="h-3 w-3 text-caramel" />
                        </div>

                        <div className="flex flex-row gap-4">
                            <div className="flex flex-1 flex-col text-right">
                                <div className="mb-1 flex items-center justify-start gap-2">
                                    <h2 className="text-lg font-extrabold text-ink">قهوه کلمبیا</h2>
                                    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[0.6rem] font-bold text-ink/70">
                                        تازه‌رست
                                    </span>
                                </div>

                                <p className="mb-3 text-[0.7rem] font-semibold text-ink/60">
                                    {toFa(arabica)}٪ عربیکا · {toFa(robusta)}٪ روبستا
                                </p>

                                <div className="mb-3 flex flex-wrap justify-start gap-1.5">
                                    {["شکلاتی", "آجیلی"].map((tag) => (
                                        <span key={tag} className="rounded-full border border-caramel/30 bg-caramel/10 px-2.5 py-1 text-[0.65rem] font-semibold text-ink">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <p className="mb-4 text-[0.7rem] leading-relaxed text-ink/70">
                                    با طعمی متعادل و بدنه‌ای گرم، انتخابی عالی برای افرادی است که به دنبال ترکیبی اصیل و خوش‌عطر هستند.
                                </p>

                                <ul className="mb-4 space-y-1.5 text-[0.7rem]">
                                    {[
                                        { label: "شیرینی", value: 3 },
                                        { label: "اسیدیته", value: 2 },
                                        { label: "تلخی", value: 1 },
                                        { label: "بدنه", value: 3 },
                                    ].map((row) => (
                                        <li key={row.label} className="flex items-center justify-between gap-3">
                                            <span className="w-12 shrink-0 text-ink/70">{row.label}</span>
                                            <span className="flex flex-1 gap-1">
                                                {[0, 1, 2].map((i) => (
                                                    <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < row.value ? "bg-caramel" : "bg-ink/10"}`} />
                                                ))}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink/10 pt-3">
                                    <span className="text-[0.65rem] font-semibold text-ink/60">بهترین روش: اسپرسو</span>
                                    <CoffeeMachineIcon className="h-5 w-5 text-ink/40" />
                                </div>
                            </div>

                            <div className="relative mx-auto flex w-24 shrink-0 items-center justify-center sm:w-32">
                                <span aria-hidden className="absolute inset-4 rounded-full bg-caramel/20 blur-2xl" />
                                <Image src={DUMMY_BAG} alt="کیسه قهوه کلمبیا" width={160} height={220} className="relative h-auto w-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-1" unoptimized />
                            </div>
                        </div>
                    </article>

                    {/* --- Summary Card --- */}
                    <aside
                        aria-label="خلاصه انتخاب‌های شما"
                        className="rounded-3xl border border-white/10 md:w-xs w-full bg-linear-to-b from-[#221a15] to-[#15100c] p-5 text-white shadow-2xl ring-1 ring-black/40 backdrop-blur md:order-1"
                    >
                        <header className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-bold tracking-wide text-caramel">خلاصه انتخاب‌های شما</h3>
                            <span className="rounded-full bg-caramel/15 px-2 py-0.5 text-[0.6rem] font-bold text-caramel">۵ مرحله</span>
                        </header>

                        <dl className="divide-y divide-white/5">
                            <SummaryItem icon={<BeanIcon className="h-4 w-4" />} label="ترکیب" value={`${toFa(robusta)}٪ روبستا · ${toFa(arabica)}٪ عربیکا`} onEdit={onEditDevice} />
                            <SummaryItem icon={<CupIcon className="h-4 w-4" />} label="دستگاه" value={selectedMethod?.name ?? "انتخاب نشده"} onEdit={onEditDevice} />
                            <SummaryItem
                                icon={
                                    <span className="grid h-4 w-4 place-items-center overflow-hidden rounded-full ring-1 ring-white/30">
                                        <Image src={DUMMY_FLAG} alt="" width={16} height={16} className="h-full w-full object-cover" unoptimized />
                                    </span>
                                }
                                label="خاستگاه"
                                value={selectedOrigin?.name ?? "انتخاب نشده"}
                                onEdit={onEditOrigin}
                            />
                            <SummaryItem icon={<LeafIcon className="h-4 w-4" />} label="سلیقه و طعم" value={selectedTasteLabel ?? "انتخاب نشده"} onEdit={onEditTaste} />
                            <SummaryItem icon={<BagIcon className="h-4 w-4" />} label="میزان مصرف" value={selectedConsumptionRange ?? "انتخاب نشده"} onEdit={onEditConsumption} />
                        </dl>
                    </aside>
                </div>
            </div>

            {/* --- Fixed CTA Button (Sticks to bottom) --- */}
            <div className="shrink-0 w-full px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 sm:px-6 bg-linear-to-t from-[#0d0a09] via-[#0d0a09]/90 to-transparent">
                <div className="w-full max-w-5xl mx-auto flex justify-center">
                    <button
                        type="button"
                        onClick={onContinue}
                        className="group inline-flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-linear-to-l from-[#1a1512] to-[#2b201a] px-10 py-3.5 text-sm font-extrabold text-cream shadow-2xl ring-1 ring-white/10 transition-all hover:scale-[1.02] hover:shadow-caramel/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/50 active:scale-95"
                    >
                        <span>ادامه و پرداخت</span>
                        <ArrowIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ *
 * Subcomponents
 * ------------------------------------------------------------------ */

function SummaryItem({ icon, label, value, onEdit }: { icon: React.ReactNode; label: string; value: string; onEdit?: () => void; }) {
    const isMissing = value === "انتخاب نشده";
    return (
        <div className="group/row flex items-center gap-3 py-2.5 transition-colors hover:bg-white/[0.03]">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-caramel/10 text-caramel ring-1 ring-caramel/20">{icon}</span>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <dt className="shrink-0 text-[0.7rem] text-white/50">{label}</dt>
                <dd className="flex min-w-0 items-center gap-1.5">
                    <span className={`truncate text-[0.72rem] font-semibold ${isMissing ? "text-white/30" : "text-white"}`}>{value}</span>
                    {onEdit && (
                        <button type="button" onClick={onEdit} aria-label={`ویرایش ${label}`} className="shrink-0 rounded-full p-1 text-white/40 transition hover:bg-caramel/20 hover:text-caramel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel">
                            <PencilIcon className="h-3 w-3" />
                        </button>
                    )}
                </dd>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function toFa(n: number): string {
    return n.toLocaleString("fa-IR");
}

/* ------------------------------------------------------------------ *
 * Icons
 * ------------------------------------------------------------------ */

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (<svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" /></svg>);
}

function BeanIcon(props: React.SVGProps<SVGSVGElement>) {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="12" rx="7" ry="9" transform="rotate(35 12 12)" /><path d="M8 8c2 3 6 5 8 8" /></svg>);
}

function CupIcon(props: React.SVGProps<SVGSVGElement>) {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" /><path d="M16 9h1.5a2.5 2.5 0 0 1 0 5H16" /><path d="M3 21h14" /></svg>);
}

function LeafIcon(props: React.SVGProps<SVGSVGElement>) {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 12-9 0 8-4 12-9 12z" /><path d="M4 20c2-4 6-8 12-10" /></svg>);
}

function BagIcon(props: React.SVGProps<SVGSVGElement>) {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 6h12v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" /><path d="M6 6l2-3h8l2 3" /><rect x="9" y="11" width="6" height="5" rx="1" /></svg>);
}

function CoffeeMachineIcon(props: React.SVGProps<SVGSVGElement>) {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 8h12v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M16 10h2a2 2 0 0 1 0 4h-2" /><path d="M9 4v3M13 4v3M2 22h18" /></svg>);
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z" /></svg>);
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 12H5M12 5l-7 7 7 7" /></svg>);
}