import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import WeightChart from '../components/WeightChart';
import BadgeGrid from '../components/Badge';
import useStore from '../store/useStore';
import { BADGES } from '../data/badges';
import { getStreakMessage } from '../utils/helpers';

const TrackScreen = () => {
  const {
    weightLog,
    addWeightEntry,
    biometrics,
    addBiometric,
    getEarnedBadges,
    getGlowPoints: getPoints,
    getGlowLevel: getLevel,
    currentStreak,
    stats,
    triggerConfetti,
  } = useStore();

  const [showWeightInput, setShowWeightInput] = useState(false);
  const [weightValue, setWeightValue] = useState('');
  const [showBiometrics, setShowBiometrics] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [mood, setMood] = useState('😊');
  const [waist, setWaist] = useState('');

  const earnedBadges = getEarnedBadges();
  const glowPoints = getPoints();
  const glowLevel = getLevel();

  const handleAddWeight = () => {
    const weight = parseFloat(weightValue);
    if (isNaN(weight) || weight < 20 || weight > 300) {
      Alert.alert('Oops! 😊', 'Please enter a valid weight in kg (20-300)');
      return;
    }
    addWeightEntry(weight);
    setWeightValue('');
    setShowWeightInput(false);
    triggerConfetti();
    Alert.alert('Logged! ⚖️', `${weight} kg recorded — you're doing amazing tracking! 💖`);
  };

  const handleAddBiometrics = () => {
    addBiometric({
      energyLevel,
      mood,
      waist: waist ? parseFloat(waist) : null,
    });
    setShowBiometrics(false);
    setWaist('');
    Alert.alert('Saved! 💜', 'Your wellbeing check-in has been recorded');
  };

  const moods = ['😊', '😃', '😐', '😔', '😤', '🥱', '💪', '🌟'];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Track Progress 📈</Text>
        <Text style={styles.subtitle}>Your beautiful journey</Text>

        {/* Glow Level Card */}
        <View style={[styles.glowCard, { borderColor: glowLevel.color }]}>
          <Text style={styles.glowEmoji}>✨</Text>
          <Text style={styles.glowLevelText}>{glowLevel.level}</Text>
          <Text style={styles.glowPointsText}>{glowPoints} Glow Points</Text>
          <View style={styles.glowStatsRow}>
            <View style={styles.glowStat}>
              <Text style={styles.glowStatValue}>{stats.meals_logged || 0}</Text>
              <Text style={styles.glowStatLabel}>Meals</Text>
            </View>
            <View style={styles.glowStatDivider} />
            <View style={styles.glowStat}>
              <Text style={styles.glowStatValue}>{currentStreak}</Text>
              <Text style={styles.glowStatLabel}>Streak</Text>
            </View>
            <View style={styles.glowStatDivider} />
            <View style={styles.glowStat}>
              <Text style={styles.glowStatValue}>{earnedBadges.length}</Text>
              <Text style={styles.glowStatLabel}>Badges</Text>
            </View>
          </View>
        </View>

        {/* Streak */}
        <View style={styles.streakCard}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakText}>{getStreakMessage(currentStreak)}</Text>
        </View>

        {/* Weight Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚖️ Weight Progress</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowWeightInput(!showWeightInput)}
            >
              <Text style={styles.addButtonText}>
                {showWeightInput ? '✕ Close' : '+ Log Weight'}
              </Text>
            </TouchableOpacity>
          </View>

          {showWeightInput && (
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Your weight today (kg)</Text>
              <TextInput
                style={styles.weightInput}
                placeholder="e.g. 72.5"
                placeholderTextColor={COLORS.textMuted}
                value={weightValue}
                onChangeText={setWeightValue}
                keyboardType="decimal-pad"
                autoFocus
              />
              <TouchableOpacity
                style={[styles.saveButton, !weightValue && styles.saveButtonDisabled]}
                onPress={handleAddWeight}
                disabled={!weightValue}
              >
                <Text style={styles.saveButtonText}>Save Weight ⚖️</Text>
              </TouchableOpacity>
            </View>
          )}

          <WeightChart data={weightLog} />

          {weightLog.length > 0 && (
            <View style={styles.weightHistory}>
              <Text style={styles.historyTitle}>Recent Entries</Text>
              {weightLog.slice(-5).reverse().map(entry => (
                <View key={entry.id} style={styles.historyItem}>
                  <Text style={styles.historyDate}>
                    {new Date(entry.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </Text>
                  <Text style={styles.historyWeight}>{entry.weight.toFixed(1)} kg</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Biometrics Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💜 Wellbeing Check-in</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowBiometrics(!showBiometrics)}
            >
              <Text style={styles.addButtonText}>
                {showBiometrics ? '✕ Close' : '+ Check In'}
              </Text>
            </TouchableOpacity>
          </View>

          {showBiometrics && (
            <View style={styles.inputCard}>
              {/* Energy Level */}
              <Text style={styles.inputLabel}>Energy Level</Text>
              <View style={styles.energyRow}>
                {[1, 2, 3, 4, 5].map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.energyButton,
                      energyLevel === level && styles.energyButtonActive,
                    ]}
                    onPress={() => setEnergyLevel(level)}
                  >
                    <Text style={styles.energyText}>
                      {level === 1 ? '😴' : level === 2 ? '🥱' : level === 3 ? '😊' : level === 4 ? '💪' : '⚡'}
                    </Text>
                    <Text style={[
                      styles.energyLabel,
                      energyLevel === level && { color: COLORS.primary },
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Mood */}
              <Text style={styles.inputLabel}>Mood</Text>
              <View style={styles.moodRow}>
                {moods.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.moodButton, mood === m && styles.moodButtonActive]}
                    onPress={() => setMood(m)}
                  >
                    <Text style={styles.moodEmoji}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Waist */}
              <Text style={styles.inputLabel}>Waist Measurement (cm) — optional</Text>
              <TextInput
                style={styles.weightInput}
                placeholder="e.g. 85"
                placeholderTextColor={COLORS.textMuted}
                value={waist}
                onChangeText={setWaist}
                keyboardType="decimal-pad"
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleAddBiometrics}>
                <Text style={styles.saveButtonText}>Save Check-in 💜</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Badges & Achievements</Text>
          <BadgeGrid
            allBadges={BADGES}
            earnedBadgeIds={earnedBadges.map(b => b.id)}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: 20 },
  title: { ...FONTS.h2, color: COLORS.textDark },
  subtitle: { ...FONTS.caption, marginTop: 4, marginBottom: 16 },
  // Glow card
  glowCard: {
    backgroundColor: '#FFFBF0',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    ...SHADOWS.medium,
  },
  glowEmoji: { fontSize: 36, marginBottom: 8 },
  glowLevelText: { fontSize: 22, fontWeight: '800', color: COLORS.textDark },
  glowPointsText: { fontSize: 15, color: COLORS.textMuted, marginTop: 4 },
  glowStatsRow: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-around',
  },
  glowStat: { alignItems: 'center' },
  glowStatValue: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  glowStatLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },
  glowStatDivider: { width: 1, height: 40, backgroundColor: COLORS.grey },
  // Streak
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentSoft,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
  },
  streakIcon: { fontSize: 24, marginRight: 12 },
  streakText: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.accentDark },
  // Section
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { ...FONTS.h3, color: COLORS.textDark },
  addButton: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addButtonText: { fontWeight: '700', fontSize: 14, color: COLORS.primaryDark },
  // Input
  inputCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 8,
  },
  weightInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    ...SHADOWS.glow,
  },
  saveButtonDisabled: { backgroundColor: COLORS.grey, shadowColor: 'transparent' },
  saveButtonText: { ...FONTS.button, fontSize: 17 },
  // Energy
  energyRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  energyButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    minWidth: 56,
  },
  energyButtonActive: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  energyText: { fontSize: 24 },
  energyLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginTop: 4 },
  // Mood
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  moodButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  moodButtonActive: {
    backgroundColor: COLORS.sunflower,
    borderWidth: 2,
    borderColor: '#FFD54F',
  },
  moodEmoji: { fontSize: 28 },
  // History
  weightHistory: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    ...SHADOWS.small,
  },
  historyTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 10 },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  historyDate: { fontSize: 15, color: COLORS.textSecondary },
  historyWeight: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
});

export default TrackScreen;
