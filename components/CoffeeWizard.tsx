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

const classCSS = "animate-fade-in object-cover pb-100 md:object-contain md:pb-0"

const STEPS = [
    { id: 1, label: "انتخاب دستگاه" },
    { id: 2, label: "ترکیب عربیکا و روبوستا" },
    { id: 3, label: "انتخاب خاستگاه" },
    { id: 4, label: "سلیقه و طعم" },
    { id: 5, label: "میزان مصرف" },
    { id: 6, label: "پیشنهاد نهایی" },
] as const;

const STAGE_IMAGES: Record<number, string> = {
    0: "/images/text/text1.webp",
    1: "/images/text/text2.webp",
    2: "/images/text/text3.webp",
    4: "/images/text/text5.webp",
    5: "/images/text/text6.webp",
    6: "/images/text/text7.webp",
};

function playNarration(src: string, muted: boolean, gain = 2.0) {
    if (muted || typeof window === "undefined") return null;

    const audio = new Audio(src);
    audio.preload = "auto";

    const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;

    if (!AudioCtx) {
        void audio.play().catch(() => { });
        return audio;
    }

    try {
        const ctx = new AudioCtx();
        const source = ctx.createMediaElementSource(audio);
        const gainNode = ctx.createGain();
        gainNode.gain.value = gain;
        source.connect(gainNode).connect(ctx.destination);
        audio.addEventListener("ended", () => void ctx.close().catch(() => { }));
        void audio.play().catch(() => { });
    } catch {
        void audio.play().catch(() => { });
    }

    return audio;
}

