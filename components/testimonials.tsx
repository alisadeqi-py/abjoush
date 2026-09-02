"use client";

import { PlayIcon } from "./icons";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { TESTIMONIAL_CARD_WIDTH, CARD_GAP } from "@/lib/constants";

// Voice testimonial data
const voiceTestimonials = [
    {
        id: 1,
        name: "محمد جوادی",
        product: "خریدار قهوه اسپرسو",
        duration: "0:35",
        avatar: "MJ",
        text: "اگر عاشق قهوه هستید، آبجوش رو از دست ندهید. کیفیت و طعمشون همیشه ثابت و عالیه.",
    },
    {
        id: 2,
        name: "نرگس خاتمی",
        product: "خریدار قهوه دمی",
        duration: "0:35",
        avatar: "نخ",
        text: "اگر عاشق قهوه هستید، آبجوش رو از دست ندهید. کیفیت و طعمشون همیشه ثابت و عالیه.",
    },
    {
        id: 3,
        name: "علی محمدی",
        product: "خریدار قهوه ترک",
        duration: "0:41",
        avatar: "عم",
        text: "اگر عاشق قهوه هستید، آبجوش رو از دست ندهید. کیفیت و طعمشون همیشه ثابت و عالیه.",
    },
    {
        id: 4,
        name: "سارا موسوی",
        product: "خریدار قهوه اسپرسو",
        duration: "0:28",
        avatar: "سم",
        text: "اگر عاشق قهوه هستید، آبجوش رو از دست ندهید. کیفیت و طعمشون همیشه ثابت و عالیه.",
    },
    {
        id: 5,
        name: "امیر رضایی",
        product: "خریدار قهوه دمی",
        duration: "0:28",
        avatar: "ار",
        text: "اگر عاشق قهوه هستید، آبجوش رو از دست ندهید. کیفیت و طعمشون همیشه ثابت و عالیه.",
    },
];

export function Testimonials() {
    const { scrollRef, onMouseDown } = useHorizontalScroll(TESTIMONIAL_CARD_WIDTH, CARD_GAP);

    return (
        <section className="w-full mt-16 backdrop:blur-sm border border-[#e0dcd6] rounded-2xl p-6 md:p-10">
            {/* Section Header */}
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1f1b17] tracking-tight">
                    نظرات مشتری‌های آبجوش با ویس
                </h2>
                <p className="text-[#6b6154] text-sm md:text-base mt-1 font-medium">
                    صدای شما، بهترین انرژی برای ادامه مسیر ماست.
                </p>
            </div>

            {/* Horizontal scroll – Voice testimonials */}
            <div
                ref={scrollRef}
                aria-label="نظرات مشتریان - اسکرول افقی"
                className="flex gap-4 overflow-auto pb-6 pt-2 scrollbar-hidden flex-nowrap cursor-grab"
                onMouseDown={onMouseDown}
            >
                {voiceTestimonials.map((item) => (
                    <div
                        key={item.id}
                        className="min-w-[280px] max-w-[300px] bg-[#fefbfd] rounded-2xl border border-[#eae5de] p-4 shadow-sm shrink-0 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#f2efe9] flex items-center justify-center text-[#4b3f34] font-semibold text-sm">
                                {item.avatar}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-[#1f1b17]">{item.name}</div>
                                <div className="text-[0.6rem] text-[#6b6154]">{item.product}</div>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-[#8a7d6e] font-mono">{item.duration}</span>
                            <button
                                className="w-8 h-8 rounded-full bg-[#f2efe9] flex items-center justify-center text-[#4b3f34] hover:bg-[#e6dfd6] transition-colors"
                                aria-label="پخش ویس"
                            >
                                <PlayIcon className="w-4 h-4" />
                            </button>
                        </div>
                        {/* Simple waveform visual */}
                        <div className="mt-2 flex items-center gap-0.5 h-4">
                            {[4, 6, 3, 8, 5, 7, 4, 6].map((height, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-[#d4cbc0] rounded-full"
                                    style={{ height: `${height * 2}px` }}
                                />
                            ))}
                        </div>
                        <p className="text-[#1f1b17] text-sm leading-relaxed">
                            {item.text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
