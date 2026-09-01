"use client";

import { useState, useEffect, useRef } from "react";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    // Focus the search input when it opens
    useEffect(() => {
        if (isSearchOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [isSearchOpen]);

    return (
        <header className="w-full bg-white border border-[#eae5de] px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
                {/* Logo / Brand */}
                <div className="flex items-center gap-2">
                    <p className=" font-bold text-[#1f1b17] tracking-tight">
                        دسته بندی مقالات
                    </p>
                </div>


                {/* Right side: Search & Mobile toggle */}
                <div className="flex items-center gap-3">
                    {/* Search Input */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? "max-w-48 md:max-w-56" : "max-w-0"
                            } md:max-w-56 md:overflow-visible`}
                    >
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="جستجو..."
                            className="w-48 md:w-56 px-4 py-1.5 text-sm bg-[#f2efe9] rounded-full border border-[#eae5de] focus:outline-none focus:ring-2 focus:ring-[#d4cbc0] transition-all"
                            dir="rtl"
                        />
                    </div>

                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="w-9 h-9 rounded-full bg-[#f2efe9] flex items-center justify-center text-[#4b3f34] hover:bg-[#e6dfd6] transition-colors flex-shrink-0"
                        aria-label="جستجو"
                    >
                        <SearchIcon className="w-4 h-4" />
                    </button>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden w-9 h-9 rounded-full bg-[#f2efe9] flex items-center justify-center text-[#4b3f34] hover:bg-[#e6dfd6] transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="منو"
                    >
                        {isMenuOpen ? (
                            <CloseIcon className="w-4 h-4" />
                        ) : (
                            <MenuIcon className="w-4 h-4" />
                        )}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#1f1b17] tracking-tight">
                        abjosh
                    </span>
                    <span className="bg-[#f2efe9] text-[#4b3f34] text-[0.55rem] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        قهوه
                    </span>
                </div>

            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <nav className="md:hidden mt-4 pt-4 border-t border-[#eae5de] flex flex-col gap-3 text-sm font-medium text-[#6b6154]">
                    <a href="#" className="hover:text-[#1f1b17] transition-colors py-1">
                        الأسواق
                    </a>
                    <a href="#" className="hover:text-[#1f1b17] transition-colors py-1">
                        مستندات كاملة
                    </a>
                    <a href="#" className="hover:text-[#1f1b17] transition-colors py-1">
                        استبداد
                    </a>
                    <a href="#" className="hover:text-[#1f1b17] transition-colors py-1">
                        درباره ما
                    </a>
                    <a href="#" className="hover:text-[#1f1b17] transition-colors py-1">
                        تماس
                    </a>
                </nav>
            )}
        </header>
    );
}

// Simple icon components
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}