// ─────────────────────────────────────────────
// PAWWS Admin — Paw Footprints Loading Screen (Web)
// White background → 7 black vector paw footprints → sequential walking animation
// ─────────────────────────────────────────────

import React from 'react';

interface PawLoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export const PawLoader: React.FC<PawLoaderProps> = ({
  fullScreen = true,
  message = 'Loading PAWWS Admin...',
}) => {
  const PAWS_COUNT = 7;
  const pawsArray = Array.from({ length: PAWS_COUNT });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        width: fullScreen ? '100vw' : '100%',
        height: fullScreen ? '100vh' : 'auto',
        minHeight: fullScreen ? '100vh' : '280px',
        padding: '32px 16px',
        boxSizing: 'border-box',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <style>{`
        @keyframes pawStep {
          0% {
            opacity: 0.12;
            transform: scale(0.75);
          }
          30% {
            opacity: 1;
            transform: scale(1.1);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          75% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          100% {
            opacity: 0.12;
            transform: scale(0.75);
          }
        }
        .paw-print {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          animation: pawStep 1.8s infinite ease-in-out;
        }
      `}</style>

      {/* 7 Paw Prints Walking Trail */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          height: '60px',
          marginBottom: '20px',
        }}
      >
        {pawsArray.map((_, i) => {
          const isLeft = i % 2 === 0;
          const delay = `${i * 0.15}s`;
          const rotateDeg = isLeft ? '-14deg' : '14deg';
          const translateY = isLeft ? '-6px' : '6px';

          return (
            <div
              key={`paw-${i}`}
              className="paw-print"
              style={{
                animationDelay: delay,
                transform: `rotate(${rotateDeg}) translateY(${translateY})`,
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#1A1A1A">
                {/* Center heel pad */}
                <path d="M12 11.5c-2.3 0-4.1 1.7-4.1 3.7 0 1.9 1.5 3.3 3.3 3.3.6 0 1.1-.3 1.5-.7.4.4.9.7 1.5.7 1.8 0 3.3-1.4 3.3-3.3 0-2-1.8-3.7-4.1-3.7-.3 0-.6.1-.9.2-.3-.1-.6-.2-.9-.2z" />
                {/* Toe 1 */}
                <path d="M6.5 9.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2z" />
                {/* Toe 2 */}
                <path d="M10 7.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2z" />
                {/* Toe 3 */}
                <path d="M14 7.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2z" />
                {/* Toe 4 */}
                <path d="M17.5 9.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2z" />
              </svg>
            </div>
          );
        })}
      </div>

      {/* Brand & Loading Label */}
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: '20px',
          color: '#1A1A1A',
          letterSpacing: '2px',
          marginBottom: '4px',
        }}
      >
        PAWWS
      </div>
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '13px',
          color: '#6B7280',
          letterSpacing: '0.2px',
        }}
      >
        {message}
      </div>
    </div>
  );
};
