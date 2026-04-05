import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import MealCard from '../components/MealCard';
import useStore from '../store/useStore';
import { formatDateShort } from '../utils/helpers';
import { BREAKFAST_MEALS, LUNCH_MEALS, DINNER_MEALS } from '../data/mealPlans';

const MealPlanScreen = () => {
  const { mealPlan, regeneratePlan, swapMeal, dailyKjGoal } = useStore();
  const [selectedDay, setSelectedDay] = useState(0);
  const [swapModal, setSwapModal] = useState(null);

  const handleRegenerate = () => {
    Alert.alert(
      '🔄 New Meal Plan?',
      'Generate a fresh week of delicious meals?',
      [
        { text: 'Keep Current', style: 'cancel' },
        {
          text: 'Yes, Refresh! ✨',
          onPress: () => regeneratePlan(),
        },
      ]
    );
  };

  const getMealOptions = (mealType) => {
    switch (mealType) {
      case 'breakfast': return BREAKFAST_MEALS;
      case 'lunch': return LUNCH_MEALS;
      case 'dinner': return DINNER_MEALS;
      default: return [];
    }
  };

  const handleSwap = (mealType) => {
    setSwapModal(mealType);
  };

  const confirmSwap = (mealType, newMeal) => {
    swapMeal(selectedDay, mealType, newMeal);
    setSwapModal(null);
  };

  const currentDay = mealPlan[selectedDay];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Meal Plan 📋</Text>
            <Text style={styles.subtitle}>Your week of delicious meals</Text>
          </View>
          <TouchableOpacity style={styles.regenButton} onPress={handleRegenerate}>
            <Text style={styles.regenText}>🔄 New Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Day Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daySelector}
          contentContainerStyle={styles.daySelectorContent}
        >
          {mealPlan.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayTab,
                selectedDay === index && styles.dayTabActive,
                day.isToday && selectedDay !== index && styles.dayTabToday,
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={[
                styles.dayTabDay,
                selectedDay === index && styles.dayTabTextActive,
              ]}>
                {day.isToday ? 'Today' : day.day.slice(0, 3)}
              </Text>
              <Text style={[
                styles.dayTabDate,
                selectedDay === index && styles.dayTabTextActive,
              ]}>
                {formatDateShort(day.date).split(',')[0]}
              </Text>
              <View style={[
                styles.dayKjBadge,
                {
                  backgroundColor: day.totalKj <= dailyKjGoal
                    ? (selectedDay === index ? '#FFFFFF40' : COLORS.primarySoft)
                    : (selectedDay === index ? '#FFFFFF40' : COLORS.accentSoft),
                },
              ]}>
                <Text style={[
                  styles.dayKjText,
                  selectedDay === index && { color: COLORS.white },
                  day.totalKj > dailyKjGoal && selectedDay !== index && { color: COLORS.danger },
                ]}>
                  {day.totalKj} kJ
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected Day Meals */}
        {currentDay && (
          <View style={styles.dayMeals}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>
                {currentDay.isToday ? "Today's Meals" : currentDay.day}
              </Text>
              <View style={[
                styles.totalBadge,
                {
                  backgroundColor: currentDay.totalKj <= dailyKjGoal
                    ? COLORS.primarySoft
                    : COLORS.accentSoft,
                },
              ]}>
                <Text style={[
                  styles.totalBadgeText,
                  {
                    color: currentDay.totalKj <= dailyKjGoal
                      ? COLORS.primaryDark
                      : COLORS.danger,
                  },
                ]}>
                  Total: {currentDay.totalKj.toLocaleString()} kJ
                </Text>
              </View>
            </View>

            <MealCard
              meal={currentDay.breakfast}
              mealType="breakfast"
              onSwap={() => handleSwap('breakfast')}
            />
            <MealCard
              meal={currentDay.lunch}
              mealType="lunch"
              onSwap={() => handleSwap('lunch')}
            />
            <MealCard
              meal={currentDay.dinner}
              mealType="dinner"
              onSwap={() => handleSwap('dinner')}
            />

            {/* Goal Status */}
            <View style={[
              styles.goalStatus,
              {
                backgroundColor: currentDay.totalKj <= dailyKjGoal
                  ? '#E8F5E9'
                  : '#FBE9E7',
              },
            ]}>
              <Text style={styles.goalStatusText}>
                {currentDay.totalKj <= dailyKjGoal
                  ? `✅ Under your ${dailyKjGoal.toLocaleString()} kJ goal! You have ${(dailyKjGoal - currentDay.totalKj).toLocaleString()} kJ left for snacks 🎉`
                  : `⚠️ ${(currentDay.totalKj - dailyKjGoal).toLocaleString()} kJ over goal — try swapping a meal for something lighter 💚`
                }
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Swap Modal */}
      <Modal visible={swapModal !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              🔄 Choose a new {swapModal}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {swapModal && getMealOptions(swapModal).map(meal => (
                <TouchableOpacity
                  key={meal.id}
                  style={styles.swapOption}
                  onPress={() => confirmSwap(swapModal, meal)}
                >
                  <Text style={styles.swapEmoji}>{meal.emoji}</Text>
                  <View style={styles.swapInfo}>
                    <Text style={styles.swapName}>{meal.name}</Text>
                    <Text style={styles.swapKj}>{meal.kj} kJ • {meal.prepTime}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSwapModal(null)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  title: {
    ...FONTS.h2,
    color: COLORS.textDark,
  },
  subtitle: {
    ...FONTS.caption,
    marginTop: 4,
  },
  regenButton: {
    backgroundColor: COLORS.sunflower,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...SHADOWS.small,
  },
  regenText: {
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.textDark,
  },
  daySelector: {
    marginBottom: 20,
    marginHorizontal: -20,
  },
  daySelectorContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  dayTab: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  dayTabToday: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  dayTabDay: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  dayTabDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  dayTabTextActive: {
    color: COLORS.white,
  },
  dayKjBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  dayKjText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  dayMeals: {},
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayTitle: {
    ...FONTS.h3,
    color: COLORS.textDark,
  },
  totalBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  totalBadgeText: {
    fontWeight: '700',
    fontSize: 14,
  },
  goalStatus: {
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  goalStatusText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textDark,
  },
  // Swap modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '75%',
  },
  modalTitle: {
    ...FONTS.h3,
    textAlign: 'center',
    marginBottom: 16,
  },
  swapOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    marginBottom: 8,
  },
  swapEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  swapInfo: {
    flex: 1,
  },
  swapName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  swapKj: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  cancelButton: {
    backgroundColor: COLORS.grey,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelText: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.textDark,
  },
});

export default MealPlanScreen;
