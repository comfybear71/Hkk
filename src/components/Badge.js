import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SHADOWS } from '../theme/colors';

const BadgeItem = ({ badge, earned = false }) => (
  <View style={[styles.badge, earned ? styles.badgeEarned : styles.badgeLocked]}>
    <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
    <Text style={[styles.badgeName, !earned && styles.lockedText]} numberOfLines={1}>
      {badge.name}
    </Text>
    <Text style={[styles.badgeDesc, !earned && styles.lockedText]} numberOfLines={2}>
      {badge.description}
    </Text>
    {earned && (
      <View style={styles.pointsBadge}>
        <Text style={styles.pointsText}>+{badge.glowPoints} ✨</Text>
      </View>
    )}
    {!earned && (
      <Text style={styles.lockIcon}>🔒</Text>
    )}
  </View>
);

const BadgeGrid = ({ allBadges, earnedBadgeIds }) => {
  const earned = allBadges.filter(b => earnedBadgeIds.includes(b.id));
  const locked = allBadges.filter(b => !earnedBadgeIds.includes(b.id));

  return (
    <View style={styles.container}>
      {earned.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>🏆 Earned Badges ({earned.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
            {earned.map(badge => (
              <BadgeItem key={badge.id} badge={badge} earned />
            ))}
          </ScrollView>
        </>
      )}

      <Text style={styles.sectionTitle}>🔒 Keep Going! ({locked.length} to unlock)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {locked.map(badge => (
          <BadgeItem key={badge.id} badge={badge} earned={false} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 10,
    marginTop: 8,
  },
  row: {
    marginBottom: 16,
  },
  badge: {
    width: 130,
    borderRadius: 18,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  badgeEarned: {
    backgroundColor: '#FFF9E6',
    borderWidth: 2,
    borderColor: '#FFD54F',
  },
  badgeLocked: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.grey,
    opacity: 0.7,
  },
  badgeEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  lockedText: {
    color: COLORS.greyDark,
  },
  pointsBadge: {
    backgroundColor: '#FFD54F',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 8,
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  lockIcon: {
    fontSize: 16,
    marginTop: 8,
  },
});

export { BadgeItem };
export default BadgeGrid;
