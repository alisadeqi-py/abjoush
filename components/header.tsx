"use client";

import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
    { href: "#products", label: "محصولات" },
    { href: "#testimonials", label: "نظرات" },
    { href: "#about", label: "درباره قهوه" },
    { href: "#faq", label: "سوالات متداول" },
];

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

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="sticky top-0 z-40 w-full bg-foam/85 backdrop-blur border-b border-latte">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 md:px-6 lg:px-8 h-16">
                {/* Brand — first in RTL DOM order, appears on the right */}
                <a href="#" className="flex items-center gap-2 shrink-0" aria-label="آبجوش — صفحه اصلی">
                    <span className="text-xl md:text-2xl font-extrabold text-ink tracking-tight">
                        آبجوش
                    </span>
                    <span className="bg-beige text-clay text-[0.6rem] font-bold px-2 py-0.5 rounded-full tracking-wider">
                        قهوه
                    </span>
                </a>

                {/* Desktop nav — middle */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-clay">
                    {NAV_LINKS.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            className="hover:text-ink transition-colors"
                        >
                            {label}
                        </a>
                    ))}
                </nav>

                {/* Search + mobile toggle — end (left in RTL) */}
                <div className="flex items-center gap-2">
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isSearchOpen ? "max-w-40 sm:max-w-48" : "max-w-0"
                        }`}
                    >
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="جستجو..."
                            className="w-40 sm:w-48 px-4 py-1.5 text-sm bg-beige rounded-full border border-latte focus:outline-none focus:ring-2 focus:ring-caramel/40 transition-all"
                            dir="rtl"
                        />
                    </div>

                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="w-9 h-9 rounded-full bg-beige flex items-center justify-center text-clay hover:bg-beige-dark hover:text-ink transition-colors shrink-0"
                        aria-label={isSearchOpen ? "بستن جستجو" : "جستجو"}
                        aria-expanded={isSearchOpen}
                    >
                        <SearchIcon className="w-4 h-4" />
                    </button>

                    <button
                        className="md:hidden w-9 h-9 rounded-full bg-beige flex items-center justify-center text-clay hover:bg-beige-dark hover:text-ink transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "بستن منو" : "منو"}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <CloseIcon className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <nav className="md:hidden border-t border-latte bg-foam px-4 py-3 flex flex-col text-sm font-medium text-clay">
                    {NAV_LINKS.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            onClick={closeMenu}
                            className="py-2.5 hover:text-ink transition-colors border-b border-latte/60 last:border-0"
                        >
                            {label}
                        </a>
                    ))}
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
