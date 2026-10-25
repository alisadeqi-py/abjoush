"use client";

import Image from "next/image";
import React, { useState } from "react";

import {
    ORIGINS,
    type Origin,
    type RatingKey,
    type RatingLevel,
} from "@/lib/content";
import { CheckIcon } from "./icon/CheckIcon";
import { RatingIcon } from "./icon/RatingIcon";
import { InfoIcon } from "./icon/InfoIcon";

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
    isOriginA?: boolean

}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function StageOrigin({
    selectedOrigin,
    onSelectOrigin,
    isOriginA
}: StageOriginProps) {
    const [focusedOriginId, setFocusedOriginId] = useState<number | null>(
        selectedOrigin?.id ?? ORIGINS[0]?.id ?? null
    );

    const focusedOrigin =
        ORIGINS.find((o) => o.id === focusedOriginId) ?? ORIGINS[0] ?? null;

    return (
        <div className="absolute inset-x-0 bottom-[5%] z-10 flex max-h-[min(68vh,560px)] flex-col gap-3 overflow-hidden px-3 sm:inset-x-auto sm:left-1/2 sm:max-h-none sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:px-0">
            {/* ── Ratings preview — collapsible on mobile so carousel stays reachable ── */}
            <details className="mx-auto w-full max-w-sm rounded-2xl bg-coffee-900 p-3 text-white shadow-lg sm:max-w-none sm:bg-coffee-900 sm:[&>summary]:hidden sm:open:block open:block" open>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-bold text-caramel sm:hidden">
                    <span>ویژگی‌های طعمی خاستگاه انتخابی</span>
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-white/80">⌄</span>
                </summary>
                <ul className="mt-3 flex w-full flex-col gap-2 sm:mt-0">
                    {RATING_LABELS.map(([key, label]) => {
                        const currentValue = focusedOrigin?.[key] ?? "medium";
                        return (
                            <li
                                key={String(key)}
                                className="flex items-center justify-between gap-2 sm:gap-3"
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
                                    className="flex flex-1 justify-end gap-1 sm:gap-1.5"
                                >
                                    {RATING_LEVELS.map((level) => {
                                        const active = currentValue === level.key;
                                        return (
                                            <span
                                                key={level.key}
                                                role="radio"
                                                aria-checked={active}
                                                className={`min-h-7 rounded-lg border px-2 py-1 text-center text-[0.65rem] font-semibold leading-none transition sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-[0.7rem] ${active
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
            </details>

            {/* ── Section title ───────────────────────────────────── */}
            <h4 className="mx-auto w-fit rounded-xl bg-black/40 px-3 py-1.5 text-center text-xs font-bold text-white backdrop-blur-sm sm:text-sm">
                {isOriginA ? "کشور محل کشت قهوه عربیکا خود را انتخاب نمایید" : "کشور محل کشت قهوه روبوستا خود را انتخاب نمایید"}
            </h4>

            {/* ── Origin carousel — flex-1 so it can shrink when preview is open ── */}
            <div
                role="radiogroup"
                aria-label="خاستگاه عربیکا را انتخاب کنید"
                className="flex min-h-0 flex-1 snap-x snap-mandatory items-stretch gap-3 overflow-x-auto overscroll-x-contain scroll-px-3 px-1 pb-3 sm:px-4 hide-scrollbar"
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
                            className={`group relative h-48 w-32 shrink-0 snap-center overflow-hidden rounded-2xl border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel sm:h-44 sm:w-32 ${isFocused
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
                                className="absolute inset-0 bg-linear-to-b from-black/55 via-black/20 to-black/85"
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
        </div >
    );
}

