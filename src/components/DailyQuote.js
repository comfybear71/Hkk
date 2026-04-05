import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../theme/colors';
import { getDailyQuote, getDailyTip } from '../data/quotes';

const DailyQuote = ({ showTip = false }) => {
  const quote = getDailyQuote();
  const tip = getDailyTip();

  return (
    <View style={styles.container}>
      <View style={styles.quoteCard}>
        <Text style={styles.quoteIcon}>💝</Text>
        <Text style={styles.quoteText}>{quote.text}</Text>
        <Text style={styles.quoteAuthor}>— {quote.author}</Text>
      </View>
      {showTip && (
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  quoteCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  quoteIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.textDark,
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 10,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});

export default DailyQuote;
