// ─────────────────────────────────────────────
// PAWWS — Notifications Screen
// Notification center for booking alerts and reminders
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AppBar, Card, EmptyState, Icon } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { IconName } from '@pawws/shared';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: IconName;
  read: boolean;
}


export const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <View style={styles.screen}>
      <AppBar
        title="Notifications"
        rightComponent={
          notifications.some((n) => !n.read) ? (
            <TouchableOpacity onPress={markAllRead} style={styles.markReadBtn}>
              <Text style={styles.markReadText}>Mark all</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card
              shadow="sm"
              padding={16}
              style={[styles.notifCard, !item.read && styles.unreadCard]}
            >
              <View style={styles.cardRow}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: item.read ? COLORS.border : COLORS.primaryLight },
                  ]}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    color={item.read ? COLORS.textMuted : COLORS.black}
                  />
                </View>

                <View style={styles.textWrap}>
                  <View style={styles.headerRow}>
                    <Text style={styles.titleText}>{item.title}</Text>
                    {!item.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.messageText}>{item.message}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </View>
            </Card>
          )}
        />
      ) : (
        <EmptyState
          icon="bell"
          title="No Notifications Yet"
          description="You're all caught up! Booking updates and reminders will appear here."
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  markReadBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  markReadText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.black,
  },
  notifCard: {
    marginBottom: 12,
    borderRadius: RADIUS.lg,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryDark,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  titleText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.black,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryDark,
  },
  messageText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  timeText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
