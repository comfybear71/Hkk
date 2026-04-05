import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, SHADOWS } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

const WeightChart = ({ data = [] }) => {
  if (data.length < 2) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyText}>
          Log at least 2 weight entries to see your progress chart!
        </Text>
        <Text style={styles.emptySubtext}>
          You're doing great just by starting 💚
        </Text>
      </View>
    );
  }

  const labels = data.slice(-10).map(entry => {
    const d = new Date(entry.date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });

  const weights = data.slice(-10).map(entry => entry.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const diff = weights[weights.length - 1] - weights[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📈 Weight Progress</Text>
        {diff !== 0 && (
          <View style={[styles.diffBadge, { backgroundColor: diff <= 0 ? COLORS.primarySoft : COLORS.accentSoft }]}>
            <Text style={[styles.diffText, { color: diff <= 0 ? COLORS.primaryDark : COLORS.accentDark }]}>
              {diff <= 0 ? '↓' : '↑'} {Math.abs(diff).toFixed(1)} kg
            </Text>
          </View>
        )}
      </View>

      <LineChart
        data={{
          labels,
          datasets: [{ data: weights }],
        }}
        width={screenWidth - 56}
        height={200}
        yAxisSuffix=" kg"
        chartConfig={{
          backgroundColor: COLORS.white,
          backgroundGradientFrom: COLORS.white,
          backgroundGradientTo: COLORS.white,
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(78, 125, 80, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: COLORS.primary,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: COLORS.grey,
            strokeWidth: 0.5,
          },
        }}
        bezier
        style={styles.chart}
        fromZero={false}
        withInnerLines={true}
        withOuterLines={false}
      />

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Start</Text>
          <Text style={styles.statValue}>{weights[0].toFixed(1)} kg</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>{weights[weights.length - 1].toFixed(1)} kg</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Lowest</Text>
          <Text style={styles.statValue}>{minWeight.toFixed(1)} kg</Text>
        </View>
      </View>

      {diff < 0 && (
        <Text style={styles.encouragement}>
          You're glowing! Down {Math.abs(diff).toFixed(1)} kg — incredible work! 💖✨
        </Text>
      )}
      {diff === 0 && (
        <Text style={styles.encouragement}>
          Steady and strong — consistency is key! 💪🌟
        </Text>
      )}
      {diff > 0 && (
        <Text style={styles.encouragement}>
          Don't worry, love — your body fluctuates naturally. Keep going! 💚
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 16,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  diffBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  diffText: {
    fontWeight: '700',
    fontSize: 14,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 4,
  },
  encouragement: {
    textAlign: 'center',
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 12,
    fontStyle: 'italic',
  },
  emptyContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});

export default WeightChart;
