"use client";

import Image from "next/image";
import React, { useState } from "react";

import {
    ORIGINS,
    type Origin,
    type RatingKey,
    type RatingLevel,
} from "@/lib/content";

/* ------------------------------------------------------------------ *
 * Constants
 * ------------------------------------------------------------------ */

/** The rating levels used by every rating attribute. */
export const RATING_LEVELS: ReadonlyArray<{ key: RatingLevel; label: string }> =
    [
        { key: "low", label: "کم" },
        { key: "medium", label: "متوسط" },
        { key: "good", label: "خوب" },
        { key: "high", label: "زیاد" },
    ];

/** Attributes shown in the ratings preview, in the order they render. */
export const RATING_LABELS: ReadonlyArray<[RatingKey, string]> = [
    ["acidity", "اسیدیته"],
    ["sweetness", "شیرینی"],
    ["bitterness", "تلخی"],
];

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

interface StageOriginProps {
    selectedOrigin: Origin | null;
    onSelectOrigin: (origin: Origin) => void;
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function StageOrigin({
    selectedOrigin,
    onSelectOrigin,
}: StageOriginProps) {
    const [focusedOriginId, setFocusedOriginId] = useState<number | null>(
        selectedOrigin?.id ?? ORIGINS[0]?.id ?? null
    );

    const focusedOrigin =
        ORIGINS.find((o) => o.id === focusedOriginId) ?? ORIGINS[0] ?? null;

    return (
        <div
            className="absolute bottom-[4%] left-1/2 z-10 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-175"
        >
            {/* ── Ratings preview ─────────────────────────────────── */}
            <div className="mx-auto mb-3 w-full max-w-60 md:flex hidden">
                <ul className="flex w-xs -mr-96 flex-col gap-2 rounded-2xl bg-[#1a1512] p-3 text-white shadow-lg">
                    {RATING_LABELS.map(([key, label]) => {
                        const currentValue = focusedOrigin?.[key] ?? "medium";
                        return (
                            <li
                                key={String(key)}
                                className="flex items-center justify-between gap-3"
                            >
                                <div className="flex shrink-0 items-center gap-2">
                                    <RatingIcon
                                        name={key}
                                        className="h-4 w-4 shrink-0 text-caramel/80"
                                    />
                                    <span className="text-xs font-semibold text-white/85">
                                        {label}
                                    </span>
                                </div>

                                <div
                                    role="radiogroup"
                                    aria-label={label}
                                    className="flex flex-1 justify-end gap-1.5"
                                >
                                    {RATING_LEVELS.map((level) => {
                                        const active = currentValue === level.key;
                                        return (
                                            <span
                                                key={level.key}
                                                role="radio"
                                                aria-checked={active}
                                                className={`rounded-lg border px-3 py-1.5 text-center text-[0.7rem] font-semibold transition ${active
                                                        ? "border-caramel bg-caramel/10 text-caramel"
                                                        : "border-white/15 text-white/55"
                                                    }`}
                                            >
                                                {level.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {/* Hint row */}
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-white/5 px-2.5 py-2 text-[0.65rem] leading-relaxed text-white/60">
                    <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caramel/80" />
                    <p>
                        با انتخاب ویژگی‌های دلخواه، دستگاه‌های مناسب به شما
                        پیشنهاد می‌شود.
                    </p>
                </div>
            </div>

            {/* ── Section title ───────────────────────────────────── */}
            <h4 className="mx-auto mb-2 w-fit rounded-xl bg-black/40 px-3 py-1.5 text-center text-xs font-bold text-white backdrop-blur-sm sm:text-sm">
                کشور محل کشت قهوه عربیکا خود را انتخاب نمایید
            </h4>

            {/* ── Origin carousel ─────────────────────────────────── */}
            <div
                role="radiogroup"
                aria-label="خاستگاه عربیکا را انتخاب کنید"
                className="flex snap-x snap-mandatory justify-start gap-3 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-3 scrollbar-hidden"
            >
                {ORIGINS.map((origin) => {
                    const isFocused = focusedOriginId === origin.id;
                    const isSelected = selectedOrigin?.id === origin.id;
                    return (
                        <button
                            key={origin.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onMouseEnter={() => setFocusedOriginId(origin.id)}
                            onFocus={() => setFocusedOriginId(origin.id)}
                            onClick={() => {
                                setFocusedOriginId(origin.id);
                                onSelectOrigin(origin);
                            }}
                            className={`group relative h-56 w-36 shrink-0 snap-center overflow-hidden rounded-2xl border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel sm:h-44 sm:w-30 ${isFocused
                                    ? "border-caramel shadow-[0_0_0_3px_rgba(0,0,0,0.4)]"
                                    : "border-white/15"
                                }`}
                        >
                            {/* Background photo */}
                            <Image
                                src={origin.image}
                                alt={origin.name}
                                fill
                                sizes="144px"
                                className="object-cover transition duration-500 group-hover:scale-105"
                            />

                            {/* Dark gradient */}
                            <span
                                aria-hidden
                                className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/85"
                            />

                            {/* Card content */}
                            <div className="absolute inset-0 flex flex-col items-center px-2 py-3 text-center">
                                {origin.flag && (
                                    <span className="mb-2 grid h-9 w-9 place-items-center overflow-hidden rounded-full ring-2 ring-white/80">
                                        <Image
                                            src={origin.flag}
                                            alt=""
                                            width={40}
                                            height={40}
                                            className="h-full w-full object-cover"
                                        />
                                    </span>
                                )}

                                <h5 className="text-sm font-extrabold text-white">
                                    {origin.name}
                                </h5>

                                {origin.tasting && (
                                    <p className="mt-1.5 whitespace-pre-line text-[0.65rem] leading-relaxed text-white/85">
                                        {origin.tasting}
                                    </p>
                                )}

                                {origin.suitableForIcons &&
                                    origin.suitableForIcons.length > 0 && (
                                        <div className="mt-auto w-full">
                                            <p className="mb-1 text-[0.6rem] font-semibold text-white/70">
                                                مناسب برای:
                                            </p>
                                            <div className="flex items-center justify-center gap-1">
                                                {origin.suitableForIcons.map(
                                                    (iconSrc, i) => (
                                                        <span
                                                            key={i}
                                                            className="grid h-4 w-4 place-items-center rounded-full bg-white/85"
                                                        >
                                                            <Image
                                                                src={iconSrc}
                                                                alt=""
                                                                width={12}
                                                                height={12}
                                                                className="h-3 w-3 object-contain"
                                                            />
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {/* Selected check */}
                            {isSelected && (
                                <span
                                    aria-hidden
                                    className="absolute bottom-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-caramel text-white shadow-md ring-2 ring-white/70"
                                >
                                    <CheckIcon className="h-3.5 w-3.5" />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * Rating type icons (decorative — one per rating attribute)
 * ------------------------------------------------------------------ */

function RatingIcon({
    name,
    className,
}: React.SVGProps<SVGSVGElement> & { name: RatingKey }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {name === "acidity" && (
                <path d="M12 2c-3.3 0-6 2.7-6 6 0 3.3 6 7.5 6 7.5s6-4.2 6-7.5C18 4.7 15.3 2 12 2z" />
            )}
            {name === "sweetness" && (
                <path d="M12 2l2.5 7.5H22l-5 4 2.5 7.5-5-4-5 4 2.5-7.5L4 9.5h9.5z" />
            )}
            {name === "bitterness" && (
                <>
                    <path d="M5 12c0-3.8 3.2-7 7-7s7 3.2 7 7-3.2 7-7 7-7-3.2-7-7z" />
                    <path d="M9 9c1.2 2.2 3.3 3.7 5.6 4" />
                    <path d="M15 9c-1.2-2.2-3.3-3.7-5.6-4" />
                </>
            )}
            {name !== "acidity" && name !== "sweetness" && name !== "bitterness" && (
                <circle cx="12" cy="12" r="3" />
            )}
        </svg>
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

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v4h1" />
        </svg>
    );
}
