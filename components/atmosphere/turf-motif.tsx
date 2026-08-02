/** Contour turf-line motif — decorative only. */
export function TurfMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden
      viewBox="0 0 800 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 140 C120 100 200 160 320 120 C440 80 520 150 640 110 C720 85 760 95 800 80"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <path
        d="M0 165 C140 130 220 175 340 145 C460 115 540 170 660 140 C740 120 770 125 800 115"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.22"
      />
      <path
        d="M0 185 C100 160 240 190 360 165 C480 140 560 185 700 160 C760 148 780 150 800 145"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.14"
      />
    </svg>
  )
}
