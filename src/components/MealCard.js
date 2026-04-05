import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { getMealTimeEmoji } from '../utils/helpers';

const MealCard = ({ meal, mealType, onSwap, compact = false }) => {
  const [showRecipe, setShowRecipe] = useState(false);

  if (!meal) return null;

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactCard}
        onPress={() => setShowRecipe(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.compactEmoji}>{meal.emoji || '🍽️'}</Text>
        <View style={styles.compactInfo}>
          <Text style={styles.compactType}>{getMealTimeEmoji(mealType)} {mealType}</Text>
          <Text style={styles.compactName} numberOfLines={1}>{meal.name}</Text>
        </View>
        <View style={styles.compactKj}>
          <Text style={styles.kjBadge}>{meal.kj} kJ</Text>
        </View>

        <RecipeModal meal={meal} mealType={mealType} visible={showRecipe} onClose={() => setShowRecipe(false)} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.mealTypeLabel}>
            {getMealTimeEmoji(mealType)} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </Text>
          <Text style={styles.mealName}>{meal.name}</Text>
        </View>
        <View style={styles.kjContainer}>
          <Text style={styles.kjText}>{meal.kj}</Text>
          <Text style={styles.kjUnit}>kJ</Text>
        </View>
      </View>

      {meal.prepTime && (
        <Text style={styles.prepTime}>⏱️ {meal.prepTime}</Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.recipeButton}
          onPress={() => setShowRecipe(true)}
        >
          <Text style={styles.recipeButtonText}>📖 View Recipe</Text>
        </TouchableOpacity>
        {onSwap && (
          <TouchableOpacity style={styles.swapButton} onPress={onSwap}>
            <Text style={styles.swapButtonText}>🔄 Swap</Text>
          </TouchableOpacity>
        )}
      </View>

      <RecipeModal meal={meal} mealType={mealType} visible={showRecipe} onClose={() => setShowRecipe(false)} />
    </View>
  );
};

const RecipeModal = ({ meal, mealType, visible, onClose }) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.modalEmoji}>{meal.emoji || '🍽️'}</Text>
          <Text style={styles.modalTitle}>{meal.name}</Text>
          <Text style={styles.modalMealType}>
            {getMealTimeEmoji(mealType)} {mealType} • {meal.kj} kJ • {meal.prepTime || '~10 min'}
          </Text>

          {meal.tags && (
            <View style={styles.tagsRow}>
              {meal.tags.map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.sectionTitle}>🛒 Ingredients</Text>
          {meal.ingredients && meal.ingredients.map((ing, i) => (
            <View key={i} style={styles.ingredientRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.ingredientText}>{ing}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>👩‍🍳 Steps</Text>
          {meal.steps && meal.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Got it! ✨</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 18,
    marginVertical: 8,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  mealTypeLabel: {
    ...FONTS.label,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  mealName: {
    ...FONTS.h3,
    color: COLORS.textDark,
  },
  kjContainer: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  kjText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  kjUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  prepTime: {
    ...FONTS.caption,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },
  recipeButton: {
    flex: 1,
    backgroundColor: COLORS.primarySoft,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  recipeButtonText: {
    ...FONTS.button,
    color: COLORS.primaryDark,
    fontSize: 15,
  },
  swapButton: {
    backgroundColor: COLORS.sunflower,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  swapButtonText: {
    ...FONTS.button,
    color: COLORS.textDark,
    fontSize: 15,
  },
  // Compact styles
  compactCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  compactEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  compactInfo: {
    flex: 1,
  },
  compactType: {
    ...FONTS.label,
    textTransform: 'capitalize',
    fontSize: 12,
  },
  compactName: {
    ...FONTS.body,
    fontWeight: '600',
    fontSize: 15,
  },
  compactKj: {
    marginLeft: 8,
  },
  kjBadge: {
    backgroundColor: COLORS.primarySoft,
    color: COLORS.primaryDark,
    fontWeight: '700',
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  // Modal styles
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
    maxHeight: '85%',
  },
  modalEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    ...FONTS.h2,
    textAlign: 'center',
    color: COLORS.textDark,
  },
  modalMealType: {
    ...FONTS.caption,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    ...FONTS.label,
    color: COLORS.primaryDark,
  },
  sectionTitle: {
    ...FONTS.h3,
    marginTop: 16,
    marginBottom: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 8,
  },
  bullet: {
    ...FONTS.body,
    marginRight: 8,
    color: COLORS.primary,
    fontWeight: '700',
  },
  ingredientText: {
    ...FONTS.body,
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingLeft: 4,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  stepText: {
    ...FONTS.body,
    flex: 1,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    ...FONTS.button,
    fontSize: 18,
  },
});

export default MealCard;
