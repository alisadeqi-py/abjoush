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

function playNarration(src: string) {
    // Mirrors the original theme's `new Audio(url).play()` — a fresh Audio
    // instance per cue, fire-and-forget. Swallow rejections: browsers block
    // autoplay-with-sound until the user has interacted with the page, which
    // is already guaranteed here since every call sits behind a click.
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

    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const after = (ms: number, fn: () => void) => {
        timers.current.push(setTimeout(fn, ms));
    };
    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const arabica = 100 - robusta;
    const focusedOrigin = origins.find((o) => o.id === focusedOriginId) ?? origins[0] ?? null;

    function handleStart() {
        setOverlay("intro");
        playNarration("/audio/narration-step1.mp3");
        after(4200, () => setOverlay((cur) => (cur === "intro" ? "none" : cur)));
        setStage("method");
        setPanelVisible(false);
        after(2000, () => setPanelVisible(true));
    }

    function handlePickMethod(method: BrewMethod) {
        setSelectedMethod(method);
        setOverlay("none");
        after(500, () => {
            playNarration("/audio/narration-step2.mp3");
            setStage("ratio");
            setPanelVisible(false);
            after(10, () => setPanelVisible(true));
            setOverlay("ratio-intro");
            after(5650, () => setOverlay((cur) => (cur === "ratio-intro" ? "none" : cur)));
        });
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
        <section className="relative h-dvh w-full overflow-hidden bg-black">
            {/* Background */}
            <Image
                src="/images/hero-bg.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />

            {/* Speaking-barista overlay, shown during the two narrated intros */}
            {overlay !== "none" && (
                <Image
                    src="/images/barista-speaking.gif"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover animate-fade-in"
                />
            )}
            {overlay === "intro" && (
                <Image
                    src="/images/overlay-choose-machine.png"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover animate-fade-in"
                />
            )}
            {overlay === "ratio-intro" && (
                <Image
                    src="/images/overlay-choose-ratio.png"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover animate-fade-in"
                />
            )}

            {/* Hero CTA */}
            {stage === "hero" && (
                <button
                    onClick={handleStart}
                    className="absolute bottom-[23vh] left-1/2 -translate-x-1/2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:scale-105"
                >
                    شروع کن قهوه بساز
                </button>
            )}

            {/* Brew-method carousel */}
            {stage === "method" && (
                <div
                    className="absolute bottom-[4%] left-1/2 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-[44rem]"
                    style={{ opacity: panelVisible ? 1 : 0 }}
                >
                    <div dir="rtl" className="flex gap-3 overflow-auto pb-2 scrollbar-hidden flex-nowrap">
                        {brewMethods.map((method) => (
                            <button
                                key={method.id}
                                onClick={() => handlePickMethod(method)}
                                className={`flex shrink-0 snap-center flex-col items-center rounded-xl border-[3px] bg-white px-4 py-2 transition ${selectedMethod?.id === method.id
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
                                <h5 className="mt-2 whitespace-nowrap text-center text-xs font-medium">
                                    {method.name}
                                </h5>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Robusta / Arabica ratio step */}
            {stage === "ratio" && (
                <div
                    className="absolute bottom-[4%] left-1/2 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-[44rem]"
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

                    <div className="relative rounded-3xl bg-white px-6 py-5">
                        <div className="absolute -top-9 right-0 flex gap-2">
                            <button
                                onClick={goToOrigin}
                                className="rounded-md border-2 border-caramel px-3 py-1 text-xs font-semibold text-caramel"
                            >
                                مرحله بعد
                            </button>
                            <button
                                onClick={backToMethod}
                                className="rounded-md border-2 border-caramel px-3 py-1 text-xs font-semibold text-caramel"
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
                            <input
                                type="range"
                                min={0}
                                max={100}
                                step={10}
                                value={robusta}
                                onChange={(e) => setRobusta(Number(e.target.value))}
                                className="ratio-range absolute top-3 w-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Arabica-origin step */}
            {(stage === "origin" || stage === "summary") && (
                <div
                    className="absolute bottom-[4%] left-1/2 w-full max-w-[92%] -translate-x-1/2 transition-opacity duration-500 sm:max-w-[700px]"
                    style={{ opacity: panelVisible || stage === "summary" ? 1 : 0 }}
                >
                    {stage === "origin" && focusedOrigin && (
                        <div className="mb-2 overflow-x-auto">
                            <table className="mx-auto min-w-full table-fixed overflow-hidden rounded-2xl border-2 border-black bg-white text-center text-xs">
                                <thead>
                                    <tr>
                                        {RATING_LABELS.map(([, label]) => (
                                            <th key={label} className="border border-black/20 px-2 py-1 font-bold">
                                                {label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {RATING_LABELS.map(([key]) => (
                                            <td key={String(key)} className="border border-black/10 px-2 py-1">
                                                {focusedOrigin ? originDisplay(focusedOrigin, key) : ""}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {stage === "origin" && (
                        <div className="mb-2 flex items-center justify-between">
                            <button
                                onClick={backToRatio}
                                className="rounded-md border-2 border-white px-3 py-1 text-xs font-semibold text-white"
                            >
                                مرحله قبل
                            </button>
                            <h4 className="text-sm font-bold text-white sm:text-base">
                                کشور محل کشت قهوه عربیکا خود را انتخاب نمایید
                            </h4>
                            <span className="w-[60px]" aria-hidden />
                        </div>
                    )}

                    {stage === "origin" && (
                        <div dir="rtl" className="flex justify-center gap-3 overflow-auto pb-2 scrollbar-hidden flex-nowrap">
                            {origins.map((origin) => (
                                <button
                                    key={origin.id}
                                    onMouseEnter={() => setFocusedOriginId(origin.id)}
                                    onClick={() => handlePickOrigin(origin)}
                                    className={`shrink-0 snap-center overflow-hidden rounded-xl border-[3px] transition ${focusedOriginId === origin.id ? "border-roast" : "border-transparent"
                                        }`}
                                >
                                    <Image
                                        src={origin.image}
                                        alt={origin.name}
                                        width={250}
                                        height={100}
                                        className="h-24 w-24 object-cover sm:h-28 sm:w-28"
                                    />
                                    <div className="bg-white py-1 text-xs font-semibold">{origin.name}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {stage === "summary" && selectedOrigin && (
                        <div className="rounded-3xl bg-white p-5 text-center">
                            <h4 className="mb-3 text-base font-bold">قهوه‌ی شما آماده شد</h4>
                            <ul className="mb-4 space-y-1 text-sm">
                                <li>
                                    روش دم‌آوری: <b>{selectedMethod?.name}</b>
                                </li>
                                <li>
                                    نسبت دانه: <b>{robusta}% روبستا / {arabica}% عربیکا</b>
                                </li>
                                <li>
                                    مبدا عربیکا: <b>{selectedOrigin.name}</b>
                                </li>
                            </ul>
                            <div className="mx-auto mb-4 grid max-w-xs grid-cols-2 gap-2 text-xs">
                                {RATING_LABELS.map(([key, label]) => (
                                    <div key={String(key)} className="rounded-md bg-black/5 px-2 py-1">
                                        {label}: {selectedOrigin ? originDisplay(selectedOrigin, key) : ""}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={reset}
                                className="rounded-full bg-roast px-6 py-2 text-sm font-bold text-white"
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
