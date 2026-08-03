/** Contour turf-line motif — decorative only (`aria-hidden`). */

export type TurfMotifCoverage = "band" | "full"
export type TurfMotifIntensity = "soft" | "medium" | "strong"
export type TurfMotifVariant = "contours" | "ribs"

type TurfMotifProps = {
  className?: string
  coverage?: TurfMotifCoverage
  intensity?: TurfMotifIntensity
  variant?: TurfMotifVariant
}

const INTENSITY_OPACITY: Record<TurfMotifIntensity, string> = {
  soft: "opacity-[0.10]",
  medium: "opacity-[0.14]",
  strong: "opacity-[0.18]",
}

function ContoursPaths() {
  return (
    <>
      <path
        d="M0 80 C100 40 180 110 300 70 C420 30 500 100 620 60 C720 30 760 45 800 35"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.45"
      />
      <path
        d="M0 120 C120 85 220 140 340 105 C460 70 540 135 660 100 C740 75 770 85 800 75"
        stroke="currentColor"
        strokeWidth="1.35"
        opacity="0.32"
      />
      <path
        d="M0 155 C90 125 210 170 340 140 C470 110 560 165 690 145 C760 132 780 135 800 128"
        stroke="currentColor"
        strokeWidth="1.15"
        opacity="0.22"
      />
      <path
        d="M0 185 C110 160 230 195 360 170 C490 145 580 190 710 168 C760 158 780 160 800 155"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.16"
      />
    </>
  )
}

/** Vertical “rib” contours — second pattern for section variety. */
function RibsPaths() {
  return (
    <>
      <path
        d="M40 0 C55 60 25 120 50 200 C70 280 30 360 55 480 C75 560 35 640 50 720 C60 780 45 820 40 900"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.28"
      />
      <path
        d="M160 0 C145 80 175 160 155 260 C135 360 170 450 150 560 C130 650 165 740 155 900"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.2"
      />
      <path
        d="M300 0 C320 70 280 150 310 250 C340 360 290 460 315 580 C335 680 295 780 310 900"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.24"
      />
      <path
        d="M460 0 C440 90 480 180 455 290 C430 400 475 510 450 620 C430 720 470 810 455 900"
        stroke="currentColor"
        strokeWidth="1.05"
        opacity="0.18"
      />
      <path
        d="M620 0 C645 75 605 165 630 270 C655 380 610 490 635 600 C655 700 615 800 625 900"
        stroke="currentColor"
        strokeWidth="1.15"
        opacity="0.22"
      />
      <path
        d="M740 0 C720 85 760 175 735 290 C710 400 755 520 730 640 C715 740 750 830 740 900"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.16"
      />
    </>
  )
}

export function TurfMotif({
  className = "",
  coverage = "band",
  intensity = "medium",
  variant = "contours",
}: TurfMotifProps) {
  const isFull = coverage === "full"
  const opacityClass = INTENSITY_OPACITY[intensity]
  const viewBox = variant === "ribs" ? "0 0 800 900" : isFull ? "0 0 800 220" : "0 0 800 200"

  return (
    <svg
      className={`${opacityClass} text-primary ${className}`}
      aria-hidden
      viewBox={viewBox}
      preserveAspectRatio={isFull ? "none" : "xMidYMin slice"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {variant === "ribs" ? <RibsPaths /> : <ContoursPaths />}
      {isFull && variant === "contours" && (
        <>
          {/* Extra mid-band contours for full-height stretch */}
          <path
            d="M0 40 C130 10 210 55 350 25 C490 -5 570 50 710 20 C760 8 780 12 800 5"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.2"
          />
          <path
            d="M0 210 C150 180 250 230 400 195 C550 160 640 225 760 200 C780 195 790 198 800 195"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.14"
          />
        </>
      )}
    </svg>
  )
}
