export function CoffeeCupIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* cup body */}
            <path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
            {/* handle */}
            <path d="M16 9h1.5a2.5 2.5 0 0 1 0 5H16" />
            {/* saucer */}
            <path d="M3 21h14" />
        </svg>
    );
}