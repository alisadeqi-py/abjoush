"use client";

import { useState } from "react";

const categories = [
    "پودر ترکیبی",
    "قهوه دمی",
    "قهوه فرانسه",
    "قهوه ترک",
    "اسپرسو",
    "قهوه",
];

export function CategoryFilter() {
    const [active, setActive] = useState("قهوه دمی");

    return (
        <div
            className="w-full mt-10"
            role="tablist"
            aria-label="دسته‌بندی محصولات"
        >
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden flex-nowrap">
                {categories.map((category) => {
                    const isActive = active === category;
                    return (
                        <button
                            key={category}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setActive(category)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shrink-0 ${
                                isActive
                                    ? "bg-espresso text-foam shadow-md"
                                    : "text-clay bg-foam border border-latte hover:border-beige-dark hover:bg-beige"
                            }`}
                        >
                            {category}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
