"use client";

interface ScrollButtonProps {
  direction: "left" | "right";
  onClick: () => void;
}

export function ScrollButton({ direction, onClick }: ScrollButtonProps) {
  const isLeft = direction === "left";

  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-full bg-foam border border-latte
                 flex items-center justify-center text-clay
                 hover:bg-espresso hover:border-espresso hover:text-foam
                 active:scale-95
                 transition-all duration-200 shadow-sm
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
      aria-label={isLeft ? "اسکرول به چپ" : "اسکرول به راست"}
    >
      {isLeft ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </button>
  );
}
