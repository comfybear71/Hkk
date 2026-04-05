import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import KJProgressRing from '../components/KJProgressRing';
import MealCard from '../components/MealCard';
import DailyQuote from '../components/DailyQuote';
import useStore from '../store/useStore';
import { getGreeting, getTimeEmoji, getStreakMessage, formatDate } from '../utils/helpers';
import { getGlowLevel, getGlowPoints } from '../data/badges';

const HomeScreen = ({ navigation }) => {
  const { userName, dailyKjGoal, mealPlan, getTodayKj, currentStreak, getEarnedBadges, getGlowPoints: getPoints } = useStore();
  const todayKj = getTodayKj();
  const todayPlan = mealPlan[0]; // First day is today
  const glowPoints = getPoints();
  const glowLevel = getGlowLevel(glowPoints);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {userName}! {getTimeEmoji()}
            </Text>
            <Text style={styles.date}>{formatDate(new Date())}</Text>
          </View>
          <View style={styles.glowBadge}>
            <Text style={styles.glowPoints}>✨ {glowPoints}</Text>
            <Text style={styles.glowLabel}>{glowLevel.level}</Text>
          </View>
        </View>

        {/* Streak */}
        <View style={styles.streakCard}>
          <Text style={styles.streakText}>{getStreakMessage(currentStreak)}</Text>
        </View>

        {/* KJ Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <KJProgressRing current={todayKj} goal={dailyKjGoal} size={180} />
        </View>

        {/* Today's Meals */}
        <Text style={styles.sectionTitle}>Today's Meal Plan 🍽️</Text>
        {todayPlan && (
          <View style={styles.todayMeals}>
            <MealCard meal={todayPlan.breakfast} mealType="breakfast" compact />
            <MealCard meal={todayPlan.lunch} mealType="lunch" compact />
            <MealCard meal={todayPlan.dinner} mealType="dinner" compact />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Planned Total:</Text>
              <Text style={[
                styles.totalKj,
                { color: todayPlan.totalKj <= dailyKjGoal ? COLORS.primary : COLORS.danger }
              ]}>
                {todayPlan.totalKj.toLocaleString()} kJ
              </Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#E8F5E9' }]}
            onPress={() => navigation.navigate('Log')}
          >
            <Text style={styles.actionEmoji}>📸</Text>
            <Text style={styles.actionLabel}>Log Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FFF3E0' }]}
            onPress={() => navigation.navigate('Plan')}
          >
            <Text style={styles.actionEmoji}>📋</Text>
            <Text style={styles.actionLabel}>Meal Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#F3E5F5' }]}
            onPress={() => navigation.navigate('Track')}
          >
            <Text style={styles.actionEmoji}>⚖️</Text>
            <Text style={styles.actionLabel}>Weigh In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#E1F5FE' }]}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.actionEmoji}>💬</Text>
            <Text style={styles.actionLabel}>Ask Coach</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Quote */}
        <DailyQuote showTip />

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    ...FONTS.h2,
    color: COLORS.textDark,
  },
  date: {
    ...FONTS.caption,
    marginTop: 4,
  },
  glowBadge: {
    backgroundColor: '#FFF9E6',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  glowPoints: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  glowLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  streakCard: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accentLight,
  },
  streakText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.accentDark,
  },
  progressCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  sectionTitle: {
    ...FONTS.h3,
    marginBottom: 12,
    marginTop: 8,
    color: COLORS.textDark,
  },
  todayMeals: {
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  totalLabel: {
    ...FONTS.body,
    fontWeight: '600',
  },
  totalKj: {
    fontSize: 20,
    fontWeight: '800',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  bottomPad: {
    height: 30,
  },
});

export default HomeScreen;
