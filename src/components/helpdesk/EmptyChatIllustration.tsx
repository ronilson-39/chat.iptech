import React from 'react';

interface EmptyChatIllustrationProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const EmptyChatIllustration: React.FC<EmptyChatIllustrationProps> = ({
  className = 'w-64 h-64 md:w-80 md:h-80',
  width,
  height,
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width, height }}
    >
      {/* Background Soft Mint / Cyan Cloud Silhouette */}
      <g opacity="0.95">
        {/* Soft cyan main cloud puff */}
        <path
          d="M130 330 C90 330 60 290 60 240 C60 190 95 160 135 155 C150 100 210 70 270 75 C330 80 380 120 395 165 C435 170 465 200 465 245 C465 295 430 335 385 340 C360 410 270 440 200 425 C150 415 130 370 130 330 Z"
          fill="#B2EBF2"
          opacity="0.85"
        />
        {/* Motion dash pills on top right */}
        <rect x="300" y="88" width="24" height="6" rx="3" fill="#E0F7FA" />
        <rect x="330" y="88" width="40" height="6" rx="3" fill="#E0F7FA" />
        <rect x="320" y="102" width="55" height="6" rx="3" fill="#E0F7FA" />
        {/* Motion dash pills on mid left */}
        <rect x="58" y="235" width="28" height="6" rx="3" fill="#E0F7FA" />
        <rect x="92" y="235" width="16" height="6" rx="3" fill="#E0F7FA" />
        <rect x="52" y="249" width="34" height="6" rx="3" fill="#E0F7FA" />
      </g>

      {/* Main Window Box */}
      <g id="window-frame">
        {/* Window Shadow / Under-layer */}
        <rect
          x="154"
          y="154"
          width="200"
          height="190"
          rx="26"
          fill="#FFFDF7"
        />
        {/* Window Border Outline */}
        <rect
          x="154"
          y="154"
          width="200"
          height="190"
          rx="26"
          fill="#FFFDF7"
          stroke="#332724"
          strokeWidth="7"
          strokeLinejoin="round"
        />

        {/* Window Header Dots */}
        <circle cx="182" cy="176" r="6.5" fill="#EF4444" stroke="#332724" strokeWidth="2.5" />
        <circle cx="202" cy="176" r="6.5" fill="#FBBF24" stroke="#332724" strokeWidth="2.5" />
        <circle cx="222" cy="176" r="6.5" fill="#34D399" stroke="#332724" strokeWidth="2.5" />

        {/* Window Header Divider Line */}
        <path
          d="M165 190 H260 M290 190 H345"
          stroke="#332724"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Window Bottom Inner Guideline */}
        <path
          d="M170 330 H185 M195 330 H335"
          stroke="#332724"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* Right Speech Bubble (Greyish Beige) */}
      <g id="bubble-right">
        {/* Tail and Bubble Path */}
        <path
          d="M260 215 C260 200 275 195 305 195 C345 195 375 210 375 245 C375 275 348 290 310 290 C302 290 294 298 288 304 C286 306 280 300 282 292 L283 288 C265 282 260 260 260 240 Z"
          fill="#E7E3DC"
          stroke="#332724"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Text Lines in Right Bubble */}
        <line x1="285" y1="225" x2="345" y2="225" stroke="#332724" strokeWidth="4" strokeLinecap="round" />
        <line x1="280" y1="238" x2="355" y2="238" stroke="#332724" strokeWidth="4" strokeLinecap="round" />
        <line x1="285" y1="250" x2="330" y2="250" stroke="#332724" strokeWidth="4" strokeLinecap="round" />

        {/* Teal Circular Badge with 3 Dots (...) */}
        <circle cx="285" cy="275" r="23" fill="#14B8A6" stroke="#332724" strokeWidth="5" />
        <circle cx="275" cy="275" r="2.8" fill="#FFFFFF" />
        <circle cx="285" cy="275" r="2.8" fill="#FFFFFF" />
        <circle cx="295" cy="275" r="2.8" fill="#FFFFFF" />
      </g>

      {/* Left Speech Bubble (White) */}
      <g id="bubble-left">
        {/* Tail and Bubble Path */}
        <path
          d="M135 250 C135 220 160 220 190 220 C230 220 250 240 250 270 C250 295 230 315 195 315 C185 315 170 326 155 330 C154 326 158 316 156 312 C142 305 135 285 135 250 Z"
          fill="#FFFFFF"
          stroke="#332724"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Text Lines in Left Bubble */}
        <line x1="155" y1="250" x2="225" y2="250" stroke="#332724" strokeWidth="4" strokeLinecap="round" />
        <line x1="150" y1="265" x2="215" y2="265" stroke="#332724" strokeWidth="4" strokeLinecap="round" />

        {/* Teal Circular Badge with Edit Pencil */}
        <circle cx="225" cy="298" r="23" fill="#0D9488" stroke="#332724" strokeWidth="5" />
        {/* White Pencil Icon */}
        <g transform="translate(216, 289) rotate(45)">
          <path
            d="M2 12 L0 18 L6 16 L16 6 L12 2 Z"
            fill="#FFFFFF"
          />
          <path
            d="M12 2 L16 6"
            stroke="#0D9488"
            strokeWidth="1.5"
          />
        </g>
      </g>

      {/* Puffy White Cloud overlapping bottom-left */}
      <g id="cloud-bottom">
        <path
          d="M100 350 C100 335 112 322 128 322 C131 310 142 300 156 300 C172 300 184 314 184 330 C194 330 202 338 202 348 C202 360 192 370 180 370 H115 C107 370 100 361 100 350 Z"
          fill="#FFFFFF"
          stroke="#332724"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
