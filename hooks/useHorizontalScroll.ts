import { useRef, useState, useEffect, useCallback } from "react";

export interface UseHorizontalScrollResult {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  showLeftFade: boolean;
  showRightFade: boolean;
  scrollByAmount: (direction: "left" | "right") => void;
  cardWidthWithGap: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Shared hook for horizontal scroll containers with:
 * - Mouse wheel → horizontal scroll translation (desktop fix)
 * - Click-and-drag scrolling (desktop fix)
 * - Fade indicator state (left/right)
 * - Programmatic scroll by card width
 */
export function useHorizontalScroll(cardWidth: number, gap: number): UseHorizontalScrollResult {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const cardWidthWithGap = cardWidth + gap;

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
    el.scrollBy({
      left: direction === "right" ? cardWidthWithGap : -cardWidthWithGap,
      behavior: "smooth",
    });
  }, [cardWidthWithGap]);

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

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      el.removeEventListener("wheel", handleWheel);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [checkScroll, handleWheel, handleMouseMove, handleMouseUp]);

  return {
    scrollRef,
    showLeftFade,
    showRightFade,
    scrollByAmount,
    cardWidthWithGap,
    onMouseDown: handleMouseDown,
  };
}
