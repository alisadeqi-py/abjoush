"use client";

import { useState } from "react";

const faqs = [
    {
        id: 1,
        question: "تفاوت قهوه عربیکا و روبستا چیست؟",
        answer:
            "عربیکا طعمی نرم‌تر، اسیدیته‌ی بالاتر و عطر میوه‌ای دارد و روبستا بدنه‌ای غلیظ‌تر، کافئین بیشتری و تلخی عمیق‌تری دارد. در آبجوش ترکیب این دو دانه را بر اساس سلیقه‌ی شما تنظیم می‌کنیم.",
    },
    {
        id: 2,
        question: "قهوه را چطور نگه داری کنم تا تازگی‌اش حفظ شود؟",
        answer:
            "قهوه را در ظرف دربسته، خنک و دور از نور مستقیم نگه دارید. یخچال توصیه نمی‌شود چون رطوبت عطر قهوه را از بین می‌برد. بهترین طعم، دو تا چهار هفته‌ی اول بعد از رست است.",
    },
    {
        id: 3,
        question: "برای هر روش دم‌آوری چه آسیابانی مناسبی است؟",
        answer:
            "اسپرسو آسیاب بسیار ریز می‌خواهد، موکاپات و ایروپرس متوسط، و فرنچ‌پرس یا کلد برو درشت. اگر دانه را به‌صورت سبوس‌خورده سفارش دهید، آسیاب مناسب روش دم‌آوری‌تان برایتان انجام می‌دهیم.",
    },
    {
        id: 4,
        question: "ارسال چقدر زمان می‌برد؟",
        answer:
            "سفارش‌های تهران در بازه‌ی یک روز کاری و شهرستان‌ها بین دو تا چهار روز کاری ارسال می‌شوند. قهوه‌های سبوس‌خورده در روز سفارش رست و بسته‌بندی می‌شوند تا تازه به دستتان برسد.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="w-full mt-16 bg-cream rounded-3xl border border-latte p-6 md:p-8 shadow-sm scroll-mt-20">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">
                    سوالات متداول
                </h2>
                <a
                    href="#"
                    className="text-sm font-medium text-clay hover:text-roast transition-colors flex items-center gap-1"
                >
                    مشاهده همه
                    <ArrowIcon className="w-4 h-4 rtl:-scale-x-100" />
                </a>
            </div>

            <div className="space-y-3">
                {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={faq.id}
                            className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${
                                isOpen ? "border-beige-dark bg-foam" : "border-latte hover:border-beige-dark"
                            }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={isOpen}
                                className="w-full px-5 py-4 text-right flex items-center justify-between gap-4 transition-colors"
                            >
                                <span className="text-sm md:text-base font-semibold text-ink flex-1">
                                    {faq.question}
                                </span>
                                <span
                                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                        isOpen ? "bg-roast text-foam rotate-180" : "bg-beige text-clay"
                                    }`}
                                >
                                    <ChevronDownIcon className="w-4 h-4" />
                                </span>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    isOpen ? "max-h-96" : "max-h-0"
                                }`}
                            >
                                <div className="px-5 pb-4 text-sm md:text-[0.95rem] text-clay leading-relaxed border-t border-latte/70 pt-3">
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
