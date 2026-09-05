"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { RatingKey, type BrewMethod, type Origin, originDisplay } from "@/lib/content";

type Stage = "hero" | "method" | "ratio" | "origin" | "summary";
type Overlay = "none" | "intro" | "ratio-intro";

const RATING_LABELS: Array<[RatingKey, string]> = [
    ["acidity", "اسیدیته"],
    ["body", "بادی"],
    ["sweetness", "شیرینی"],
    ["aroma", "آروما"],
    ["bitterness", "تلخی"],
];

/** Wizard steps, shown in the top progress indicator. */
const STEPS: Array<{ id: Exclude<Stage, "hero">; label: string }> = [
    { id: "method", label: "روش دم‌آوری" },
    { id: "ratio", label: "نسبت دانه" },
    { id: "origin", label: "خاستگاه" },
    { id: "summary", label: "نتیجه" },
];

function playNarration(src: string, muted: boolean) {
    // Mirrors the original theme's `new Audio(url).play()` — a fresh Audio
    // instance per cue, fire-and-forget. Swallow rejections: browsers block
    // autoplay-with-sound until the user has interacted with the page, which
    // is already guaranteed here since every call sits behind a click.
    if (muted) return;
    const audio = new Audio(src);
    audio.play().catch(() => { });
}

