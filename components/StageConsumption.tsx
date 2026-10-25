import Image from "next/image";
import { CheckIcon } from "./icon/CheckIcon";
import { CARD_GAP, PRODUCT_CARD_WIDTH } from "@/lib/constants";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { useCallback, useRef } from "react";
import { ScrollButton } from "./scroll-button";

const BAG_LIGHT = "/images/packet.webp";

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
        range: "50 - 125 گرم",
        hint: "کمتر از 2 فنجان در روز",
        image: BAG_LIGHT,
        rating: 1,
    },
    {
        id: 2,
        label: "متوسط",
        range: "125 - 250 گرم",
        hint: "2 تا 4 فنجان در روز",
        image: BAG_LIGHT,
        rating: 2,
    },
    {
        id: 3,
        label: "زیاد",
        range: "250 - 500 گرم",
        hint: "4 تا 6 فنجان در روز",
        image: BAG_LIGHT,
        rating: 3,
    },
    {
        id: 4,
        label: "خیلی زیاد",
        range: "500 - 1000 گرم",
        hint: "4 تا 6 فنجان در روز",
        image: BAG_LIGHT,
        rating: 4,
    },
    {
        id: 5,
        label: "حرفه ای",
        range: "بیشتر از 1000 گرم",
        hint: "بیشتر از 10 فنجان در روز",
        image: BAG_LIGHT,
        rating: 5,
    },
];

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function StageConsumption({
    selectedConsumptionId,
    onSelectConsumption,
}: StageConsumptionProps) {
    const {
        scrollRef,
        scrollProgress,
        scrollByAmount,
        onMouseDown,
    } = useHorizontalScroll(PRODUCT_CARD_WIDTH, CARD_GAP);

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

    const progressPct = Math.max(6, Math.round(scrollProgress * 100));

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

                {/* ── Consumption carousel ──────────────────────────────── */}
                <div
                    ref={scrollRef}
                    role="radiogroup"
                    aria-label="روش دم‌آوری را انتخاب کنید"
                    className="scrollbar-hidden flex cursor-grab flex-nowrap gap-4 overflow-auto scroll-px-4 pb-6 pt-2 active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
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
                                        <Image
                                            className="w-auto h-auto"
                                            width={20}
                                            height={20}
                                            key={i}
                                            src="/images/fenjoon.png"
                                            alt="fenjoon" />
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