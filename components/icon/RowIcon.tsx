export function RowIcon({ name }: { name: "device" | "blend" | "pour" | "amount" | "taste" }) {
    const common = {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        className: "h-4 w-4 shrink-0 text-caramel/80",
        "aria-hidden": true,
    };
    switch (name) {
        case "device":
            return (
                <svg {...common}>
                    <rect x="4" y="4" width="16" height="12" rx="2" />
                    <path d="M8 20h8M12 16v4" />
                </svg>
            );
        case "blend":
            return (
                <svg {...common}>
                    <circle cx="9" cy="9" r="4" />
                    <circle cx="15" cy="15" r="4" />
                </svg>
            );
        case "pour":
            return (
                <svg {...common}>
                    <path d="M4 8h12l-1.5 10h-9z" />
                    <path d="M16 10h3a2 2 0 0 1 0 4h-3" />
                </svg>
            );
        case "amount":
            return (
                <svg {...common}>
                    <path d="M5 20V8l7-5 7 5v12" />
                    <path d="M9 20v-6h6v6" />
                </svg>
            );
        case "taste":
            return (
                <svg {...common}>
                    <path d="M12 3v4M5 10h14M6 10l1 10h10l1-10" />
                </svg>
            );
    }
}
