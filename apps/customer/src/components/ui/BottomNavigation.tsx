// ─────────────────────────────────────────────
// PAWWS — 3-Button Bottom Navigation
// Home | Pets | Profile
// Clean touch area >= 48px, Vector icons, Poppins typography
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { IconName } from '@pawws/shared';

interface TabItemConfig {
  name: string;
  label: string;
  iconName: IconName;
}

const TAB_CONFIGS: Record<string, TabItemConfig> = {
  Home: {
    name: 'Home',
    label: 'Home',
    iconName: 'home',
  },
  Pets: {
    name: 'Pets',
    label: 'Pets',
    iconName: 'pets',
  },
  Profile: {
    name: 'Profile',
    label: 'Profile',
    iconName: 'profile',
  },
};

export const BottomNavigation: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = TAB_CONFIGS[route.name] || {
            name: route.name,
            label: route.name,
            iconName: 'home',
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const activeColor = COLORS.black;
          const inactiveColor = COLORS.textMuted;
          const currentColor = isFocused ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || config.label}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.75}
            >
              {/* Icon Container with Subtle Active Highlight */}
              <View
                style={[
                  styles.iconWrap,
                  isFocused && styles.iconWrapActive,
                ]}
              >
                <Icon
                  name={config.iconName}
                  size={22}
                  color={currentColor}
                  strokeWidth={isFocused ? 2.2 : 1.8}
                />
              </View>

              {/* Label in Poppins */}
              <Text
                style={[
                  styles.tabLabel,
                  { color: currentColor, fontFamily: isFocused ? FONTS.semiBold : FONTS.regular },
                ]}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 52,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // Accessibility touch target
    paddingVertical: 2,
  },
  iconWrap: {
    width: 44,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
    marginBottom: 2,
  },
  iconWrapActive: {
    backgroundColor: COLORS.primaryLight,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
    marginTop: 1,
  },
});
