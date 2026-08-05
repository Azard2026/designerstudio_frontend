"use client";

import React from "react";

interface KelebekLogoProps {
  className?: string;
  variant?: "full" | "icon" | "horizontal";
  height?: number | string;
  lightMode?: boolean;
}

export default function KelebekLogo({
  className = "",
  variant = "full",
  height = 50,
  lightMode = false,
}: KelebekLogoProps) {
  const primaryTextColor = lightMode ? "#121212" : "#FFFFFF";
  const goldColor = "#C9A96E";
  const goldGradientId = `gold-grad-${Math.random().toString(36).substr(2, 5)}`;
  const darkKColor = lightMode ? "#0D0D0D" : "#1A1E24";

  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 120 120"
        height={height}
        className={className}
        style={{ display: "block", height: typeof height === "number" ? `${height}px` : height }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={goldGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBA75" />
            <stop offset="50%" stopColor="#C9A96E" />
            <stop offset="100%" stopColor="#9E7D3B" />
          </linearGradient>
        </defs>
        {/* Frame Outer Line */}
        <path d="M 25,85 L 25,30 L 55,10 L 55,85" stroke={`url(#${goldGradientId})`} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Floor Line */}
        <line x1="25" y1="85" x2="100" y2="85" stroke={`url(#${goldGradientId})`} strokeWidth="3" />
        {/* Lamp */}
        <line x1="50" y1="10" x2="50" y2="28" stroke="#333" strokeWidth="1.5" />
        <path d="M 44,28 Q 50,22 56,28 L 54,34 Z" fill="#222" />
        <circle cx="50" cy="35" r="2.5" fill="#FFE599" />
        {/* Plant */}
        <path d="M 64,85 L 68,73 L 72,85 Z" fill={`url(#${goldGradientId})`} />
        <circle cx="68" cy="67" r="5" fill="#1B4D3E" />
        <circle cx="64" cy="69" r="4" fill="#2A6652" />
        <circle cx="72" cy="69" r="4" fill="#2A6652" />
        {/* Chair */}
        <path d="M 33,76 C 33,65 48,65 48,76 L 48,85 L 33,85 Z" fill="#1F3A30" stroke={`url(#${goldGradientId})`} strokeWidth="1" />
        {/* Main K Serif */}
        <text x="65" y="83" fontFamily="Playfair Display, Georgia, serif" fontSize="72" fontWeight="700" fill={darkKColor} textAnchor="middle">
          K
        </text>
        {/* Diagonal Arm in Gold */}
        <path d="M 62,50 L 98,15 L 104,22 L 72,55 L 102,84 L 94,85 Z" fill={`url(#${goldGradientId})`} />
      </svg>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-3 ${className}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem" }}>
        <svg
          viewBox="0 0 120 100"
          height={height}
          style={{ height: typeof height === "number" ? `${height}px` : height, width: "auto" }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={goldGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFBA75" />
              <stop offset="50%" stopColor="#C9A96E" />
              <stop offset="100%" stopColor="#9E7D3B" />
            </linearGradient>
          </defs>
          <path d="M 20,85 L 20,25 L 50,8 L 50,85" stroke={`url(#${goldGradientId})`} strokeWidth="3" fill="none" />
          <line x1="20" y1="85" x2="95" y2="85" stroke={`url(#${goldGradientId})`} strokeWidth="3" />
          {/* Lamp */}
          <line x1="45" y1="8" x2="45" y2="24" stroke="#555" strokeWidth="1.5" />
          <path d="M 40,24 Q 45,19 50,24 L 48,29 Z" fill="#222" />
          <circle cx="45" cy="30" r="2" fill="#FFE599" />
          {/* Chair */}
          <path d="M 26,76 C 26,67 40,67 40,76 L 40,85 L 26,85 Z" fill="#1B3B2B" stroke={`url(#${goldGradientId})`} strokeWidth="0.8" />
          {/* Plant */}
          <circle cx="60" cy="70" r="5" fill="#2E5A44" />
          {/* Main K */}
          <text x="58" y="84" fontFamily="Playfair Display, serif" fontSize="68" fontWeight="700" fill={darkKColor} textAnchor="middle">
            K
          </text>
          <path d="M 55,50 L 92,15 L 98,22 L 67,54 L 96,84 Z" fill={`url(#${goldGradientId})`} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1.25rem",
              letterSpacing: "0.22em",
              color: primaryTextColor,
              lineHeight: 1.1,
              textTransform: "uppercase",
            }}
          >
            KELEBEK
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.55rem",
              letterSpacing: "0.35em",
              color: goldColor,
              textTransform: "uppercase",
              marginTop: "3px",
              fontWeight: 600,
            }}
          >
            DESIGNERS
          </span>
        </div>
      </div>
    );
  }

  // Full Variant (Stacked Luxury Logo)
  return (
    <div
      className={`kelebek-logo-wrapper ${className}`}
      style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", textDecoration: "none" }}
    >
      <svg
        viewBox="0 0 200 150"
        height={height}
        style={{ height: typeof height === "number" ? `${height}px` : height, width: "auto", overflow: "visible" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={goldGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3E5AB" />
            <stop offset="35%" stopColor="#DFBA75" />
            <stop offset="70%" stopColor="#C9A96E" />
            <stop offset="100%" stopColor="#8C6D3B" />
          </linearGradient>
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Frame structure */}
        <path d="M 40,115 L 40,30 L 78,8 L 78,115" stroke={`url(#${goldGradientId})`} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="38" y1="115" x2="160" y2="115" stroke={`url(#${goldGradientId})`} strokeWidth="3.5" strokeLinecap="round" />

        {/* Lamp */}
        <line x1="72" y1="8" x2="72" y2="35" stroke="#666" strokeWidth="2" />
        <path d="M 62,35 Q 72,28 82,35 L 79,44 L 65,44 Z" fill="#1A1A1A" stroke={`url(#${goldGradientId})`} strokeWidth="1" />
        <circle cx="72" cy="46" r="3.5" fill="#FFEAA7" filter="url(#gold-glow)" />

        {/* Armchair */}
        <path d="M 48,102 C 48,88 68,88 68,102 L 68,115 L 48,115 Z" fill="#143527" stroke={`url(#${goldGradientId})`} strokeWidth="1.2" />
        {/* Chair Legs */}
        <line x1="50" y1="115" x2="48" y2="122" stroke={`url(#${goldGradientId})`} strokeWidth="1.5" />
        <line x1="66" y1="115" x2="68" y2="122" stroke={`url(#${goldGradientId})`} strokeWidth="1.5" />

        {/* Plant */}
        <path d="M 94,115 L 97,100 L 105,100 L 108,115 Z" fill={`url(#${goldGradientId})`} />
        <path d="M 101,100 Q 92,85 85,88 Q 98,82 101,100 Z" fill="#2D5A44" />
        <path d="M 101,100 Q 110,83 118,87 Q 105,80 101,100 Z" fill="#1B4230" />
        <path d="M 101,100 Q 101,78 102,74 Q 105,82 101,100 Z" fill="#3D755A" />

        {/* Letter K Base Body */}
        <text
          x="95"
          y="114"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="108"
          fontWeight="800"
          fill={darkKColor}
          textAnchor="middle"
        >
          K
        </text>

        {/* K Diagonal Gold Arm */}
        <path
          d="M 92,66 L 152,18 L 160,26 L 110,72 L 158,114 L 148,115 Z"
          fill={`url(#${goldGradientId})`}
        />
      </svg>

      <div style={{ textAlign: "center", marginTop: "2px" }}>
        <div
          style={{
            fontFamily: "'Playfair Display', 'Cinzel', serif",
            fontWeight: 700,
            fontSize: "1.45rem",
            letterSpacing: "0.28em",
            color: primaryTextColor,
            lineHeight: 1.1,
            textTransform: "uppercase",
          }}
        >
          KELEBEK
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", margin: "4px 0" }}>
          <div style={{ height: "1px", width: "24px", background: goldColor, opacity: 0.8 }} />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.45em",
              color: goldColor,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            DESIGNERS
          </span>
          <div style={{ height: "1px", width: "24px", background: goldColor, opacity: 0.8 }} />
        </div>

        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.5rem",
            letterSpacing: "0.25em",
            color: lightMode ? "#666" : "#A0AAB8",
            textTransform: "uppercase",
            fontWeight: 400,
          }}
        >
          INTERIOR DESIGN &amp; SPACES
        </div>
      </div>
    </div>
  );
}