export default function CoffeeWizard({
    brewMethods,
    origins,
}: {
    brewMethods: BrewMethod[];
    origins: Origin[];
}) {
    const [stage, setStage] = useState<Stage>("hero");
    const [overlay, setOverlay] = useState<Overlay>("none");
    const [panelVisible, setPanelVisible] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<BrewMethod | null>(null);
    const [robusta, setRobusta] = useState(50);
    const [focusedOriginId, setFocusedOriginId] = useState<number | null>(origins[0]?.id ?? null);
    const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);
    const [muted, setMuted] = useState(false);

    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const after = (ms: number, fn: () => void) => {
        timers.current.push(setTimeout(fn, ms));
    };
    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const arabica = 100 - robusta;
    const focusedOrigin = origins.find((o) => o.id === focusedOriginId) ?? origins[0] ?? null;
    const currentStepIndex = STEPS.findIndex((s) => s.id === stage);

    function handleStart() {
        setOverlay("intro");
        playNarration("/audio/narration-step1.mp3", muted);
        after(4200, () => setOverlay((cur) => (cur === "intro" ? "none" : cur)));
        setStage("method");
        setPanelVisible(false);
        after(2000, () => setPanelVisible(true));
    }

    function handlePickMethod(method: BrewMethod) {
        setSelectedMethod(method);
        setOverlay("none");
        after(500, () => {
            playNarration("/audio/narration-step2.mp3", muted);
            setStage("ratio");
            setPanelVisible(false);
            after(10, () => setPanelVisible(true));
            setOverlay("ratio-intro");
            after(5650, () => setOverlay((cur) => (cur === "ratio-intro" ? "none" : cur)));
        });
    }

    /** Let the user bypass a narration overlay immediately. Pending timers
        no-op afterwards: the overlay timer checks its current value, and the
        panel timer only ever sets `panelVisible` to true. */
    function skipOverlay() {
        setOverlay("none");
        setPanelVisible(true);
    }

    function goToOrigin() {
        setOverlay("none");
        setStage("origin");
        setPanelVisible(false);
        after(10, () => setPanelVisible(true));
    }

    function backToMethod() {
        setOverlay("none");
        setStage("method");
        setSelectedMethod(null);
        setPanelVisible(true);
    }

    function backToRatio() {
        setOverlay("none");
        setStage("ratio");
        setPanelVisible(true);
    }

    function handlePickOrigin(origin: Origin) {
        setOverlay("none");
        setFocusedOriginId(origin.id);
        setSelectedOrigin(origin);
        setStage("summary");
    }

    function reset() {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setStage("hero");
        setOverlay("none");
        setPanelVisible(false);
        setSelectedMethod(null);
        setSelectedOrigin(null);
        setRobusta(50);
        setFocusedOriginId(origins[0]?.id ?? null);
    }

    return (
        <section
            aria-label="ویزارد ساخت قهوه"
            className="relative w-full overflow-hidden bg-black h-[calc(100dvh-4rem)]"
        >
            {/* Background.
                All four stage assets share one 2837×1195 (~2.37:1) canvas, so
                `object-contain` letterboxes them identically on any viewport —
                the full composition (barista, captions) always stays visible.
                `object-cover` would crop the sides away on 16:9 and destroy
                the scene on portrait phones. */}
            <Image
                src="/images/hero-bg.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-contain"
            />

            {/* Speaking-barista overlay, shown during the two narrated intros.
                `unoptimized`: keep the GIF's animation intact in production —
                the image optimizer can re-encode it to a static frame. */}
            {overlay !== "none" && (
                <Image
                    src="/images/barista-speaking.gif"
                    alt=""
                    fill
                    sizes="100vw"
                    unoptimized
                    className="object-contain animate-fade-in"
                />
            )}
            {overlay === "intro" && (
                <Image
                    src="/images/overlay-choose-machine.png"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-contain animate-fade-in"
                />
            )}
            {overlay === "ratio-intro" && (
                <Image
                    src="/images/overlay-choose-ratio.png"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-contain animate-fade-in"
                />
            )}

            {/* Skip narration — the overlays block interaction for seconds;
                nobody should be forced to re-listen on a second visit. */}
            {overlay !== "none" && (
                <button
                    type="button"
                    onClick={skipOverlay}
                    className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-ink shadow-lg backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                >
                    رد کردن و ادامه
                </button>
            )}

            {/* Sound toggle — narration is autoplayed audio; muting must be
                one tap, not a browser setting. */}
            <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-pressed={!muted}
                aria-label={muted ? "روشن کردن صدای راهنما" : "قطع صدای راهنما"}
                className="absolute top-4 left-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-ink shadow backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
            >
                {muted ? <SpeakerOffIcon className="h-4 w-4" /> : <SpeakerIcon className="h-4 w-4" />}
            </button>

            {/* Step indicator — four unmarked stages gave no sense of place. */}
            {stage !== "hero" && (
                <ol
                    aria-label="مراحل ساخت قهوه"
                    className="absolute top-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-white/85 p-1 shadow backdrop-blur sm:gap-1"
                >
                    {STEPS.map((step, i) => {
                        const done = i < currentStepIndex;
                        const current = i === currentStepIndex;
                        return (
                            <li
                                key={step.id}
                                aria-current={current ? "step" : undefined}
                            >
                                <span
                                    className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[0.7rem] font-semibold transition-colors ${
                                        current
                                            ? "bg-roast text-white"
                                            : done
                                              ? "text-caramel"
                                              : "text-mocha"
                                    }`}
                                >
                                    <span
                                        className={`grid h-4 w-4 place-items-center rounded-full text-[0.6rem] font-bold ${
                                            current
                                                ? "bg-white text-roast"
                                                : done
                                                  ? "bg-caramel text-white"
                                                  : "bg-beige text-mocha"
                                        }`}
                                    >
                                        {done ? "✓" : i + 1}
                                    </span>
                                    <span className="hidden sm:inline">{step.label}</span>
                                </span>
                            </li>
                        );
                    })}
                </ol>
            )}

            {/* Hero CTA */}
            {stage === "hero" && (
                <button
                    type="button"
                    onClick={handleStart}
                    className="absolute bottom-[23vh] left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 active:scale-100"
                >
                    شروع کن قهوه بساز
                </button>
            )}

            {/* Brew-method carousel */}
            {stage === "method" && (
                <div
                    className="absolute bottom-[4%] left-1/2 z-10 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-[44rem]"
                    style={{ opacity: panelVisible ? 1 : 0 }}
                >
                    <div
                        dir="rtl"
                        role="group"
                        aria-label="روش دم‌آوری را انتخاب کنید"
                        className="flex gap-3 overflow-auto pb-2 scrollbar-hidden flex-nowrap"
                    >
                        {brewMethods.map((method) => (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() => handlePickMethod(method)}
                                aria-pressed={selectedMethod?.id === method.id}
                                className={`flex shrink-0 snap-center flex-col items-center rounded-xl border-[3px] bg-white px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel hover:-translate-y-0.5 hover:shadow-md ${
                                    selectedMethod?.id === method.id
                                        ? "scale-105 border-roast"
                                        : "border-transparent"
                                }`}
                            >
                                <Image
                                    src={method.image}
                                    alt={method.name}
                                    width={method.imageWidth}
                                    height={128}
                                    className="h-16 w-auto object-contain"
                                />
                                {/* span, not h5: headings inside buttons
                                    confuse the screen-reader outline */}
                                <span className="mt-2 whitespace-nowrap text-center text-xs font-medium">
                                    {method.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Robusta / Arabica ratio step */}
            {stage === "ratio" && (
                <div
                    className="absolute bottom-[4%] left-1/2 z-10 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-[44rem]"
                    style={{ opacity: panelVisible ? 1 : 0 }}
                >
                    <div className="mb-2 flex items-center justify-around">
                        <Image src="/images/bean-robusta.png" alt="" width={150} height={110} className="h-16 w-auto sm:h-20" />
                        <Image src="/images/bean-arabica.png" alt="" width={150} height={110} className="h-16 w-auto sm:h-20" />
                    </div>

                    <div className="mx-auto mb-2 flex w-fit gap-2 rounded-md bg-white px-3 py-1 text-xs font-semibold">
                        <span>{robusta} درصد روبستا</span>
                        <span>{arabica} درصد عربیکا</span>
                    </div>

                    <div className="rounded-3xl bg-white px-6 py-5">
                        {/* Nav lives inside the panel: the old absolute -top-9
                            row collided with the chip above on small screens,
                            and the primary action is now visually primary. */}
                        <div className="mb-4 flex items-center justify-between gap-2">
                            <button
                                type="button"
                                onClick={goToOrigin}
                                className="rounded-full bg-roast px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                            >
                                مرحله بعد
                            </button>
                            <button
                                type="button"
                                onClick={backToMethod}
                                className="rounded-full border-2 border-caramel px-4 py-1 text-xs font-semibold text-caramel transition hover:bg-beige focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                            >
                                مرحله قبل
                            </button>
                        </div>

                        <div className="relative flex w-full items-center justify-center">
                            <div
                                className="absolute -top-6 -translate-x-1/2 rounded-md bg-roast px-2 py-1 text-xs text-white"
                                style={{ left: `${robusta}%` }}
                            >
                                {robusta} % {arabica}
                            </div>
                            <div className="mb-1 flex w-full justify-between text-xs font-extrabold">
                                <span style={{ opacity: robusta <= 20 ? 0.1 : robusta < 45 ? 0.5 : 1 }}>
                                    روبستا
                                </span>
                                <span style={{ opacity: robusta >= 80 ? 0.1 : robusta > 55 ? 0.5 : 1 }}>
                                    عربیکا
                                </span>
                            </div>
                            {/* dir="ltr": the page is RTL, so an unmarked range
                                renders min-on-the-right while the tooltip uses
                                `left` — the badge slid opposite to the thumb.
                                Forcing LTR makes 0% = left = عربیکا end, which
                                is exactly how the two labels sit. */}
                            <input
                                type="range"
                                dir="ltr"
                                min={0}
                                max={100}
                                step={10}
                                value={robusta}
                                onChange={(e) => setRobusta(Number(e.target.value))}
                                aria-label="نسبت روبستا به عربیکا"
                                aria-valuetext={`${robusta} درصد روبستا، ${arabica} درصد عربیکا`}
                                className="ratio-range absolute top-3 w-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Arabica-origin step */}
            {(stage === "origin" || stage === "summary") && (
                <div
                    className="absolute bottom-[4%] left-1/2 z-10 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-[700px]"
                    style={{ opacity: panelVisible || stage === "summary" ? 1 : 0 }}
                >
                    {stage === "origin" && focusedOrigin && (
                        <div className="mb-2 overflow-x-auto">
                            <table
                                aria-label="ویژگی‌های قهوه خاستگاه انتخاب‌شده"
                                className="mx-auto min-w-full table-fixed overflow-hidden rounded-2xl border-2 border-latte bg-foam text-center text-xs"
                            >
                                <thead>
                                    <tr className="bg-beige">
                                        {RATING_LABELS.map(([, label]) => (
                                            <th key={label} className="border border-latte px-2 py-1 font-bold text-ink">
                                                {label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {RATING_LABELS.map(([key]) => (
                                            <td key={String(key)} className="border border-latte px-2 py-1 text-clay">
                                                {focusedOrigin ? originDisplay(focusedOrigin, key) : ""}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {stage === "origin" && (
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <button
                                type="button"
                                onClick={backToRatio}
                                className="rounded-full border-2 border-white px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                مرحله قبل
                            </button>
                            <h4 className="rounded-xl bg-black/40 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm sm:text-base">
                                کشور محل کشت قهوه عربیکا خود را انتخاب نمایید
                            </h4>
                            <span className="w-[60px]" aria-hidden />
                        </div>
                    )}

                    {stage === "origin" && (
                        <div
                            dir="rtl"
                            role="group"
                            aria-label="خاستگاه عربیکا را انتخاب کنید"
                            className="flex justify-center gap-3 overflow-auto pb-2 scrollbar-hidden flex-nowrap"
                        >
                            {origins.map((origin) => (
                                <button
                                    key={origin.id}
                                    type="button"
                                    onMouseEnter={() => setFocusedOriginId(origin.id)}
                                    onFocus={() => setFocusedOriginId(origin.id)}
                                    onClick={() => handlePickOrigin(origin)}
                                    aria-pressed={selectedOrigin?.id === origin.id}
                                    className={`shrink-0 snap-center overflow-hidden rounded-xl border-[3px] bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                                        focusedOriginId === origin.id ? "border-roast" : "border-transparent"
                                    }`}
                                >
                                    <Image
                                        src={origin.image}
                                        alt={origin.name}
                                        width={250}
                                        height={100}
                                        className="h-24 w-24 object-cover sm:h-28 sm:w-28"
                                    />
                                    <div className="py-1 text-xs font-semibold text-ink">{origin.name}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {stage === "summary" && selectedOrigin && (
                        <div className="rounded-3xl bg-white p-5 text-center shadow-lg">
                            <h4 className="mb-3 text-base font-bold text-ink">قهوه‌ی شما آماده شد</h4>
                            <ul className="mb-4 space-y-1 text-sm text-clay">
                                <li>
                                    روش دم‌آوری: <b className="text-ink">{selectedMethod?.name}</b>
                                </li>
                                <li>
                                    نسبت دانه: <b className="text-ink">{robusta}% روبستا / {arabica}% عربیکا</b>
                                </li>
                                <li>
                                    مبدا عربیکا: <b className="text-ink">{selectedOrigin.name}</b>
                                </li>
                            </ul>
                            {/* flex-wrap instead of grid-cols-2: five chips in
                                a 2-col grid left a dangling odd cell */}
                            <div className="mx-auto mb-4 flex max-w-sm flex-wrap justify-center gap-2 text-xs">
                                {RATING_LABELS.map(([key, label]) => (
                                    <div key={String(key)} className="rounded-full bg-beige px-3 py-1 text-clay">
                                        {label}: <b className="text-ink">{selectedOrigin ? originDisplay(selectedOrigin, key) : ""}</b>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={reset}
                                className="rounded-full bg-roast px-6 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                            >
                                شروع دوباره
                            </button>
                        </div>
                    )}
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
