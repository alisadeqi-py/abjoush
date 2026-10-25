"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

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
import { CheckIcon } from "./icon/CheckIcon";
import { SpeakerIcon } from "./icon/SpeakerIcon";
import { CloseIcon } from "./icon/CloseIcon";

const classCSS = "animate-fade-in object-cover pb-100 md:object-contain md:pb-0";

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
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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

type CoffeeWizardProps = {
    /** Called when the user presses the close button (falls back to exiting fullscreen). */
    onClose?: () => void;
    /** When true, the wizard opens in fullscreen on mount (best effort — needs user gesture). */
    autoFullscreen?: boolean;
};

export default function CoffeeWizard({ onClose, autoFullscreen = false }: CoffeeWizardProps) {
    const [stage, setStage] = useState(5);
    const [isOriginA, setIsOriginA] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<BrewMethod | null>(null);
    const [selectedOriginA, setSelectedOriginA] = useState<Origin | null>(null);
    const [selectedOriginR, setSelectedOriginR] = useState<Origin | null>(null);
    const [selectedTasteId, setSelectedTasteId] = useState<number | null>(null);
    const [selectedConsumptionId, setSelectedConsumptionId] = useState<number | null>(null);
    const [robusta, setRobusta] = useState(50);
    const [muted, setMuted] = useState(false);
    const [startSpeaking, setStartSpeaking] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const currentAudio = useRef<HTMLAudioElement | null>(null);
    const sectionRef = useRef<HTMLElement | null>(null);

    const after = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
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

    /* ---------- Fullscreen handling ---------- */
    useEffect(() => {
        const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener("fullscreenchange", onFsChange);
        return () => document.removeEventListener("fullscreenchange", onFsChange);
    }, []);

    const enterFullscreen = useCallback(async () => {
        if (typeof document === "undefined") return;
        try {
            await sectionRef.current?.requestFullscreen?.();
        } catch {
            /* user gesture required — silent fail */
        }
    }, []);

    const exitFullscreen = useCallback(async () => {
        if (typeof document === "undefined") return;
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
        } catch { }
    }, []);

    const toggleFullscreen = useCallback(async () => {
        if (isFullscreen) await exitFullscreen();
        else await enterFullscreen();
    }, [isFullscreen, enterFullscreen, exitFullscreen]);

    const handleClose = useCallback(() => {
        stopAudio();
        clearTimers();
        if (isFullscreen) void exitFullscreen();
        onClose?.();
    }, [isFullscreen, exitFullscreen, onClose]);

    useEffect(() => {
        if (!autoFullscreen) return;
        void enterFullscreen();
    }, [autoFullscreen, enterFullscreen]);

    /* Escape closes fullscreen via browser; if no fullscreen, call onClose */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            if (!isFullscreen && onClose) handleClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isFullscreen, onClose, handleClose]);

    /* ---------- Derived state ---------- */
    const arabica = 100 - robusta;
    const currentStepIndex = STEPS.findIndex((s) => s.id === stage);
    const selectedOrigin = isOriginA ? selectedOriginA : selectedOriginR;
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
        enterFullscreen()
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

        if (stage === 2) {
            if (arabica > robusta) setIsOriginA(true)
            else setIsOriginA(false)
        }
        if (stage === 3 && arabica !== 0 && arabica !== 100) {
            if (arabica > robusta && !selectedOriginR) {
                setIsOriginA(false)
                advanceWithNarration("/audio/step4_r.mp4", 3);
                return
            }
            else if (!selectedOriginA) {
                setIsOriginA(true)
                advanceWithNarration("/audio/step4_a.mp4", 3);
                return
            }
        }

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
            ? isOriginA
                ? "/images/text/text4a.webp"
                : "/images/text/text4r.webp"
            : STAGE_IMAGES[stage];

    const isWelcome = stage === 0;
    const isDone = stage === 7;

    return (
        <section
            ref={sectionRef}
            aria-label="ویزارد ساخت قهوه"
            className="relative flex h-[calc(100dvh-4rem)] min-h-135 w-full flex-col overflow-hidden bg-black text-white sm:min-h-140 in-fullscreen:h-dvh"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
            {/* ---------- Background layers ---------- */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 origin-[50%_5%] scale-[2] sm:scale-[1.35] lg:scale-100">
                    <Image
                        src="/images/hero-bg.webp"
                        fill
                        alt=""
                        className="object-cover pb-100 md:object-contain md:pb-0"
                        loading="eager"
                        priority
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
                            alt={`مرحله ${stage}`}
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

            {/* ---------- Top control bar ---------- */}
            <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-3 pt-3 sm:px-4 sm:pt-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setMuted((m) => {
                                const next = !m;
                                if (next) stopAudio();
                                return next;
                            });
                        }}
                        aria-pressed={!muted}
                        aria-label={muted ? "روشن کردن صدای راهنما" : "قطع صدای راهنما"}
                        className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                    >
                        <SpeakerIcon muted={muted} className="h-4.5 w-4.5" />
                    </button>

                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        aria-pressed={isFullscreen}
                        aria-label={isFullscreen ? "خروج از تمام‌صفحه" : "نمایش تمام‌صفحه"}
                        className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                    >
                        <FullscreenIcon isFullscreen={isFullscreen} className="h-4.5 w-4.5" />
                    </button>
                </div>

                {isFullscreen && <button
                    type="button"
                    onClick={handleClose}
                    aria-label="بستن"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-md transition hover:bg-red-500/80 hover:ring-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                >
                    <CloseIcon className="h-4.5 w-4.5" />
                </button>}
            </div>

            {/* ---------- Step indicator ---------- */}
            {!isWelcome && !isDone && (
                <nav
                    aria-label="مراحل ساخت قهوه"
                    className="absolute inset-x-3 top-16 z-20 mx-auto max-w-2xl rounded-2xl border border-white/10 bg-black/70 px-2 py-2.5 shadow-xl backdrop-blur-md sm:inset-x-4 sm:top-20 lg:top-24"
                >
                    <ol className="flex w-full items-start justify-between gap-1">
                        {STEPS.map((step, i) => {
                            const active = currentStepIndex === i;
                            const done = currentStepIndex > i;
                            return (
                                <li
                                    key={step.id}
                                    className="relative flex min-w-0 flex-1 flex-col items-center"
                                    aria-current={active ? "step" : undefined}
                                >
                                    {i < STEPS.length - 1 && (
                                        <span
                                            aria-hidden
                                            className={`absolute top-4.5 right-1/2 h-px w-full transition-colors ${done || active ? "bg-caramel/70" : "bg-white/15"
                                                }`}
                                        />
                                    )}
                                    <span
                                        className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-bold backdrop-blur-sm transition-all ${active
                                            ? "scale-110 border-caramel bg-caramel text-ink shadow-[0_0_0_3px_rgba(202,138,76,0.25)]"
                                            : done
                                                ? "border-caramel/60 bg-caramel/20 text-caramel"
                                                : "border-white/25 bg-black/40 text-white/60"
                                            }`}
                                    >
                                        {done ? <CheckIcon className="h-4 w-4" /> : step.id}
                                    </span>
                                    <span
                                        className={`mt-1.5 max-w-18 text-center text-[0.6rem] leading-tight transition-colors sm:text-[0.7rem] ${active
                                            ? "font-bold text-caramel"
                                            : "font-medium text-white/60"
                                            }`}
                                    >
                                        {step.label}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            )}

            {/* ---------- Welcome screen ---------- */}
            {isWelcome && (
                <div className="absolute bottom-10 left-1/2 z-10 flex w-full max-w-[92%] -translate-x-1/2 flex-col items-center rounded-2xl border border-white/10 bg-black/40 p-5 text-center shadow-2xl backdrop-blur-md sm:max-w-md">
                    <h2 className="mb-2 text-lg leading-snug font-extrabold text-white sm:text-xl">
                        قهوه اختصاصی تو، تجربه‌ای خاص برای تو
                    </h2>
                    <p className="mb-5 max-w-xs text-xs leading-relaxed text-caramel sm:text-sm">
                        از انتخاب دانه تا آماده‌سرایی، همه چیز با سلیقه تو
                    </p>
                    <button
                        type="button"
                        onClick={handleStart}
                        className="group flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[#f5efe6] px-6 py-3 text-sm font-bold text-ink shadow-lg transition hover:scale-[1.02] hover:bg-white focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:outline-none active:scale-100"
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
                        <span className="grid h-5 w-5 place-items-center rounded-full border border-caramel text-caramel">
                            <ChevronIcon className="h-3 w-3" />
                        </span>
                    </button>
                </div>
            )}

            {/* ---------- Stage panels ---------- */}
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
                isOriginA ?
                    <StageOrigin
                        selectedOrigin={selectedOriginA}
                        onSelectOrigin={setSelectedOriginA}
                        isOriginA
                    />
                    :
                    <StageOrigin
                        selectedOrigin={selectedOriginR}
                        onSelectOrigin={setSelectedOriginR}
                    />
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
                    selectedOrigin={selectedOriginA}
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

            {/* ---------- Bottom navigation ---------- */}
            {stage >= 1 && stage <= 5 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4">
                    <div className="pointer-events-auto flex w-full max-w-2xl items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/60 p-2 shadow-2xl backdrop-blur-md">
                        <button
                            type="button"
                            disabled={stage === 1 || startSpeaking}
                            onClick={goToPrevious}
                            className="rounded-xl border border-white/25 bg-transparent px-5 py-2.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            مرحله قبل
                        </button>
                        <button
                            type="button"
                            onClick={goToNext}
                            disabled={startSpeaking}
                            className="flex items-center gap-1.5 rounded-xl bg-caramel px-6 py-2.5 text-xs font-bold text-ink shadow-lg transition hover:bg-[#d99a52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span>مرحله بعد</span>
                            <ChevronIcon className="h-3.5 w-3.5 rotate-180" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

function FullscreenIcon({
    isFullscreen,
    ...props
}: React.SVGProps<SVGSVGElement> & { isFullscreen?: boolean }) {
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
            {isFullscreen ? (
                <>
                    <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                    <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                    <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                    <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                </>
            ) : (
                <>
                    <path d="M3 8V5a2 2 0 0 1 2-2h3" />
                    <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                    <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
                    <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
                </>
            )}
        </svg>
    );
}