"use client";

import Image from "next/image";
import React from "react";

import { BREW_METHODS, type BrewMethod } from "@/lib/content";

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
    return (
        <div className="absolute bottom-[5%] left-1/2 z-10 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-176">
            <div
                role="group"
                aria-label="روش دم‌آوری را انتخاب کنید"
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-3 scrollbar-hidden"
            >
                {BREW_METHODS.map((method) => {
                    const active = selectedMethod?.id === method.id;
                    return (
                        <button
                            key={method.id}
                            type="button"
                            onClick={() => onSelectMethod(method)}
                            aria-pressed={active}
                            className={`flex shrink-0 snap-center flex-col items-center rounded-xl border-[3px] bg-white px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel hover:-translate-y-0.5 hover:shadow-md ${active
                                    ? "scale-105 border-roast"
                                    : "border-transparent"
                                }`}
                        >
                            <Image
                                src={method.image}
                                alt={method.name}
                                width={90}
                                height={128}
                                className="h-16 w-auto object-contain"
                            />
                            <span className="mt-2 whitespace-nowrap text-center text-xs font-medium">
                                {method.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}