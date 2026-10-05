// ─────────────────────────────────────────────
// PAWWS — Help & FAQ Screen
// Searchable Frequently Asked Questions with accordion UI
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AppBar, Card, Icon } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: '1',
    category: 'Bookings',
    question: 'How do I book a pet service on PAWWS?',
    answer: 'Browse verified service categories on Home, pick your preferred service provider, choose between Home Service or Provider Location, pick a convenient date & time slot, select your pet, and proceed to checkout.',
  },
  {
    id: '2',
    category: 'Bookings',
    question: 'What is the cancellation policy?',
    answer: 'You can cancel free of charge up to 4 hours prior to the scheduled booking start time. Cancellations within 4 hours may be subject to a 30% partner compensation fee.',
  },
  {
    id: '3',
    category: 'Safety',
    question: 'How does PAWWS verify service partners?',
    answer: 'All service providers undergo Government ID verification (Aadhaar / PAN), business license checks, pet handling experience reviews, and facility safety evaluations before being approved.',
  },
  {
    id: '4',
    category: 'Safety',
    question: 'What if my pet needs medical attention during a service?',
    answer: 'All active bookings include access to PAWWS 24/7 emergency veterinary tele-triage. In case of an emergency, the partner will notify you immediately and escort your pet to the nearest partner veterinary hospital.',
  },
  {
    id: '5',
    category: 'Payments',
    question: 'What payment methods are supported?',
    answer: 'We support all major Indian payment methods via our PCI-DSS compliant Razorpay gateway: UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards, and NetBanking.',
  },
  {
    id: '6',
    category: 'Payments',
    question: 'When will I receive my refund for a cancelled booking?',
    answer: 'Refunds for eligible cancellations are initiated immediately and credited to your original payment source within 3–5 business days.',
  },
  {
    id: '7',
    category: 'Pets',
    question: 'Are vaccinations mandatory to book services?',
    answer: 'Yes, for the health and safety of all animals, dogs and cats must be up to date on their Rabies and core annual vaccination boosters.',
  },
];

export const HelpFaqScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.screen}>
      <AppBar title="Help & FAQ" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Input */}
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search questions or topics..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* FAQs List */}
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;

            return (
              <Card key={faq.id} shadow="sm" padding={0} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.questionRow}
                  onPress={() => toggleAccordion(faq.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.qTextWrap}>
                    <Text style={styles.categoryBadge}>{faq.category}</Text>
                    <Text style={styles.questionText}>{faq.question}</Text>
                  </View>
                  <Icon
                    name={isExpanded ? 'chevronUp' : 'chevronDown'}
                    size={20}
                    color={COLORS.black}
                  />
                </TouchableOpacity>

                {isExpanded ? (
                  <View style={styles.answerWrap}>
                    <Text style={styles.answerText}>{faq.answer}</Text>
                  </View>
                ) : null}
              </Card>
            );
          })
        ) : (
          <View style={styles.emptyWrap}>
            <Icon name="help" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No answers found</Text>
            <Text style={styles.emptyDesc}>Try searching with different keywords</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.black,
  },
  faqCard: {
    borderRadius: RADIUS.lg,
    marginBottom: 12,
    overflow: 'hidden',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  qTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  questionText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
  },
  answerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  answerText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: 12,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.black,
    marginTop: 12,
  },
  emptyDesc: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
