import React from 'react';

export default function WiiishLogo({ className = "h-12" }) {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 320 100" className="w-auto h-full drop-shadow-sm overflow-visible">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#70B8FF" />
            <stop offset="50%" stopColor="#8AC6FF" />
            <stop offset="100%" stopColor="#5CA8FF" />
          </linearGradient>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9ECD" />
            <stop offset="100%" stopColor="#FF70B5" />
          </linearGradient>
        </defs>

        <path d="M 30,20 L 32,25 L 37,27 L 32,29 L 30,34 L 28,29 L 23,27 L 28,25 Z" fill="#FFB7DC" opacity="0.8"/>
        <path d="M 280,15 L 281,18 L 284,19 L 281,20 L 280,23 L 279,20 L 276,19 L 279,18 Z" fill="#70B8FF" opacity="0.9"/>
        <path d="M 295,70 L 297,74 L 301,75 L 297,76 L 295,80 L 293,76 L 289,75 L 293,74 Z" fill="#FFB7DC" opacity="0.8"/>

        <path d="M 25 35 C 20 25, 30 20, 35 25 C 40 32, 42 62, 45 68 C 47 72, 53 72, 56 65 C 60 55, 65 40, 70 38 C 73 37, 76 42, 78 52 C 80 62, 83 68, 87 68 C 91 68, 98 52, 105 38 C 110 28, 105 20, 95 24 C 90 26, 88 32, 92 34" 
              fill="none" stroke="url(#logoGradient)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />

        <path d="M 122 42 L 122 68 C 122 73, 126 75, 130 71" fill="none" stroke="url(#logoGradient)" strokeWidth="10" strokeLinecap="round" />
        <polygon points="122,18 124,23 129,23 125,26 126,31 122,28 118,31 119,26 115,23 120,23" fill="url(#starGradient)" />

        <path d="M 148 42 L 148 68 C 148 73, 152 75, 156 71" fill="none" stroke="url(#logoGradient)" strokeWidth="10" strokeLinecap="round" />
        <polygon points="148,18 150,23 155,23 151,26 152,31 148,28 144,31 145,26 141,23 146,23" fill="url(#starGradient)" />

        <path d="M 174 42 L 174 68 C 174 73, 178 75, 182 71" fill="none" stroke="url(#logoGradient)" strokeWidth="10" strokeLinecap="round" />
        <polygon points="174,18 176,23 181,23 177,26 178,31 174,28 170,31 171,26 167,23 172,23" fill="url(#starGradient)" />

        <path d="M 218 42 C 205 38, 198 48, 204 55 C 210 62, 216 64, 210 70 C 204 76, 195 71, 192 66" 
              fill="none" stroke="url(#logoGradient)" strokeWidth="10" strokeLinecap="round" />

        <path d="M 230 20 L 230 68 C 230 72, 233 74, 237 70 L 237 54 C 237 45, 248 42, 254 48 C 260 54, 258 68, 262 72 C 266 76, 275 73, 278 68 C 282 60, 278 52, 272 56" 
              fill="none" stroke="url(#logoGradient)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
