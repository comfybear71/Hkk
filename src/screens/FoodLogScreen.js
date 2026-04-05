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
  Image,
  Modal,
  Platform,
} from 'react-native';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import KJProgressRing from '../components/KJProgressRing';
import useStore from '../store/useStore';
import { searchFood, estimateKjFromDescription, analyzePhotoForFood } from '../services/foodAnalysis';
import { getMealTimeEmoji, generateId } from '../utils/helpers';

const FoodLogScreen = () => {
  const { dailyKjGoal, addFoodLogEntry, getTodayLog, getTodayKj, triggerConfetti, mealPlan } = useStore();
  const [mode, setMode] = useState(null); // 'photo', 'search', 'describe', 'planned'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);

  const todayLog = getTodayLog();
  const todayKj = getTodayKj();
  const todayPlan = mealPlan[0];

  const handlePhotoCapture = async () => {
    try {
      // For web/demo: simulate photo analysis
      if (Platform.OS === 'web') {
        setAnalyzing(true);
        const result = await analyzePhotoForFood(null);
        setAnalysisResult(result);
        setAnalyzing(false);
        setMode('photo_result');
        return;
      }

      // For native: use ImagePicker
      let ImagePicker;
      try {
        ImagePicker = require('expo-image-picker');
      } catch {
        // Fallback for web
        setAnalyzing(true);
        const result = await analyzePhotoForFood(null);
        setAnalysisResult(result);
        setAnalyzing(false);
        setMode('photo_result');
        return;
      }

      const permResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permResult.granted) {
        Alert.alert('Camera Permission', 'We need camera access to photograph your meals! 📸');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
        setAnalyzing(true);
        const analysis = await analyzePhotoForFood(result.assets[0].uri);
        setAnalysisResult(analysis);
        setAnalyzing(false);
        setMode('photo_result');
      }
    } catch (error) {
      // Fallback: simulate
      setAnalyzing(true);
      const result = await analyzePhotoForFood(null);
      setAnalysisResult(result);
      setAnalyzing(false);
      setMode('photo_result');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = searchFood(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleLogFromSearch = (food) => {
    addFoodLogEntry({
      name: food.name,
      kj: food.kj,
      serve: food.serve,
      type: 'search',
    });
    if (todayKj + food.kj <= dailyKjGoal) {
      triggerConfetti();
    }
    setMode(null);
    setSearchQuery('');
    setSearchResults([]);
    Alert.alert('Logged! 🎉', `${food.name} (${food.kj} kJ) added to today's log`);
  };

  const handleLogFromDescription = () => {
    if (!description.trim()) return;
    const result = estimateKjFromDescription(description);
    addFoodLogEntry({
      name: description,
      kj: result.totalKj,
      items: result.items,
      type: 'description',
      isEstimate: result.isEstimate,
    });
    setDescription('');
    setMode(null);
    Alert.alert('Logged! 🎉', `Estimated at ${result.totalKj} kJ — great tracking! 💚`);
  };

  const handleLogPhotoResult = () => {
    if (!analysisResult) return;
    addFoodLogEntry({
      name: analysisResult.description,
      kj: analysisResult.totalKj,
      items: analysisResult.foods,
      type: 'photo',
      photoUri: photoUri,
    });
    setMode(null);
    setAnalysisResult(null);
    setPhotoUri(null);
    triggerConfetti();
    Alert.alert('Logged! 📸', `${analysisResult.totalKj} kJ added — beautiful meal! ✨`);
  };

  const handleLogPlannedMeal = (meal, mealType) => {
    addFoodLogEntry({
      name: meal.name,
      kj: meal.kj,
      type: 'planned',
      mealType,
    });
    Alert.alert('Logged! ✅', `${meal.name} (${meal.kj} kJ) — sticking to the plan! 🌟`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Food Log 📝</Text>
        <Text style={styles.subtitle}>Track what you eat today</Text>

        {/* Progress Summary */}
        <View style={styles.progressCard}>
          <KJProgressRing current={todayKj} goal={dailyKjGoal} size={140} strokeWidth={12} />
        </View>

        {/* Log Methods */}
        {mode === null && (
          <>
            <Text style={styles.sectionTitle}>How would you like to log? 🍽️</Text>

            <TouchableOpacity
              style={[styles.logMethod, { backgroundColor: '#E8F5E9' }]}
              onPress={handlePhotoCapture}
            >
              <Text style={styles.logMethodEmoji}>📸</Text>
              <View style={styles.logMethodInfo}>
                <Text style={styles.logMethodTitle}>Take a Photo</Text>
                <Text style={styles.logMethodDesc}>Snap your plate & we'll estimate kJ!</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.logMethod, { backgroundColor: '#E3F2FD' }]}
              onPress={() => setMode('search')}
            >
              <Text style={styles.logMethodEmoji}>🔍</Text>
              <View style={styles.logMethodInfo}>
                <Text style={styles.logMethodTitle}>Search Foods</Text>
                <Text style={styles.logMethodDesc}>Find a food and log its kJ</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.logMethod, { backgroundColor: '#FFF3E0' }]}
              onPress={() => setMode('describe')}
            >
              <Text style={styles.logMethodEmoji}>✏️</Text>
              <View style={styles.logMethodInfo}>
                <Text style={styles.logMethodTitle}>Describe Your Meal</Text>
                <Text style={styles.logMethodDesc}>Type what you had & we'll estimate</Text>
              </View>
            </TouchableOpacity>

            {todayPlan && (
              <TouchableOpacity
                style={[styles.logMethod, { backgroundColor: '#F3E5F5' }]}
                onPress={() => setMode('planned')}
              >
                <Text style={styles.logMethodEmoji}>📋</Text>
                <View style={styles.logMethodInfo}>
                  <Text style={styles.logMethodTitle}>Log Planned Meal</Text>
                  <Text style={styles.logMethodDesc}>Ate what was on the plan? Tap here!</Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Search Mode */}
        {mode === 'search' && (
          <View style={styles.modeContainer}>
            <View style={styles.modeHeader}>
              <Text style={styles.modeTitle}>🔍 Search Foods</Text>
              <TouchableOpacity onPress={() => { setMode(null); setSearchQuery(''); setSearchResults([]); }}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search (e.g. 'chicken', 'banana', 'yoghurt')..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            {searchResults.map((food, i) => (
              <TouchableOpacity
                key={i}
                style={styles.searchResult}
                onPress={() => handleLogFromSearch(food)}
              >
                <View style={styles.searchResultInfo}>
                  <Text style={styles.searchResultName}>
                    {food.name.charAt(0).toUpperCase() + food.name.slice(1)}
                  </Text>
                  <Text style={styles.searchResultServe}>{food.serve}</Text>
                </View>
                <View style={styles.searchResultKj}>
                  <Text style={styles.kjBadge}>{food.kj} kJ</Text>
                </View>
              </TouchableOpacity>
            ))}
            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <Text style={styles.noResults}>No exact match — try describing your meal instead ✏️</Text>
            )}
          </View>
        )}

        {/* Describe Mode */}
        {mode === 'describe' && (
          <View style={styles.modeContainer}>
            <View style={styles.modeHeader}>
              <Text style={styles.modeTitle}>✏️ Describe Your Meal</Text>
              <TouchableOpacity onPress={() => { setMode(null); setDescription(''); }}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.searchInput, styles.descriptionInput]}
              placeholder="E.g. 'chicken salad with avocado and brown rice'..."
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              autoFocus
            />
            <TouchableOpacity
              style={[styles.logButton, !description.trim() && styles.logButtonDisabled]}
              onPress={handleLogFromDescription}
              disabled={!description.trim()}
            >
              <Text style={styles.logButtonText}>Log This Meal 🍽️</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Photo Result Mode */}
        {mode === 'photo_result' && analysisResult && (
          <View style={styles.modeContainer}>
            <View style={styles.modeHeader}>
              <Text style={styles.modeTitle}>📸 Photo Analysis</Text>
              <TouchableOpacity onPress={() => { setMode(null); setAnalysisResult(null); }}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            </View>

            {photoUri && (
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            )}

            <View style={styles.analysisCard}>
              <Text style={styles.analysisDesc}>{analysisResult.description}</Text>
              {analysisResult.foods.map((food, i) => (
                <View key={i} style={styles.analysisItem}>
                  <Text style={styles.analysisFood}>{food.name}</Text>
                  <Text style={styles.analysisKj}>{food.kj} kJ</Text>
                </View>
              ))}
              <View style={styles.analysisTotalRow}>
                <Text style={styles.analysisTotalLabel}>Estimated Total</Text>
                <Text style={styles.analysisTotalKj}>{analysisResult.totalKj} kJ</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.logButton} onPress={handleLogPhotoResult}>
              <Text style={styles.logButtonText}>Log This Meal ✅</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Planned Meal Mode */}
        {mode === 'planned' && todayPlan && (
          <View style={styles.modeContainer}>
            <View style={styles.modeHeader}>
              <Text style={styles.modeTitle}>📋 Log Planned Meal</Text>
              <TouchableOpacity onPress={() => setMode(null)}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.plannedSubtitle}>Tap a meal to log it ✅</Text>

            {['breakfast', 'lunch', 'dinner'].map(type => (
              <TouchableOpacity
                key={type}
                style={styles.plannedMeal}
                onPress={() => handleLogPlannedMeal(todayPlan[type], type)}
              >
                <Text style={styles.plannedEmoji}>{todayPlan[type].emoji}</Text>
                <View style={styles.plannedInfo}>
                  <Text style={styles.plannedType}>
                    {getMealTimeEmoji(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  <Text style={styles.plannedName}>{todayPlan[type].name}</Text>
                </View>
                <Text style={styles.plannedKj}>{todayPlan[type].kj} kJ</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Analyzing indicator */}
        {analyzing && (
          <View style={styles.analyzingCard}>
            <Text style={styles.analyzingEmoji}>🔍</Text>
            <Text style={styles.analyzingText}>Analysing your meal...</Text>
            <Text style={styles.analyzingSubtext}>This is exciting! 📸✨</Text>
          </View>
        )}

        {/* Today's Log */}
        <Text style={styles.sectionTitle}>
          Today's Log ({todayLog.length} {todayLog.length === 1 ? 'entry' : 'entries'})
        </Text>
        {todayLog.length === 0 ? (
          <View style={styles.emptyLog}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyText}>Nothing logged yet today!</Text>
            <Text style={styles.emptySubtext}>Use the buttons above to start tracking 💚</Text>
          </View>
        ) : (
          todayLog.map((entry) => (
            <View key={entry.id} style={styles.logEntry}>
              <View style={styles.logEntryLeft}>
                <Text style={styles.logEntryIcon}>
                  {entry.type === 'photo' ? '📸' : entry.type === 'planned' ? '📋' : '✏️'}
                </Text>
                <View>
                  <Text style={styles.logEntryName} numberOfLines={1}>{entry.name}</Text>
                  <Text style={styles.logEntryTime}>
                    {new Date(entry.timestamp).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                    {entry.isEstimate && ' (estimate)'}
                  </Text>
                </View>
              </View>
              <Text style={styles.logEntryKj}>{entry.kj} kJ</Text>
            </View>
          ))
        )}

        {/* Planned vs Actual */}
        {todayLog.length > 0 && (
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonTitle}>📊 Planned vs Actual</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Planned</Text>
                <Text style={styles.comparisonValue}>{todayPlan?.totalKj?.toLocaleString() || '—'} kJ</Text>
              </View>
              <View style={styles.comparisonDivider} />
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Actual</Text>
                <Text style={[styles.comparisonValue, { color: todayKj <= dailyKjGoal ? COLORS.primary : COLORS.danger }]}>
                  {todayKj.toLocaleString()} kJ
                </Text>
              </View>
              <View style={styles.comparisonDivider} />
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Goal</Text>
                <Text style={styles.comparisonValue}>{dailyKjGoal.toLocaleString()} kJ</Text>
              </View>
            </View>
          </View>
        )}

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
  progressCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  sectionTitle: { ...FONTS.h3, marginBottom: 12, marginTop: 8, color: COLORS.textDark },
  // Log methods
  logMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,
    ...SHADOWS.small,
  },
  logMethodEmoji: { fontSize: 32, marginRight: 16 },
  logMethodInfo: { flex: 1 },
  logMethodTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark },
  logMethodDesc: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  // Mode container
  modeContainer: { marginBottom: 20 },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modeTitle: { ...FONTS.h3 },
  backText: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
  // Search
  searchInput: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    fontSize: 17,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  descriptionInput: { minHeight: 100, textAlignVertical: 'top' },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    ...SHADOWS.small,
  },
  searchResultInfo: { flex: 1 },
  searchResultName: { fontSize: 16, fontWeight: '600', color: COLORS.textDark },
  searchResultServe: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  searchResultKj: {},
  kjBadge: {
    backgroundColor: COLORS.primarySoft,
    color: COLORS.primaryDark,
    fontWeight: '700',
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    overflow: 'hidden',
  },
  noResults: { fontSize: 15, color: COLORS.textMuted, textAlign: 'center', padding: 20 },
  // Log button
  logButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    ...SHADOWS.glow,
  },
  logButtonDisabled: { backgroundColor: COLORS.grey, shadowColor: 'transparent' },
  logButtonText: { ...FONTS.button, fontSize: 18 },
  // Photo
  photoPreview: { width: '100%', height: 200, borderRadius: 16, marginBottom: 16 },
  analysisCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 18,
    ...SHADOWS.small,
  },
  analysisDesc: { fontSize: 16, color: COLORS.textDark, marginBottom: 14, lineHeight: 24 },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  analysisFood: { fontSize: 15, color: COLORS.textDark },
  analysisKj: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  analysisTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 4,
  },
  analysisTotalLabel: { fontSize: 17, fontWeight: '700', color: COLORS.textDark },
  analysisTotalKj: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  // Planned
  plannedSubtitle: { ...FONTS.caption, marginBottom: 12 },
  plannedMeal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    ...SHADOWS.small,
  },
  plannedEmoji: { fontSize: 28, marginRight: 14 },
  plannedInfo: { flex: 1 },
  plannedType: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase' },
  plannedName: { fontSize: 16, fontWeight: '600', color: COLORS.textDark, marginTop: 2 },
  plannedKj: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  // Analyzing
  analyzingCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginVertical: 12,
  },
  analyzingEmoji: { fontSize: 40, marginBottom: 8 },
  analyzingText: { fontSize: 18, fontWeight: '600', color: COLORS.textDark },
  analyzingSubtext: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  // Log entries
  emptyLog: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
  },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.textDark },
  emptySubtext: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  logEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    ...SHADOWS.small,
  },
  logEntryLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logEntryIcon: { fontSize: 22, marginRight: 12 },
  logEntryName: { fontSize: 15, fontWeight: '600', color: COLORS.textDark, maxWidth: 200 },
  logEntryTime: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  logEntryKj: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  // Comparison
  comparisonCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
    ...SHADOWS.small,
  },
  comparisonTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark, marginBottom: 14 },
  comparisonRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  comparisonItem: { alignItems: 'center', flex: 1 },
  comparisonLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase' },
  comparisonValue: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginTop: 4 },
  comparisonDivider: { width: 1, height: 40, backgroundColor: COLORS.grey },
});

export default FoodLogScreen;
