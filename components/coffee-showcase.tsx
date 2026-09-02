"use client";

import { ProductCard, type ProductCardProps } from "./product-card";
import { ScrollButton } from "./scroll-button";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { PRODUCT_CARD_WIDTH, CARD_GAP } from "@/lib/constants";

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

export interface CoffeeShowcaseProps {
  title?: string;
  subtitle?: string;
  /** DOM id for the section, useful for anchor navigation. */
  sectionId?: string;
  products?: (Omit<ProductCardProps, "gradeType"> & {
    gradeType: "nik" | "motevaset";
    id: number;
  })[];
}

export function CoffeeShowcase({
  title = "پرفروش ترین ها",
  subtitle = "قهوه‌ای برای هر سلیقه",
  sectionId,
  products: customProducts,
}: CoffeeShowcaseProps) {
  const items = customProducts ?? products;

  const {
    scrollRef,
    showLeftFade,
    showRightFade,
    scrollProgress,
    scrollByAmount,
    onMouseDown,
  } = useHorizontalScroll(PRODUCT_CARD_WIDTH, CARD_GAP);

  return (
    <section
      id={sectionId}
      aria-label={`اسکرول افقی ${title}`}
      className="w-full relative border border-latte rounded-3xl bg-cream shadow-sm px-4 md:px-6 lg:px-8 mt-10"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">
            {title}
          </h2>
          <p className="text-clay text-sm md:text-base mt-1 font-medium">
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
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-cream via-cream/80 to-transparent pointer-events-none z-10 rounded-l-3xl" />
        )}
        {/* Right fade */}
        {showRightFade && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-cream via-cream/80 to-transparent pointer-events-none z-10 rounded-r-3xl" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-auto pb-6 pt-2 scroll-px-4 scrollbar-hidden flex-nowrap cursor-grab"
          onMouseDown={onMouseDown}
        >
          {items.map(({ id, ...props }) => (
            <ProductCard key={id} {...props} />
          ))}
        </div>
      </div>

      {/* Live scroll progress (fills as the user scrolls the row) */}
      <div
        className="h-1 w-40 mx-auto mt-2 rounded-full bg-latte overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`پیشرفت اسکرول ${title}`}
      >
        <div
          className="h-full rounded-full bg-roast transition-[width] duration-150 ease-out"
          style={{ width: `${Math.max(6, Math.round(scrollProgress * 100))}%` }}
        />
      </div>
    </section>
  );
}
