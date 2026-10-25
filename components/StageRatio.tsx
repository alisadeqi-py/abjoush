"use client";

import Image from "next/image";
import React, { useCallback, useRef } from "react";

import type { BrewMethod } from "@/lib/content";
import { RowIcon } from "./icon/RowIcon";
import { PencilIcon } from "./icon/PencilIcon";

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

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

/** Ordered left→right visually: left = 100% robusta, right = 100% arabica */
const RATIO_MARKERS = [
    { value: "100%", sub: "روبستا", robusta: 100 },
    { value: "80/20", sub: "", robusta: 80 },
    { value: "75/25", sub: "", robusta: 75 },
    { value: "70/30", sub: "", robusta: 70 },
    { value: "50/50", sub: "", robusta: 50 },
    { value: "30/70", sub: "", robusta: 30 },
    { value: "25/75", sub: "", robusta: 25 },
    { value: "20/80", sub: "", robusta: 20 },
    { value: "100%", sub: "عربیکا", robusta: 0 },
];

function RatioLabels({
    small = false,
    onChange,
}: {
    small?: boolean;
    onChange?: (robusta: number) => void;
}) {
    return (
        <div
            className={`mt-4 flex w-full justify-between ${small ? "text-[9px]" : "text-[10px]"
                } font-medium text-caramel/80`}
        >
            {RATIO_MARKERS.map((m, i) => {
                const interactive = Boolean(onChange);
                const content = (
                    <>
                        <span>{m.value}</span>
                        {m.sub && <span className="mt-0.5 text-caramel/60">{m.sub}</span>}
                    </>
                );

                return interactive ? (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onChange!(m.robusta)}
                        className="flex min-w-0 flex-col items-center rounded px-1 leading-tight transition hover:text-caramel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                        aria-label={`تنظیم نسبت روی ${m.value}${m.sub ? ` ${m.sub}` : ""}`}
                    >
                        {content}
                    </button>
                ) : (
                    <div key={i} className="flex flex-col items-center leading-tight">
                        {content}
                    </div>
                );
            })}
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * RatioSlider — custom, RTL-aware, browser-consistent
 * ------------------------------------------------------------------ *
 * Visual mapping:
 *   left edge  = 100% robusta / 0% arabica
 *   right edge = 0% robusta / 100% arabica
 * ------------------------------------------------------------------ */

const STEPS = 5; // granularity (in %). Original used 10; 5 feels smoother on drag.

interface RatioSliderProps {
    value: number; // 0–100, robusta %
    onChange: (v: number) => void;
    ariaLabel?: string;
}

function RatioSlider({
    value,
    onChange,
    ariaLabel = "نسبت روبستا به عربیکا",
}: RatioSliderProps) {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const draggingRef = useRef(false);

    const valueFromClientX = useCallback((clientX: number) => {
        const el = trackRef.current;
        if (!el) return value;
        const rect = el.getBoundingClientRect();
        const raw = (clientX - rect.left) / rect.width; // 0 = left, 1 = right
        const clamped = Math.min(1, Math.max(0, raw));
        const rtlFraction = 1 - clamped; // left = 100% robusta
        const snapped = Math.round((rtlFraction * 100) / STEPS) * STEPS;
        return Math.min(100, Math.max(0, snapped));
    }, [value]);

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        draggingRef.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        onChange(valueFromClientX(e.clientX));
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!draggingRef.current) return;
        onChange(valueFromClientX(e.clientX));
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        draggingRef.current = false;
        try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
            /* capture may have been lost already */
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const map: Record<string, number> = {
            ArrowLeft: +STEPS,
            ArrowRight: -STEPS,
            ArrowUp: +STEPS,
            ArrowDown: -STEPS,
            PageUp: +STEPS * 2,
            PageDown: -STEPS * 2,
        };
        if (e.key in map) {
            e.preventDefault();
            onChange(Math.min(100, Math.max(0, value + map[e.key])));
        } else if (e.key === "Home") {
            e.preventDefault();
            onChange(0);
        } else if (e.key === "End") {
            e.preventDefault();
            onChange(100);
        }
    };

    const arabica = 100 - value;
    const thumbPct = 100 - value; // visual left offset
    const arabicaPct = 100 - value; // arabica fill from left

    return (
        <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label={ariaLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            aria-valuetext={`${value} درصد روبستا، ${arabica} درصد عربیکا`}
            aria-orientation="horizontal"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
            className="group relative flex h-10 w-full cursor-pointer touch-none items-center select-none focus-visible:outline-none"
        >
            {/* Visible track */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/15">
                {/* Arabica fill (from left) */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-amber-400 to-amber-300"
                    style={{ width: `${arabicaPct}%` }}
                />
                {/* Robusta fill (from right) */}
                <div
                    className="absolute inset-y-0 right-0 rounded-full bg-linear-to-l from-orange-700 to-orange-600"
                    style={{ width: `${100 - arabicaPct}%` }}
                />
            </div>

            {/* Tick marks */}
            <div className="pointer-events-none absolute inset-x-0 flex justify-between px-0.5">
                {Array.from({ length: 11 }).map((_, i) => (
                    <span key={i} className="h-1.5 w-px bg-white/25" aria-hidden />
                ))}
            </div>

            {/* Thumb */}
            <div
                className="pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 group-focus-visible:scale-110 group-active:scale-110"
                style={{ left: `${thumbPct}%` }}
            >
                <div className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-roast shadow-lg ring-2 ring-black/30">
                    <div className="h-2.5 w-2.5 rounded-full bg-white/90" />
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * Summary row
 * ------------------------------------------------------------------ */

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
    /* ---------------- Mobile layout ---------------- */
    const renderMobile = (
        <div className="absolute inset-x-0 bottom-19 z-10 flex max-h-[min(62vh,520px)] flex-col gap-2 overflow-y-auto px-3 pb-2 hide-scrollbar md:hidden">
            <div className="mx-auto flex w-full items-center justify-between gap-4">
                <Image
                    src="/images/bean-robusta.png"
                    alt="Robusta"
                    width={150}
                    height={110}
                    className="h-12 w-auto object-contain sm:h-15"
                />
                <Image
                    src="/images/bean-arabica.png"
                    alt="Arabica"
                    width={150}
                    height={110}
                    className="h-12 w-auto object-contain sm:h-15"
                />
            </div>

            <div className="mx-auto flex w-fit gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-ink shadow-sm">
                <span>{arabica}% روبستا</span>
                <span className="text-ink/30">·</span>
                <span>{robusta}% عربیکا</span>
            </div>

            <div className="rounded-2xl bg-coffee-900 px-4 py-4 shadow-lg">
                <div className="mb-2 flex w-full justify-between px-1 text-[10px] font-extrabold text-caramel">
                    <span style={{ opacity: robusta <= 20 ? 0.2 : robusta < 45 ? 0.55 : 1 }}>
                        روبستا
                    </span>
                    <span style={{ opacity: robusta >= 80 ? 0.2 : robusta > 55 ? 0.55 : 1 }}>
                        عربیکا
                    </span>
                </div>

                <div className="relative">
                    {/* Tooltip — clamped so it never overflows */}
                    <div
                        className="pointer-events-none absolute -top-6 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-roast px-2 py-0.5 text-[10px] font-bold text-white shadow transition-[left] duration-75"
                        style={{
                            left: `clamp(2rem, ${100 - robusta}%, calc(100% - 2rem))`,
                        }}
                    >
                        {robusta}% · {arabica}%
                    </div>
                    <RatioSlider value={robusta} onChange={setRobusta} />
                </div>

                <RatioLabels small onChange={setRobusta} />
            </div>

            <div className="rounded-2xl bg-coffee-900 p-3 text-white shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-caramel">نتیجه انتخاب شما</h4>
                    <PencilIcon className="h-3.5 w-3.5 text-caramel/80" />
                </div>
                <dl className="divide-y divide-white/10 text-[10px]">
                    <SummaryRow icon="device" label="دستگاه" value={selectedMethod?.name} />
                    <SummaryRow
                        icon="blend"
                        label="ترکیب"
                        value={`${robusta}% روبستا / ${arabica}% عربیکا`}
                    />
                    <SummaryRow icon="pour" label="روش دم‌آوری" value={selectedMethod?.name} />
                    <SummaryRow icon="amount" label="میزان مصرف" value="—" />
                    <SummaryRow icon="taste" label="سلیقه و طعم" />
                </dl>
            </div>

            <div className="rounded-2xl bg-coffee-900 p-3 text-white shadow-lg">
                <h4 className="mb-1 text-xs font-bold text-caramel">
                    تمای داری خودت پیشنهاد بده
                </h4>
                <p className="mb-2 text-[0.7rem] leading-relaxed text-white/70">
                    اجازه بده دمیو ما بهترین ترکیبو بر اساس توار پیشنهاد کند
                </p>
                <button
                    type="button"
                    className="mx-auto flex min-h-9 items-center gap-1.5 rounded-full border border-caramel/60 bg-transparent px-4 py-1.5 text-[10px] font-semibold text-caramel transition hover:bg-caramel/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                >
                    <span>پیشنهاد بده</span>
                    <PencilIcon className="h-3 w-3" />
                </button>
            </div>
        </div>
    );

    /* ---------------- Desktop layout ---------------- */
    const renderDesktop = (
        <>
            <div className="absolute bottom-[6%] left-1/2 z-10 hidden w-full max-w-[min(92vw,44rem)] -translate-x-1/2 flex-col gap-3 md:flex">
                <div className="flex items-center justify-around">
                    <Image
                        src="/images/bean-robusta.png"
                        alt=""
                        width={150}
                        height={110}
                        className="h-16 w-auto sm:h-20"
                    />
                    <Image
                        src="/images/bean-arabica.png"
                        alt=""
                        width={150}
                        height={110}
                        className="h-16 w-auto sm:h-20"
                    />
                </div>

                <div className="mx-auto flex w-fit gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-sm">
                    <span>{robusta} درصد روبستا</span>
                    <span className="text-ink/30">·</span>
                    <span>{arabica} درصد عربیکا</span>
                </div>

                <div className="rounded-3xl bg-coffee-900 px-6 py-5 shadow-lg">
                    <div className="mb-1 flex w-full justify-between text-xs font-extrabold text-caramel">
                        <span style={{ opacity: robusta <= 20 ? 0.2 : robusta < 45 ? 0.55 : 1 }}>
                            روبستا
                        </span>
                        <span style={{ opacity: robusta >= 80 ? 0.2 : robusta > 55 ? 0.55 : 1 }}>
                            عربیکا
                        </span>
                    </div>

                    <div className="relative pt-3">
                        {/* Tooltip */}
                        <div
                            className="pointer-events-none absolute -top-2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-roast px-2 py-1 text-xs font-bold text-white shadow transition-[left] duration-75"
                            style={{
                                left: `clamp(2.5rem, ${100 - robusta}%, calc(100% - 2.5rem))`,
                            }}
                        >
                            {robusta}% · {arabica}%
                        </div>
                        <RatioSlider value={robusta} onChange={setRobusta} />
                    </div>

                    <RatioLabels onChange={setRobusta} />
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
                            <span
                                className="grid h-24 w-24 place-items-center text-ink/20"
                                aria-hidden
                            >
                                —
                            </span>
                        )}
                        <div className="text-right">
                            <h4 className="text-lg font-extrabold text-ink">
                                {selectedMethod?.name}
                            </h4>
                            {selectedMethod?.description && (
                                <p className="mt-1 max-w-40 text-[0.7rem] leading-relaxed text-ink/70">
                                    {selectedMethod.description}
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
                        <SummaryRow
                            icon="blend"
                            label="ترکیب"
                            value={`${robusta}% روبستا / ${arabica}% عربیکا`}
                        />
                        <SummaryRow icon="pour" label="روش دم‌آوری" value={selectedMethod?.name} />
                        <SummaryRow icon="amount" label="میزان مصرف" value="—" />
                        <SummaryRow icon="taste" label="سلیقه و طعم" />
                    </dl>
                </div>

                <div className="rounded-3xl bg-coffee-900 p-4 text-white shadow-lg">
                    <h4 className="mb-1 text-sm font-bold text-caramel">
                        تمای داری خودت پیشنهاد بده
                    </h4>
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
            <div className="md:hidden">{renderMobile}</div>
            <div className="hidden md:contents">{renderDesktop}</div>
        </>
    );
}