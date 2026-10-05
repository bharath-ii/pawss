// ─────────────────────────────────────────────
// PAWWS Admin — Vector Icon Component (Web)
// Exact same icon family as Mobile
// ─────────────────────────────────────────────

import React from 'react';
import { ICON_PATHS, IconName } from '@pawws/shared';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  color = 'currentColor',
  strokeWidth = 2,
  className,
  ...rest
}) => {
  const iconData = ICON_PATHS[name] || ICON_PATHS.help;
  const viewBox = iconData.viewBox || '0 0 24 24';

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      className={className}
      style={{ verticalAlign: 'middle', flexShrink: 0 }}
      {...rest}
    >
      {/* Circles */}
      {iconData.circles?.map((c, i) => (
        <circle
          key={`c-${i}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          stroke={c.stroke ? (c.stroke === 'currentColor' ? color : c.stroke) : color}
          strokeWidth={strokeWidth}
          fill={c.fill ? (c.fill === 'currentColor' ? color : c.fill) : 'none'}
        />
      ))}

      {/* Lines */}
      {iconData.lines?.map((l, i) => (
        <line
          key={`l-${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* Polylines */}
      {iconData.polylines?.map((p, i) => (
        <polyline
          key={`poly-${i}`}
          points={p.points}
          stroke={p.stroke ? (p.stroke === 'currentColor' ? color : p.stroke) : color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={p.fill ? (p.fill === 'currentColor' ? color : p.fill) : 'none'}
        />
      ))}

      {/* Paths */}
      {iconData.paths?.map((p, i) => {
        const isFilled = p.fill && p.fill !== 'none';
        return (
          <path
            key={`p-${i}`}
            d={p.d}
            stroke={isFilled ? undefined : color}
            strokeWidth={isFilled ? undefined : strokeWidth}
            strokeLinecap={isFilled ? undefined : 'round'}
            strokeLinejoin={isFilled ? undefined : 'round'}
            fill={isFilled ? (p.fill === 'currentColor' ? color : p.fill) : 'none'}
            fillRule={p.fillRule}
          />
        );
      })}
    </svg>
  );
};
