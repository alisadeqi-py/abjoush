"use client";

import Image from "next/image";
import React, { useState } from "react";

import type { BrewMethod } from "@/lib/content";

function dummyIcon(color: string, glyph: string): string {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="${color}" />
            <text x="32" y="42" font-size="28" text-anchor="middle"
                  font-family="system-ui, sans-serif" fill="#fff">${glyph}</text>
        </svg>
    `.trim();
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const dummyDevice = dummyIcon("#6b4f3a", "☕");

/* ------------------------------------------------------------------ *
 * Types & data
 * ------------------------------------------------------------------ */

export interface TasteOption {
    id: number;
    name: string;
    icon: string;
    rating: number;
}

interface StageTasteProps {
    robusta: number;
    arabica: number;
    selectedMethod: BrewMethod | null;
    selectedTasteId: number | null;
    onSelectTaste: (id: number) => void;
    onEditDevice: () => void;
}

export const TASTE_OPTIONS: TasteOption[] = [
    { id: 1, name: "شکلاتی و کاراملی", icon: dummyIcon("#8b5e3c", "🍫"), rating: 3 },
    { id: 2, name: "میوه‌ای و شراب", icon: dummyIcon("#b34a4a", "🍑"), rating: 2 },
    { id: 3, name: "گلی و شکوفه", icon: dummyIcon("#c96fa0", "🌸"), rating: 3 },
    { id: 4, name: "آجیلی و کاراملی", icon: dummyIcon("#a9743f", "🥜"), rating: 1 },
    { id: 5, name: "شکلاتی و تیره", icon: dummyIcon("#4a2f22", "🍩"), rating: 3 },
    { id: 6, name: "میوه‌ای و مرکبات", icon: dummyIcon("#d1912f", "🍊"), rating: 2 },
];

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function StageTaste({
    robusta,
    arabica,
    selectedMethod,
    selectedTasteId,
    onSelectTaste,
    onEditDevice,
}: StageTasteProps) {
    const selectedTaste = TASTE_OPTIONS.find((t) => t.id === selectedTasteId);

    return (
        <div
            className="absolute bottom-[4%] left-1/2 z-10 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-175">
            {/* ── Top row: selected device + advisor note ───────────── */}

            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                {/* Selected device */}

                {/* Advisor note */}
                <div className="w-full max-w-40 rounded-3xl bg-[#1a1512] p-4 text-white shadow-lg">
                    <h4 className="mb-1 text-sm font-bold text-caramel">
                        راهنما
                    </h4>
                    <p className="text-[0.7rem] leading-relaxed text-white/70">
                        انتخاب‌های شما در کنار دستگاه شما به ما کمک می‌کند
                        ترکیب و تجربه‌ای خاص‌تر و حرفه‌ای‌تر برایتان بسازیم.
                    </p>
                </div>

                <div className="w-full max-w-xs rounded-3xl bg-[#1a1512] p-4 text-center shadow-lg">
                    <p className="mb-3 text-xs font-semibold text-amber-100">
                        خاستگاه انتخاب شده
                    </p>
                    <div className="mb-3 flex items-center justify-center gap-3">
                        <Image
                            src={selectedMethod?.image || dummyDevice}
                            alt={selectedMethod?.name || ""}
                            width={96}
                            height={96}
                            className="h-16 w-auto object-contain"
                            unoptimized
                        />
                        <div className="text-right">
                            <h4 className="text-sm font-extrabold text-amber-100">
                                {selectedMethod?.name}
                            </h4>
                            {selectedMethod?.description && (
                                <p className="mt-1 max-w-40 text-[0.65rem] leading-relaxed text-amber-100">
                                    {selectedMethod?.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onEditDevice}
                        className="mx-auto flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-[0.65rem] font-semibold text-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                    >
                        <span>تغییر دستگاه</span>
                        <PencilIcon className="h-3 w-3" />
                    </button>
                </div>

            </div>

            {/* ── Title ─────────────────────────────────────────────── */}
            <h3 className="text-center text-sm font-bold text-white sm:text-base">
                سلیقه و طعم مورد علاقه‌ات را انتخاب کن
            </h3>

            {/* ── Flavor carousel ───────────────────────────────────── */}
            <div
                role="radiogroup"
                aria-label="طعم مورد علاقه را انتخاب کنید"
                className="flex snap-x snap-mandatory gap-3  overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-3 scrollbar-hidden"
            >
                {TASTE_OPTIONS.map((taste) => {
                    const active = taste.id === selectedTasteId;
                    return (
                        <button
                            key={taste.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => onSelectTaste(taste.id)}
                            className={`group flex h-44 w-28 shrink-0 snap-center flex-col items-center rounded-2xl border-2 bg-[#f5efe6] p-3 backdrop-blur-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel sm:h-48 sm:w-32 ${active
                                ? "border-caramel shadow-[0_0_0_3px_rgba(0,0,0,0.4)]"
                                : "border-white/10 hover:border-white/25"
                                }`}
                        >
                            <span
                                className={`mb-3 grid h-12 w-12 place-items-center rounded-full transition ${active ? "bg-caramel/15" : "bg-white/5"
                                    }`}
                            >
                                <Image
                                    src={taste.icon}
                                    alt=""
                                    width={32}
                                    height={32}
                                    className="h-7 w-7 object-contain"
                                    unoptimized
                                />
                            </span>

                            <span
                                className={`mb-2 line-clamp-2 text-center text-[0.7rem] font-semibold leading-tight ${active ? "text-caramel" : ""
                                    }`}
                            >
                                {taste.name}
                            </span>

                            <span className="mb-2 flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className={`h-1.5 w-1.5 rounded-full ${i < taste.rating
                                            ? active
                                                ? "bg-caramel"
                                                : "bg-white/60"
                                            : "bg-white/15"
                                            }`}
                                    />
                                ))}
                            </span>

                            <span
                                aria-hidden
                                className={`mt-auto grid h-5 w-5 place-items-center rounded-full transition ${active
                                    ? "bg-caramel text-white ring-2 ring-white/70"
                                    : "border border-white/20 text-transparent"
                                    }`}
                            >
                                <CheckIcon className="h-3 w-3" />
                            </span>
                        </button>
                    );
                })}
            </div>
            <p className="sr-only" aria-live="polite">
                {selectedTaste
                    ? `طعم انتخاب شده: ${selectedTaste.name}`
                    : "طعمی انتخاب نشده"}
                . نسبت فعلی: {robusta} درصد روبستا، {arabica} درصد عربیکا.
            </p>
        </div >
    );
}

/* ------------------------------------------------------------------ *
 * Icons
 * ------------------------------------------------------------------ */

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z" />
        </svg>
    );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M15 6l-6 6 6 6" />
        </svg>
    );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M9 6l6 6-6 6" />
        </svg>
    );
}