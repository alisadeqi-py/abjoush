import Image from "next/image";
import React, { useCallback, useRef } from "react";

import type { BrewMethod } from "@/lib/content";
import { CARD_GAP, PRODUCT_CARD_WIDTH } from "@/lib/constants";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { PencilIcon } from "./icon/PencilIcon";
import { CheckIcon } from "./icon/CheckIcon";
import { ScrollButton } from "./scroll-button";

/* ------------------------------------------------------------------ *
 * Types & data
 * ------------------------------------------------------------------ */

export interface TasteOption {
    id: number;
    name: string;
    image: string;
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
    { id: 2, name: "میوه‌ای و شراب", image: "/images/tastes/fruity.webp", rating: 2 },
    { id: 1, name: "شکلاتی و کاراملی", image: "/images/tastes/chocolate-caramel.webp", rating: 3 },
    { id: 4, name: "آجیلی و کاراملی", image: "/images/tastes/nutty-caramel.webp", rating: 1 },
    { id: 3, name: "گلی و شکوفه", image: "/images/tastes/floral-blossom.webp", rating: 3 },
    { id: 5, name: "ملایم", image: "/images/tastes/feather.webp", rating: 3 },
    { id: 6, name: "تلخ و قوی", image: "/images/tastes/power.webp", rating: 2 },
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
    const draggedRef = useRef(false);

    const {
        scrollRef,
        scrollProgress,
        scrollByAmount,
        onMouseDown,
    } = useHorizontalScroll(PRODUCT_CARD_WIDTH, CARD_GAP);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            draggedRef.current = false;
            const startX = e.clientX;
            const onUp = () => {
                if (Math.abs(e.clientX - startX) > 4) draggedRef.current = true;
                window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mouseup", onUp);
            onMouseDown(e);
        },
        [onMouseDown]
    );
    const progressPct = Math.max(6, Math.round(scrollProgress * 100));

    return (
        <div
            className="absolute bottom-[5%] left-1/2 z-10 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-175">
            {/* ── Top row: selected device + advisor note ───────────── */}

            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                {/* Selected device */}

                {/* Advisor note */}
                <div className="w-full max-w-40 rounded-3xl bg-coffee-900 p-4 text-white shadow-lg hidden md:grid">
                    <h4 className="mb-1 text-sm font-bold text-caramel">
                        راهنما
                    </h4>
                    <p className="text-[0.7rem] leading-relaxed text-white/70">
                        انتخاب‌های شما در کنار دستگاه شما به ما کمک می‌کند
                        ترکیب و تجربه‌ای خاص‌تر و حرفه‌ای‌تر برایتان بسازیم.
                    </p>
                </div>

                <div className="w-full max-w-xs rounded-3xl bg-coffee-900 p-4 text-center shadow-lg hidden md:grid">
                    <p className="mb-3 text-xs font-semibold text-amber-100">
                        خاستگاه انتخاب شده
                    </p>
                    <div className="mb-3 flex items-center justify-center gap-3">
                        <Image
                            src={selectedMethod?.image || ""}
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

            <div className="relative">
                {/* Nav arrows — overlay the carousel edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-30 flex items-center">
                    <ScrollButton
                        direction="left"
                        onClick={() => scrollByAmount("left")}
                    />
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 z-30 flex items-center">
                    <ScrollButton
                        direction="right"
                        onClick={() => scrollByAmount("right")}
                    />
                </div>

                <div
                    ref={scrollRef}
                    role="radiogroup"
                    aria-label="روش دم‌آوری را انتخاب کنید"
                    className="scrollbar-hidden flex cursor-grab flex-nowrap gap-4 overflow-auto scroll-px-4 pb-6 pt-2 active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
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
                                className={`group flex justify-between h-44 w-28 shrink-0 snap-center flex-col items-center rounded-2xl border-2 bg-[#f5efe6] p-3 backdrop-blur-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel sm:h-48 sm:w-32 ${active
                                    ? "border-caramel shadow-[0_0_0_3px_rgba(0,0,0,0.4)]"
                                    : "border-white/10 hover:border-white/25"
                                    }`}
                            >

                                <Image
                                    src={taste.image}
                                    alt=""
                                    width={32}
                                    height={32}
                                    className="h-14 w-14 object-contain rounded-2xl"
                                    unoptimized
                                />

                                <span
                                    className={`mb-2 line-clamp-2 text-center text-[0.7rem] font-semibold leading-tight ${active ? "text-caramel" : "text-black"
                                        }`}
                                >
                                    {taste.name}
                                </span>



                                <div className="">
                                    <span className="mb-2 flex gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <span
                                                key={i}
                                                className={`h-1.5 w-1.5 rounded-full ${i < taste.rating
                                                    ? active
                                                        ? "bg-caramel"
                                                        : "bg-black"
                                                    : "bg-white/15"
                                                    }`}
                                            />
                                        ))}
                                    </span>
                                    <span
                                        aria-hidden
                                        className={`mt-auto grid h-5 w-5 place-items-center rounded-full transition ${active
                                            ? "bg-caramel ring-2 ring-white/70"
                                            : "border border-white/20 text-transparent"
                                            }`}
                                    >
                                        <CheckIcon className="h-3 w-3" />
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Progress bar */}
                <div
                    className="mx-auto mt-2 h-1 w-40 overflow-hidden rounded-full bg-latte"
                    role="progressbar"
                    aria-valuenow={progressPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuetext={`${progressPct}% اسکرول شده`}
                >
                    <div
                        className="h-full rounded-full bg-roast transition-[width] duration-150 ease-out"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
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