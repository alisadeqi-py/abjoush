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
        <div className="w-full m-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden flex-nowrap ">
                {categories.map((category) => {
                    const isActive = active === category;
                    return (
                        <button
                            key={category}
                            onClick={() => setActive(category)}
                            className={`whitespace-nowrap p-8 rounded-2xl text-sm font-medium transition-all duration-200 shrink-0
                ${isActive
                                    ? "bg-[#1f1b17] text-white shadow-sm"
                                    : " text-[#4b3f34] border border-[#eae5de] hover:border-[#d4cbc0] hover:bg-[#faf8f5]"
                                }
              `}
                        >
                            {category}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}