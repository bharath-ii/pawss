// ─────────────────────────────────────────────
// PAWWS — Unified Vector Icon Component (Mobile)
// Powered by react-native-svg
// Scalable, consistent 24x24 stroke/fill vector icons
// ─────────────────────────────────────────────

import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg';
import { ICON_PATHS, IconName } from '@pawws/shared';
import { COLORS } from '../../theme';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = COLORS.textPrimary,
  strokeWidth = 2,
  style,
  accessibilityLabel,
}) => {
  const iconData = ICON_PATHS[name] || ICON_PATHS.help;
  const viewBox = iconData.viewBox || '0 0 24 24';

  return (
    <View
      style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel || name}
      accessibilityRole="image"
    >
      <Svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
      >
        {/* Render Circles */}
        {iconData.circles?.map((c, i) => (
          <Circle
            key={`c-${i}`}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            stroke={c.stroke ? (c.stroke === 'currentColor' ? color : c.stroke) : color}
            strokeWidth={strokeWidth}
            fill={c.fill ? (c.fill === 'currentColor' ? color : c.fill) : 'none'}
          />
        ))}

        {/* Render Lines */}
        {iconData.lines?.map((l, i) => (
          <Line
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

        {/* Render Polylines */}
        {iconData.polylines?.map((p, i) => (
          <Polyline
            key={`poly-${i}`}
            points={p.points}
            stroke={p.stroke ? (p.stroke === 'currentColor' ? color : p.stroke) : color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={p.fill ? (p.fill === 'currentColor' ? color : p.fill) : 'none'}
          />
        ))}

        {/* Render Paths */}
        {iconData.paths?.map((p, i) => {
          const isFilled = p.fill && p.fill !== 'none';
          return (
            <Path
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
      </Svg>
    </View>
  );
};
