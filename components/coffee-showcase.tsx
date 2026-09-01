"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { ProductCard, type ProductCardProps } from "./product-card";
import { ScrollButton } from "./scroll-button";

const products: (Omit<ProductCardProps, "gradeType"> & {
  gradeType: "nik" | "motevaset";
  id: number;
})[] = [
  { id: 1, name: "قهوه دانه دارکریست ستون", weight: "۷۰۰ گرم", price: "۱,۷۵۰,۰۰۰", grade: "نیک", gradeType: "nik", image: "☕", type: "دانه" },
  { id: 2, name: "قهوه دانه دارکریست ستون", weight: "۷۰۰ گرم", price: "۱,۷۹۰,۰۰۰", grade: "نیک", gradeType: "nik", image: "☕", type: "دانه" },
  { id: 3, name: "قهوه دانه دارکریست ستون", weight: "۷۰۰ گرم", price: "۱,۷۶۵,۰۰۰", grade: "نیک", gradeType: "nik", image: "☕", type: "دانه" },
  { id: 4, name: "قهوه اسپرسو خانه ترکیبی", weight: "۷۰ گرم", price: "—", grade: "متوسط", gradeType: "motevaset", image: "☕", type: "اسپرسو" },
  { id: 5, name: "قهوه اسپرسو خانه دارکریست ستون", weight: "۱۰۰ گرم", price: "—", grade: "متوسط", gradeType: "motevaset", image: "☕", type: "اسپرسو" },
  { id: 6, name: "قهوه اسپرسوی خانه دارکریست ستون", weight: "—", price: "۱,۳۹۰,۰۰۰", grade: "متوسط", gradeType: "motevaset", image: "☕", type: "اسپرسو" },
  { id: 7, name: "قهوه اسپرسوی خانه دارکریست ستون", weight: "—", price: "۱,۷۸۵,۰۰۰", grade: "متوسط", gradeType: "motevaset", image: "☕", type: "اسپرسو" },
  { id: 8, name: "قهوه دانه دارکریست ویژه", weight: "۱ کیلوگرم", price: "۲,۴۵۰,۰۰۰", grade: "نیک", gradeType: "nik", image: "☕", type: "دانه" },
  { id: 9, name: "قهوه اسپرسو کلاسیک", weight: "۲۵۰ گرم", price: "۹۸۰,۰۰۰", grade: "متوسط", gradeType: "motevaset", image: "☕", type: "اسپرسو" },
  { id: 10, name: "قهوه دانه عربیکا", weight: "۵۰۰ گرم", price: "۲,۱۰۰,۰۰۰", grade: "نیک", gradeType: "nik", image: "☕", type: "دانه" },
];

export function CoffeeShowcase({
  title = "پرفروش ترین ها",
  subtitle = "قهوه‌ای برای هر سلیقه",
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftFade(scrollLeft > 10);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const scrollByAmount = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 220 + 16; // card (max-w-[220px]) + gap (gap-4 = 16px)
    el.scrollBy({
      left: direction === "right" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  }, []);

  // Convert vertical mouse-wheel to horizontal scroll (fixes desktop mouse wheel)
  const handleWheel = useCallback((e: WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    const target = e.target as HTMLElement;
    if (!el.contains(target)) return;

    const canScrollX = el.scrollWidth > el.clientWidth + 1;
    if (!canScrollX) return;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    el.scrollLeft += delta;
    e.preventDefault();
  }, []);

  // Mouse drag scrolling (click-and-drag to scroll horizontally)
  const handleMouseDown = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = true;
    startX.current = e.clientX;
    startScrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;

    const delta = startX.current - e.clientX;
    el.scrollLeft = startScrollLeft.current + delta;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = false;
    el.style.cursor = "";
    el.style.userSelect = "";
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    el.addEventListener("wheel", handleWheel, { passive: false });

    const handleMouseMoveDoc = (e: globalThis.MouseEvent) => handleMouseMove(e);
    const handleMouseUpDoc = () => handleMouseUp();

    document.addEventListener("mousemove", handleMouseMoveDoc);
    document.addEventListener("mouseup", handleMouseUpDoc);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      el.removeEventListener("wheel", handleWheel);
      document.removeEventListener("mousemove", handleMouseMoveDoc);
      document.removeEventListener("mouseup", handleMouseUpDoc);
    };
  }, [checkScroll, handleWheel, handleMouseMove, handleMouseUp]);

  return (
    <div className="w-full relative border border-[#e0dcd6] pb-6 rounded-2xl px-4 md:px-6 lg:px-8 mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1f1b17] tracking-tight">
            {title}
          </h2>
          <p className="text-[#6b6154] text-sm md:text-base mt-1 font-medium">
            {subtitle}
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-2">
          <ScrollButton direction="left" onClick={() => scrollByAmount("left")} />
          <ScrollButton direction="right" onClick={() => scrollByAmount("right")} />
        </div>
      </div>

      {/* Scroll container with fade indicators */}
      <div className="relative">
        {/* Left fade */}
        {showLeftFade && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-[#f8f6f3] via-[#f8f6f3]/80 to-transparent pointer-events-none z-10" />
        )}
        {/* Right fade */}
        {showRightFade && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-[#f8f6f3] via-[#f8f6f3]/80 to-transparent pointer-events-none z-10" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-auto pb-6 pt-2 scroll-px-4 scrollbar-hidden flex-nowrap cursor-grab"
          onMouseDown={handleMouseDown}
        >
          {products.map(({ id, ...props }) => (
            <ProductCard key={id} {...props} />
          ))}
        </div>
      </div>

      {/* Scroll hint dots */}
      <div className="flex justify-center gap-1 mt-1">
        {products.map((_, idx) => (
          <span
            key={idx}
            className="w-1.5 h-1.5 rounded-full bg-[#d4cbc0]"
          />
        ))}
      </div>
    </div>
  );
}
