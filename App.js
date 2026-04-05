import React from 'react';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import useStore from './src/store/useStore';

// Simple confetti effect component (lightweight alternative for web)
const ConfettiOverlay = () => {
  const { showConfetti } = useStore();

  if (!showConfetti) return null;

  return (
    <View style={styles.confettiOverlay} pointerEvents="none">
      <Text style={styles.confettiText}>🎉 🌟 ✨ 💚 🎊</Text>
      <Text style={styles.confettiMessage}>Amazing work! 🏆</Text>
    </View>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFFFE" />
      <AppNavigator />
      <ConfettiOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFFFE',
  },
  confettiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 999,
  },
  confettiText: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  confettiMessage: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
