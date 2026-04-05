import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONTS } from '../theme/colors';

const KJProgressRing = ({ current, goal, size = 200, strokeWidth = 16 }) => {
  const ratio = Math.min(current / goal, 1.2);
  const percentage = Math.min(ratio * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (ratio <= 0.7) return COLORS.success;
    if (ratio <= 0.9) return COLORS.warning;
    if (ratio <= 1.0) return COLORS.warningDark;
    return COLORS.danger;
  };

  const getMessage = () => {
    if (ratio <= 0.5) return 'Great start! 🌱';
    if (ratio <= 0.7) return 'Looking good! 💚';
    if (ratio <= 0.9) return 'Almost there! 🧡';
    if (ratio <= 1.0) return 'Right on target! 🎯';
    return 'A little over — you\'re okay! 💪';
  };

  const remaining = Math.max(goal - current, 0);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.grey}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.3}
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={[styles.centerText, { width: size, height: size }]}>
        <Text style={[styles.kjValue, { color: getColor() }]}>{current.toLocaleString()}</Text>
        <Text style={styles.kjLabel}>of {goal.toLocaleString()} kJ</Text>
        <Text style={styles.remaining}>
          {remaining > 0 ? `${remaining.toLocaleString()} kJ left` : 'Goal reached!'}
        </Text>
        <Text style={styles.message}>{getMessage()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kjValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  kjLabel: {
    ...FONTS.caption,
    marginTop: 2,
  },
  remaining: {
    ...FONTS.label,
    marginTop: 6,
  },
  message: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default KJProgressRing;
