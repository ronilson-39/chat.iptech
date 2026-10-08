import React from 'react';

interface IPTechLogoProps {
  className?: string;
  size?: number;
}

export const IPTechLogo: React.FC<IPTechLogoProps> = ({
  className = 'w-8 h-8',
  size,
}) => {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Background Mint/Emerald Speech Bubble */}
      <path
        d="M60 25 C30 25 15 45 15 75 V280 C15 315 35 335 70 335 H85 V395 C85 402 95 406 100 401 L170 335 H310 C345 335 365 315 365 280 V75 C365 45 350 25 320 25 Z"
        fill="#10DF8B"
      />
      {/* Front Slate/Indigo Speech Bubble */}
      <path
        d="M175 145 C145 145 130 165 130 195 V390 C130 420 150 440 180 440 H380 L445 498 C450 502 460 498 460 491 V440 H465 C495 440 510 420 510 390 V195 C510 165 495 145 465 145 Z"
        fill="#514F86"
      />
      {/* Three Horizontal Light Sky Blue Message Lines */}
      <rect x="185" y="210" width="270" height="30" rx="8" fill="#BDE3FE" />
      <rect x="185" y="275" width="270" height="30" rx="8" fill="#BDE3FE" />
      <rect x="185" y="340" width="270" height="30" rx="8" fill="#BDE3FE" />
    </svg>
  );
};
