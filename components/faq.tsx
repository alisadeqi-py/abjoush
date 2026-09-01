"use client";

import { useState } from "react";

const faqs = [
    {
        id: 1,
        question: "آیا ایرانی برای گردشگران خارجی مناسب است؟",
        answer:
            "بله، ایران با تاریخ غنی، جاذبه‌های طبیعی متنوع و مهمان‌نوازی بی‌نظیر، یکی از بهترین مقاصد گردشگری برای گردشگران خارجی است. بسیاری از گردشگران خارجی هر ساله از ایران دیدن می‌کنند و تجربه‌های مثبتی دارند.",
    },
    {
        id: 2,
        question: "جاذبه‌های گردشگری ایران کدامند؟",
        answer:
            "ایران دارای جاذبه‌های گردشگری فراوانی است از جمله: تخت جمشید، میدان نقش جهان، بازار تاریخی تبریز، جنگل‌های شمال، کویرهای مرکزی، جزیره کیش، و بسیاری مکان‌های تاریخی و طبیعی دیگر.",
    },
    {
        id: 3,
        question: "بهترین زمان ایرانی‌کردی که است؟",
        answer:
            "بهترین زمان برای سفر به ایران، فصل‌های بهار (فروردین تا خرداد) و پاییز (مهر تا آذر) است. در این فصول، آب و هوا معتدل و دلپذیر بوده و مناظر طبیعی در زیباترین حالت خود قرار دارند.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full mt-16 bg-[#fefaf7] rounded-3xl border border-[#eae5de] p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#5c2706] tracking-tight">
                    سوالات متداول
                </h2>
                <a
                    href="#"
                    className="text-sm font-medium text-[#6b6154] hover:text-[#5c2706] transition-colors flex items-center gap-1"
                >
                    مشاهده همه
                    <ArrowIcon className="w-4 h-4" />
                </a>
            </div>

            <div className="space-y-3">
                {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={faq.id}
                            className="border border-[#eae5de] rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#d4cbc0]"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-5 py-4 text-right flex items-center justify-between gap-4 hover:bg-[#faf8f5] transition-colors"
                            >
                                <span className="text-sm md:text-base font-medium text-[#5c2706] flex-1">
                                    {faq.question}
                                </span>
                                <span
                                    className={`w-6 h-6 rounded-full bg-[#f2efe9] flex items-center justify-center text-[#4b3f34] transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                                        }`}
                                >
                                    <ChevronDownIcon className="w-4 h-4" />
                                </span>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"
                                    }`}
                            >
                                <div className="px-5 pb-4 text-sm text-[#6b6154] leading-relaxed border-t border-[#eae5de] pt-3">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}