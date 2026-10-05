// ─────────────────────────────────────────────
// PAWWS — Payment History Screen
// Transaction history, GST invoices and refunds
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AppBar, Card, EmptyState, Icon, Badge } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';

interface PaymentItem {
  id: string;
  orderId: string;
  serviceTitle: string;
  partnerName: string;
  amount: number;
  date: string;
  status: 'paid' | 'refunded';
}

const SAMPLE_PAYMENTS: PaymentItem[] = [
  {
    id: 'pay_1',
    orderId: 'ORD-98214',
    serviceTitle: 'Full Body Spa & Grooming',
    partnerName: 'Pawsome Pet Spa',
    amount: 1499,
    date: '18 Sep 2026',
    status: 'paid',
  },
  {
    id: 'pay_2',
    orderId: 'ORD-87123',
    serviceTitle: 'Puppy Socialization Class',
    partnerName: 'Bark & Train Academy',
    amount: 799,
    date: '02 Sep 2026',
    status: 'paid',
  },
];

export const PaymentHistoryScreen: React.FC = () => {
  return (
    <View style={styles.screen}>
      <AppBar title="Payment History" />

      {SAMPLE_PAYMENTS.length > 0 ? (
        <FlatList
          data={SAMPLE_PAYMENTS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          renderItem={({ item }) => (
            <Card shadow="sm" padding={16} style={styles.card}>
              <View style={styles.topRow}>
                <View>
                  <Text style={styles.orderId}>{item.orderId}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
                <Badge
                  label={item.status === 'paid' ? 'Paid' : 'Refunded'}
                  variant={item.status === 'paid' ? 'success' : 'neutral'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.bottomRow}>
                <View>
                  <Text style={styles.serviceTitle}>{item.serviceTitle}</Text>
                  <Text style={styles.partnerName}>{item.partnerName}</Text>
                </View>
                <Text style={styles.amountText}>₹{item.amount.toLocaleString('en-IN')}</Text>
              </View>
            </Card>
          )}
        />
      ) : (
        <EmptyState
          icon="creditCard"
          title="No Invoices Yet"
          description="Your completed service receipts and payment invoices will appear here."
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
  content: {
    padding: 16,
  },
  card: {
    borderRadius: RADIUS.lg,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.black,
  },
  date: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 2,
  },
  partnerName: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  amountText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.black,
  },
});
