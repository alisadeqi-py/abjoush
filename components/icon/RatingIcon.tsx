import { RatingKey } from '@/lib/content';
import React from 'react'

export function RatingIcon({
    name,
    className,
}: React.SVGProps<SVGSVGElement> & { name: RatingKey }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {name === "acidity" && (
                <path d="M12 2c-3.3 0-6 2.7-6 6 0 3.3 6 7.5 6 7.5s6-4.2 6-7.5C18 4.7 15.3 2 12 2z" />
            )}
            {name === "sweetness" && (
                <path d="M12 2l2.5 7.5H22l-5 4 2.5 7.5-5-4-5 4 2.5-7.5L4 9.5h9.5z" />
            )}
            {name === "bitterness" && (
                <>
                    <path d="M5 12c0-3.8 3.2-7 7-7s7 3.2 7 7-3.2 7-7 7-7-3.2-7-7z" />
                    <path d="M9 9c1.2 2.2 3.3 3.7 5.6 4" />
                    <path d="M15 9c-1.2-2.2-3.3-3.7-5.6-4" />
                </>
            )}
            {name !== "acidity" && name !== "sweetness" && name !== "bitterness" && (
                <circle cx="12" cy="12" r="3" />
            )}
        </svg>
    );
}
