
export function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* RTL: arrow points left */}
            <path d="M15 6l-6 6 6 6" />
        </svg>
    );
}