export default function CoffeeWizard() {
    const [stage, setStage] = useState(0);
    const [selectedMethod, setSelectedMethod] = useState<BrewMethod | null>(null);
    const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);
    const [selectedTasteId, setSelectedTasteId] = useState<number | null>(null);
    const [selectedConsumptionId, setSelectedConsumptionId] = useState<number | null>(null);
    const [robusta, setRobusta] = useState(50);
    const [muted, setMuted] = useState(false);
    const [startSpeaking, setStartSpeaking] = useState(false);

    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const currentAudio = useRef<HTMLAudioElement | null>(null);


    const after = (ms: number, fn: () => void) =>
        timers.current.push(setTimeout(fn, ms));
    const clearTimers = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    };
    const stopAudio = () => {
        try {
            currentAudio.current?.pause();
        } catch { }
        currentAudio.current = null;
    };

    useEffect(() => () => (clearTimers(), stopAudio()), []);

    const arabica = 100 - robusta;
    const currentStepIndex = STEPS.findIndex((s) => s.id === stage);
    const selectedTasteLabel = TASTE_OPTIONS.find((t) => t.id === selectedTasteId)?.name;
    const selectedConsumptionRange = CONSUMPTION_OPTIONS.find(
        (c) => c.id === selectedConsumptionId
    )?.range;

    function narrate(src: string) {
        stopAudio();
        currentAudio.current = playNarration(src, muted);
    }

    function advanceWithNarration(src: string, nextStage: number) {
        if (startSpeaking) return;
        clearTimers();
        after(500, () => {
            setStartSpeaking(true);
            narrate(src);
            setStage(nextStage);
            after(4000, () => setStartSpeaking(false));
        });
    }

    function handleStart() {
        clearTimers();
        setStartSpeaking(true);
        narrate("/audio/step1_2.mp4");
        after(1500, () => setStage(1));
        after(4200, () => setStartSpeaking(false));
    }

    function goToNext() {
        if (startSpeaking) return;
        const next: Record<number, [string, number]> = {
            1: ["/audio/step3.mp4", 2],
            2: [robusta >= arabica ? "/audio/step4_r.mp4" : "/audio/step4_a.mp4", 3],
            3: ["/audio/step5.mp4", 4],
            4: ["/audio/step6.mp4", 5],
            5: ["/audio/step7.mp4", 6],
        };
        if (stage === 6) return setStage(7);
        const entry = next[stage];
        if (entry) advanceWithNarration(entry[0], entry[1]);
    }

    function goToPrevious() {
        clearTimers();
        stopAudio();
        setStartSpeaking(false);
        if (stage === 7) return setStage(6);
        if (stage > 1) setStage(stage - 1);
    }

    const stageTextSrc =
        stage === 3
            ? robusta >= 50
                ? "/images/text/text4r.webp"
                : "/images/text/text4a.webp"
            : STAGE_IMAGES[stage];



    return (
        <section
            aria-label="ویزارد ساخت قهوه"
            className="relative flex h-[calc(100dvh-4rem)] min-h-135 w-full flex-col overflow-hidden bg-black sm:min-h-140"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 origin-[50%_5%] scale-[2] sm:scale-[1.35] lg:scale-100"
                >
                    <Image
                        src="/images/hero-bg.webp"
                        fill
                        alt="Background image for the hero section of the coffee wizard"
                        className="object-cover pb-100 md:object-contain md:pb-0"
                        loading="eager"
                    />

                    {startSpeaking && (
                        <Image
                            src="/images/barista-speaking.gif"
                            alt=""
                            fill
                            sizes="100vw"
                            unoptimized
                            className={classCSS}
                        />
                    )}

                    {stageTextSrc && (
                        <Image
                            key={stageTextSrc}
                            src={stageTextSrc}
                            alt={`step-${stage}`}
                            fill
                            sizes="100vw"
                            className={classCSS}
                            loading="eager"
                        />
                    )}
                </div>

                <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[58%] bg-linear-to-t from-black/70 via-black/25 to-transparent sm:h-[52%]"
                />
            </div>

            <button
                type="button"
                onClick={() =>
                    setMuted((m) => {
                        const next = !m;
                        if (next) stopAudio();
                        return next;
                    })
                }
                aria-pressed={!muted}
                aria-label={muted ? "روشن کردن صدای راهنما" : "قطع صدای راهنما"}
                className="absolute top-3 left-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-ink shadow backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel sm:top-4 sm:left-4"
            >
                <SpeakerIcon muted={muted} className="h-4 w-4" />
            </button>

            {stage !== 0 && stage !== 7 && (
                <div className="absolute inset-x-3 top-2 z-10 mx-auto max-w-2xl rounded-xl bg-black/85 px-2 py-2 shadow-lg backdrop-blur supports-backdrop-filter:bg-black/70 sm:inset-x-4 sm:top-3 lg:top-6">
                    <ol
                        aria-label="مراحل ساخت قهوه"
                        className="flex w-full items-start justify-between gap-1"
                    >
                        {STEPS.map((step, i) => {
                            const active = currentStepIndex === i;
                            return (
                                <li
                                    key={step.id}
                                    className="relative flex min-w-0 flex-1 flex-col items-center"
                                    aria-current={active ? "step" : undefined}
                                >
                                    {i < STEPS.length - 1 && (
                                        <span
                                            aria-hidden
                                            className={`absolute top-4.5 right-1/2 h-px w-full ${active ? "bg-caramel/60" : "bg-white/20"
                                                }`}
                                        />
                                    )}
                                    <span
                                        className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-bold backdrop-blur-sm transition ${active
                                            ? "border-caramel bg-caramel/15 text-caramel"
                                            : "border-white/40 bg-black/40 text-white/70"
                                            }`}
                                    >
                                        {step.id}
                                    </span>
                                    <span
                                        className={`mt-1.5 max-w-18 text-center text-[0.6rem] leading-tight sm:text-[0.7rem] ${active
                                            ? "font-bold text-caramel"
                                            : "font-medium text-white/70"
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
                <div className="absolute bottom-10 left-1/2 z-10 flex w-full max-w-[92%] -translate-x-1/2 flex-col items-center rounded-lg p-3 px-4 text-center backdrop-blur-xs sm:max-w-md">
                    <h2 className="mb-2 text-lg leading-snug font-extrabold text-white sm:text-xl">
                        قهوه اختصاصی تو، تجربه‌ای خاص برای تو
                    </h2>
                    <p className="mb-5 max-w-xs text-xs leading-relaxed text-caramel sm:text-sm">
                        از انتخاب دانه تا آماده‌سرایی، همه چیز با سلیقه تو
                    </p>
                    <button
                        type="button"
                        onClick={handleStart}
                        className="group flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[#f5efe6] px-6 py-3 text-sm font-bold text-ink shadow-lg transition hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:outline-none active:scale-100"
                    >
                        <CoffeeCupIcon className="h-5 w-5 text-caramel transition group-hover:scale-110" />
                        <span>شروع سفارش</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleStart}
                        className="mt-4 flex items-center gap-2 text-[0.7rem] font-medium text-white/85 transition hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none sm:text-xs"
                    >
                        <span className="text-caramel">چطور قهوه اختصاصی من ساخته می‌شود</span>
                        <span className="text-caramel grid h-5 w-5 place-items-center rounded-full border border-caramel">
                            <ChevronIcon className="h-3 w-3" />
                        </span>
                    </button>
                </div>
            )}

            {stage === 1 && (
                <StageMethod selectedMethod={selectedMethod} onSelectMethod={setSelectedMethod} />
            )}

            {stage === 2 && (
                <StageRatio
                    robusta={robusta}
                    arabica={arabica}
                    setRobusta={setRobusta}
                    selectedMethod={selectedMethod}
                    setStage={setStage}
                />
            )}

            {stage === 3 && (
                <StageOrigin selectedOrigin={selectedOrigin} onSelectOrigin={setSelectedOrigin} />
            )}

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

            {stage === 5 && (
                <StageConsumption
                    selectedConsumptionId={selectedConsumptionId}
                    onSelectConsumption={setSelectedConsumptionId}
                />
            )}

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
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4">
                    <div className="pointer-events-auto flex w-full max-w-2xl items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={goToNext}
                            disabled={startSpeaking}
                            className="rounded-full bg-roast px-6 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            مرحله بعد
                        </button>
                        <button
                            type="button"
                            disabled={stage === 1 || startSpeaking}
                            onClick={goToPrevious}
                            className="rounded-full border-2 border-white/80 bg-black/30 px-5 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel disabled:cursor-not-allowed disabled:opacity-30 sm:border-caramel sm:bg-transparent sm:text-caramel sm:backdrop-blur-none sm:hover:bg-beige"
                        >
                            مرحله قبل
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

function SpeakerIcon({
    muted,
    ...props
}: React.SVGProps<SVGSVGElement> & { muted?: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M11 5 6 9H2v6h4l5 4z" />
            {muted ? (
                <>
                    <line x1="22" y1="9" x2="16" y2="15" />
                    <line x1="16" y1="9" x2="22" y2="15" />
                </>
            ) : (
                <>
                    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </>
            )}
        </svg>
    );
}