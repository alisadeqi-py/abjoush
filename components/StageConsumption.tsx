"use client";

import Image from "next/image";
import React from "react";

/* ------------------------------------------------------------------ *
 * Dummy assets
 * ------------------------------------------------------------------ */

/**
 * Generates a coffee-bag SVG as a data URI. Swap for a real product photo
 * (`/images/coffee-bag.png`) once assets are ready.
 */
function dummyBag(bagColor: string, beanColor: string, beanCount: number): string {
    const beans = Array.from({ length: beanCount })
        .map((_, i) => {
            const x = 20 + (i % 3) * 8;
            const y = 52 + Math.floor(i / 3) * 6;
            return `<ellipse cx="${x}" cy="${y}" rx="3" ry="2" fill="${beanColor}" />`;
        })
        .join("");

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <path d="M18 18h28v34a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" fill="${bagColor}" />
            <path d="M18 18l4-6h20l4 6z" fill="${bagColor}" opacity="0.75" />
            <rect x="24" y="26" width="16" height="10" rx="1.5" fill="#fff" opacity="0.9" />
            ${beans}
        </svg>
    `.trim();
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const BAG_LIGHT = dummyBag("#a9743f", "#3a2416", 3);
const BAG_MEDIUM = dummyBag("#8b5e3c", "#3a2416", 4);
const BAG_DARK = dummyBag("#4a2f22", "#1f120a", 5);

/* ------------------------------------------------------------------ *
 * Types & data
 * ------------------------------------------------------------------ */

export interface ConsumptionOption {
    id: number;
    /** Short label shown in bold at the top of the card. */
    label: string;
    /** Grams-per-week range shown under the label. */
    range: string;
    /** Longer hint text below the range. */
    hint: string;
    /** Coffee bag image source. */
    image: string;
    /** Number of filled rating dots (0–3). */
    rating: number;
}

interface StageConsumptionProps {
    selectedConsumptionId: number | null;
    onSelectConsumption: (id: number) => void;
}

export const CONSUMPTION_OPTIONS: ConsumptionOption[] = [
    {
        id: 1,
        label: "کم",
        range: "۲۰۰ تا ۲۰۰ گرم",
        hint: "مناسب برای ۱ تا ۲ فنجان در روز",
        image: BAG_LIGHT,
        rating: 1,
    },
    {
        id: 2,
        label: "متوسط",
        range: "۲۰۰ تا ۳۰۰ گرم",
        hint: "مناسب برای ۲ تا ۳ فنجان در روز",
        image: BAG_MEDIUM,
        rating: 2,
    },
    {
        id: 3,
        label: "زیاد",
        range: "۳۰۰ تا ۴۰۰ گرم",
        hint: "مناسب برای ۳ تا ۴ فنجان در روز",
        image: BAG_DARK,
        rating: 3,
    },
    {
        id: 4,
        label: "خیلی زیاد",
        range: "۴۰۰ گرم به بالا",
        hint: "مناسب برای ۴ فنجان یا بیشتر در روز",
        image: BAG_DARK,
        rating: 3,
    },
    {
        id: 5,
        label: "مصرف متفاوتی",
        range: "متغیر",
        hint: "مقدار ثابتی در هفته مصرف نمی‌کنم",
        image: BAG_LIGHT,
        rating: 2,
    },
];

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function StageConsumption({
    selectedConsumptionId,
    onSelectConsumption,
}: StageConsumptionProps) {
    return (
        <div className="absolute inset-x-0 bottom-[6%] z-10 flex max-h-[min(66vh,560px)] flex-col gap-3 overflow-hidden px-3 sm:left-1/2 sm:inset-x-auto sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:px-0">
            {/* ── Info card — collapsible on mobile ─────────────────── */}
            <details className="mx-auto w-full max-w-sm rounded-2xl bg-coffee-900 p-3 text-white shadow-lg sm:max-w-64 sm:[&>summary]:hidden sm:open:block open:block" open>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-bold text-caramel sm:hidden">
                    <span>چرا این مرحله مهم است؟</span>
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-white/80">⌄</span>
                </summary>
                <div className="mt-2 sm:mt-0">
                    <h4 className="mb-1 hidden text-sm font-bold text-caramel sm:block">
                        چرا این مرحله مهم است؟
                    </h4>
                    <p className="text-[0.7rem] leading-relaxed text-white/70">
                        با اطلاع از میزان مصرف هفتگی شما می‌تونیم مقدار مناسب و اقتصادی
                        قهوه رو بهتون پیشنهاد بدیم.
                    </p>
                </div>
            </details>

            {/* ── Title ─────────────────────────────────────────────── */}
            <h3 className="shrink-0 text-center text-sm font-bold text-white drop-shadow sm:text-base">
                میزان مصرف هفتگی شما چقدر است؟
            </h3>

            {/* ── Consumption carousel ──────────────────────────────── */}
            <div
                role="radiogroup"
                aria-label="میزان مصرف هفتگی را انتخاب کنید"
                className="flex min-h-0 flex-1 snap-x snap-mandatory items-stretch gap-3 overflow-x-auto overscroll-x-contain scroll-px-3 px-1 pb-3"
            >
                {CONSUMPTION_OPTIONS.map((option) => {
                    const active = option.id === selectedConsumptionId;
                    return (
                        <button
                            key={option.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => onSelectConsumption(option.id)}
                            className={`group flex shrink-0 snap-center flex-col items-center rounded-2xl border-2 p-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel ${active
                                    ? "border-caramel bg-[#f5efe6] shadow-[0_0_0_3px_rgba(0,0,0,0.4)]"
                                    : "border-white/15 bg-[#f5efe6]/95 hover:border-caramel/50"
                                }`}
                        >
                            {/* Label */}
                            <span
                                className={`mb-2 text-center text-xs font-extrabold ${active ? "text-caramel" : "text-ink"
                                    }`}
                            >
                                {option.label}
                            </span>

                            {/* Coffee bag */}
                            <div className="relative mb-2 flex h-20 w-20 items-center justify-center">
                                <Image
                                    src={option.image}
                                    alt=""
                                    width={80}
                                    height={80}
                                    className="h-full w-auto object-contain"
                                    unoptimized
                                />
                            </div>

                            {/* Range */}
                            <span className="mb-1 text-center text-[0.65rem] font-bold text-ink">
                                {option.range}
                            </span>

                            {/* Hint */}
                            <span className="mb-2 line-clamp-2 text-center text-[0.6rem] leading-relaxed text-ink/60">
                                {option.hint}
                            </span>

                            {/* Rating dots */}
                            <span className="mb-2 flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className={`h-1.5 w-1.5 rounded-full ${i < option.rating
                                                ? active
                                                    ? "bg-caramel"
                                                    : "bg-ink/60"
                                                : "bg-ink/15"
                                            }`}
                                    />
                                ))}
                            </span>

                            {/* Check badge */}
                            <span
                                aria-hidden
                                className={`mt-auto grid h-5 w-5 place-items-center rounded-full transition ${active
                                        ? "bg-caramel text-white ring-2 ring-white/70"
                                        : "border border-ink/20 text-transparent"
                                    }`}
                            >
                                <CheckIcon className="h-3 w-3" />
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Live region for a11y */}
            <p className="sr-only" aria-live="polite">
                {selectedConsumptionId
                    ? `میزان مصرف انتخاب شده: ${CONSUMPTION_OPTIONS.find(
                        (o) => o.id === selectedConsumptionId
                    )?.label ?? ""
                    }`
                    : "میزان مصرفی انتخاب نشده"}
            </p>
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * Icons
 * ------------------------------------------------------------------ */

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}