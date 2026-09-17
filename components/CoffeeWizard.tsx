"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { type BrewMethod, type Origin } from "@/lib/content";
import { CoffeeCupIcon } from "./icon/CoffeeCupIcon";
import { ChevronIcon } from "./icon/ChevronIcon";
import StageCheckout from "./StageCheckout";
import StageConsumption, { CONSUMPTION_OPTIONS } from "./StageConsumption";
import StageFinal from "./StageFinal";
import StageMethod from "./StageMethod";
import StageOrigin from "./StageOrigin";
import StageRatio from "./StageRatio";
import StageTaste, { TASTE_OPTIONS } from "./StageTaste";

const STEPS: Array<{ id: number; label: string }> = [
    { id: 1, label: "انتخاب دستگاه" },
    { id: 2, label: "ترکیب عربیکا و روبوستا" },
    { id: 3, label: "انتخاب خاستگاه" },
    { id: 4, label: "سلیقه و طعم" },
    { id: 5, label: "میزان مصرف" },
    { id: 6, label: "پیشنهاد نهایی" },
];


function playNarration(src: string, muted: boolean, start: boolean) {
    if (start) return
    if (muted) return;
    const audio = new Audio(src);
    audio.play().catch(() => { });
}

export default function CoffeeWizard() {
    const [stage, setStage] = useState<number>(0);
    const [selectedMethod, setSelectedMethod] = useState<BrewMethod | null>(null);
    const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);
    const [selectedTasteId, setSelectedTasteId] = useState<number | null>(null);
    const [selectedConsumptionId, setSelectedConsumptionId] =
        useState<number | null>(null);

    const [robusta, setRobusta] = useState(50);
    const [muted, setMuted] = useState(false);
    const [startSpeaking, setStartSpeaking] = useState(false);

    /* ------------------------------------------------------------------ *
     * Timers
     * ------------------------------------------------------------------ */

    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const after = (ms: number, fn: () => void) => {
        timers.current.push(setTimeout(fn, ms));
    };
    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const arabica = 100 - robusta;
    const currentStepIndex = STEPS.findIndex((s) => s.id === stage);
    const selectedTasteLabel = TASTE_OPTIONS.find(
        (t) => t.id === selectedTasteId
    )?.name;
    const selectedConsumptionRange = CONSUMPTION_OPTIONS.find(
        (c) => c.id === selectedConsumptionId
    )?.range;

    /* ------------------------------------------------------------------ *
     * Wizard actions
     * ------------------------------------------------------------------ */

    function handleStart() {
        playNarration("/audio/narration-step1.mp3", muted, startSpeaking);
        setStartSpeaking(true);
        after(2000, () => {
            setStage(1);
        });
        after(4200, () => {
            setStartSpeaking(false);
        });
    }

    function goToNext() {
        if (stage === 1) {
            after(500, () => {
                setStartSpeaking(true);
                playNarration("/audio/narration-step2.mp3", muted, startSpeaking);
                setStage(2);
                after(5650, () => setStartSpeaking(false));
            });
            return;
        }
        if (stage === 6) {
            setStage(7);
            return;
        }
        if (stage < 1 || stage > 6) return;
        setStage(stage + 1);
    }

    function goToPrevious() {
        if (stage === 7) {
            setStage(6);
            return;
        }
        if (stage > 1) {
            setStage(stage - 1);
        }
    }

    return (
        <section
            aria-label="ویزارت ساخت قهوه"
            className="relative w-full overflow-hidden bg-black h-[calc(100dvh-4rem)]"
        >
            <div className={`absolute inset-0 overflow-hidden origin-[50%_5%] scale-[2] sm:scale-[1.35] lg:scale-100`}>
                <Image
                    src="/images/hero-bg.webp"
                    fill
                    alt="Background image for the hero section of the coffee wizard"
                    className="md:object-contain object-cover md:pb-0 pb-100"
                    loading="eager"
                />

                {startSpeaking && (
                    <Image
                        src="/images/barista-speaking.gif"
                        alt=""
                        fill
                        sizes="100vw"
                        unoptimized
                        className="md:object-contain object-cover animate-fade-in md:pb-0 pb-100"
                    />
                )}
                {stage === 1 && (
                    <Image
                        src="/images/overlay-choose-machine.png"
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-contain animate-fade-in md:flex hidden"
                    />
                )}
                {stage === 2 && (
                    <Image
                        src="/images/overlay-choose-ratio.png"
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-contain animate-fade-in md:flex hidden"
                    />
                )}
            </div>
            <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-pressed={!muted}
                aria-label={muted ? "روشن کردن صدای راهنما" : "قطع صدای راهنما"}
                className="absolute top-4 left-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-ink shadow backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
            >
                {muted ? <SpeakerOffIcon className="h-4 w-4" /> : <SpeakerIcon className="h-4 w-4" />}
            </button>

            {stage !== 0 && stage !== 7 && (
                <div className="absolute flex justify-self-center md:top-10 top-1 z-10 transition-opacity duration-500 bg-black lg:w-2xl w-auto rounded-b-lg ">
                    <ol aria-label="مراحل ساخت قهوه" className="flex items-start justify-between gap-1 w-full">
                        {STEPS.map((step, i) => {
                            const active = currentStepIndex === i;
                            return (
                                <li
                                    key={step.id}
                                    className="relative flex flex-1 flex-col items-center"
                                    aria-current={active ? "step" : undefined}
                                >
                                    {i < STEPS.length - 1 && (
                                        <span
                                            aria-hidden
                                            className={`absolute right-1/2 top-4.5 h-px w-full ${active ? "bg-caramel/60" : "bg-white/20"
                                                }`}
                                        />
                                    )}
                                    <span
                                        className={`relative grid h-9 w-9 place-items-center rounded-full border-2 text-sm font-bold backdrop-blur-sm transition ${active
                                            ? "border-caramel bg-caramel/15 text-caramel"
                                            : "border-white/40 bg-black/40 text-white/70"
                                            }`}
                                    >
                                        {step.id}
                                    </span>

                                    <span
                                        className={`mt-1.5 max-w-18 text-center text-[0.6rem] leading-tight sm:text-[0.7rem] ${active ? "font-bold text-caramel" : "font-medium text-white/70"
                                            }`}
                                    >
                                        {step.label}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            )}

            {stage === 0 && (
                <div className="absolute justify-self-center bottom-10 z-10 flex flex-col items-center backdrop-blur-xs rounded-lg px-4 p-3 text-center">
                    {/* Headline */}
                    <h2 className="mb-2 text-lg font-extrabold leading-snug text-white sm:text-xl">
                        قهوه اختصاصی تو، تجربه‌ای خاص برای تو
                    </h2>

                    {/* Subtitle */}
                    <p className="mb-5 max-w-xs text-xs leading-relaxed sm:text-sm text-caramel">
                        از انتخاب دانه تا آماده‌سرایی، همه چیز با سلیقه تو
                    </p>

                    {/* Primary CTA */}
                    <button
                        type="button"
                        onClick={handleStart}
                        className="group flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[#f5efe6] px-6 py-3 text-sm font-bold text-ink shadow-lg transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 active:scale-100"
                    >
                        <CoffeeCupIcon className="h-5 w-5 text-caramel transition group-hover:scale-110" />
                        <span>شروع سفارش</span>
                    </button>

                    {/* Secondary link */}
                    <button
                        type="button"
                        onClick={handleStart}
                        className="mt-4 flex items-center gap-2 text-[0.7rem] font-medium text-white/85 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:text-xs"
                    >
                        <span className="text-caramel">چطور قهوه اختصاصی من ساخته می‌شود</span>
                        <span className="grid h-5 w-5 place-items-center rounded-full border border-text-caramel text-caramel">
                            <ChevronIcon className="h-3 w-3" />
                        </span>
                    </button>
                </div>
            )}

            {/* Step 1 — Brew-method carousel */}
            {stage === 1 && (
                <StageMethod selectedMethod={selectedMethod} onSelectMethod={setSelectedMethod} />
            )}

            {/* Step 2 — Arabica/Robusta ratio */}
            {stage === 2 && (
                <StageRatio
                    robusta={robusta}
                    arabica={arabica}
                    setRobusta={setRobusta}
                    selectedMethod={selectedMethod}
                    setStage={setStage}
                />
            )}

            {/* Step 3 — Arabica origin */}
            {stage === 3 && (
                <StageOrigin selectedOrigin={selectedOrigin} onSelectOrigin={setSelectedOrigin} />
            )}

            {/* Step 4 — Taste */}
            {stage === 4 && (
                <StageTaste
                    robusta={robusta}
                    arabica={arabica}
                    selectedMethod={selectedMethod}
                    selectedTasteId={selectedTasteId}
                    onSelectTaste={setSelectedTasteId}
                    onEditDevice={() => setStage(1)}
                />
            )}

            {/* Step 5 — Consumption */}
            {stage === 5 && (
                <StageConsumption
                    selectedConsumptionId={selectedConsumptionId}
                    onSelectConsumption={setSelectedConsumptionId}
                />
            )}

            {/* Step 6 — Final suggestion */}
            {stage === 6 && (
                <StageFinal
                    selectedMethod={selectedMethod}
                    selectedOrigin={selectedOrigin}
                    robusta={robusta}
                    arabica={arabica}
                    selectedTasteLabel={selectedTasteLabel}
                    selectedConsumptionRange={selectedConsumptionRange}
                    onEditDevice={() => setStage(1)}
                    onEditOrigin={() => setStage(3)}
                    onEditTaste={() => setStage(4)}
                    onEditConsumption={() => setStage(5)}
                    onContinue={() => setStage(7)}
                />
            )}

            {/* Step 7 — Checkout */}
            {stage === 7 && (
                <StageCheckout
                    selectedMethod={selectedMethod}
                    selectedOrigin={selectedOrigin}
                    robusta={robusta}
                    arabica={arabica}
                    selectedTasteLabel={selectedTasteLabel}
                    selectedConsumptionRange={selectedConsumptionRange}
                    onClose={() => setStage(6)}
                />
            )}

            {stage >= 1 && stage <= 5 && (
                <div className="mb-4 flex items-center justify-between gap-2 absolute bottom-0 left-1/2 z-10 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-176">
                    <button
                        type="button"
                        onClick={goToNext}
                        className="rounded-full bg-roast px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                    >
                        مرحله بعد
                    </button>
                    <button
                        type="button"
                        disabled={stage === 1}
                        onClick={goToPrevious}
                        className="rounded-full border-2 border-caramel px-4 py-1 text-xs font-semibold text-caramel transition hover:bg-beige focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        مرحله قبل
                    </button>
                </div>
            )}
        </section>
    );
}

function SpeakerIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M11 5 6 9H2v6h4l5 4z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
    );
}

function SpeakerOffIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M11 5 6 9H2v6h4l5 4z" />
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
    );
}
