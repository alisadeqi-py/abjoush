// components/scroll-button.tsx
"use client";

interface ScrollButtonProps {
  direction: "left" | "right";
  onClick: () => void;
}

export function ScrollButton({ direction, onClick }: ScrollButtonProps) {
  const isLeft = direction === "left";
  // In RTL, "right" means scroll forward (to the left visually)
  // but we keep it intuitive

  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full bg-white border border-[#eae5de] 
                 flex items-center justify-center text-[#5f5548]
                 hover:bg-[#f2efe9] hover:border-[#d4cbc0] 
                 transition-all duration-200 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-[#d4cbc0] focus:ring-offset-1"
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
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </button>
  );
}