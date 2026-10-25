"use client";

import Image from "next/image";
import React, { useCallback, useRef } from "react";

import { BREW_METHODS, type BrewMethod } from "@/lib/content";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { CARD_GAP, PRODUCT_CARD_WIDTH } from "@/lib/constants";
import { ScrollButton } from "./scroll-button";

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

interface StageMethodProps {
    selectedMethod: BrewMethod | null;
    onSelectMethod: (method: BrewMethod) => void;
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function StageMethod({
    selectedMethod,
    onSelectMethod,
}: StageMethodProps) {
    const {
        scrollRef,
        scrollProgress,
        scrollByAmount,
        onMouseDown,
    } = useHorizontalScroll(PRODUCT_CARD_WIDTH, CARD_GAP);

    /* Guard: if the user dragged, don't fire the click on the card underneath. */
    const draggedRef = useRef(false);

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

    const handleSelect = useCallback(
        (method: BrewMethod) => {
            if (draggedRef.current) {
                draggedRef.current = false;
                return;
            }
            onSelectMethod(method);
        },
        [onSelectMethod]
    );

    const progressPct = Math.max(6, Math.round(scrollProgress * 100));

    return (
        <div className="absolute bottom-[7%] left-1/2 z-10 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-176">
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

                {/* Carousel */}
                <div
                    ref={scrollRef}
                    role="radiogroup"
                    aria-label="روش دم‌آوری را انتخاب کنید"
                    className="scrollbar-hidden flex cursor-grab flex-nowrap gap-4 overflow-auto scroll-px-4 pb-6 pt-2 active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                >
                    {BREW_METHODS.map((method) => {
                        const active = selectedMethod?.id === method.id;
                        return (
                            <button
                                key={method.id}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                tabIndex={active || selectedMethod == null ? 0 : -1}
                                onClick={() => handleSelect(method)}
                                className={`flex w-28 shrink-0 snap-center flex-col items-center rounded-xl border-[3px] bg-white px-3 py-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel ${active
                                        ? "scale-105 border-roast shadow-lg"
                                        : "border-transparent hover:-translate-y-0.5 hover:border-latte hover:shadow-md"
                                    }`}
                            >
                                <div className="relative grid h-16 w-16 place-items-center">
                                    <Image
                                        src={method.image}
                                        alt=""
                                        fill
                                        sizes="64px"
                                        className="object-contain"
                                    />
                                </div>
                                <span
                                    className={`mt-2 line-clamp-2 min-h-8 text-center text-xs leading-tight ${active ? "font-bold text-roast" : "font-medium text-ink/80"
                                        }`}
                                >
                                    {method.name}
                                </span>
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
        </div>
    );
}