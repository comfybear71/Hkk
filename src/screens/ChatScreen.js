import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import useStore from '../store/useStore';
import { sendChatMessage } from '../services/aiService';

const QUICK_PROMPTS = [
  { label: '🍝 Pasta swap?', text: 'What can I eat instead of pasta tonight?' },
  { label: '🍫 Sweet craving', text: "I'm craving something sweet — any healthy ideas under 500 kJ?" },
  { label: '🥗 Snack ideas', text: "What are some healthy snacks under 400 kJ?" },
  { label: '💪 Motivation', text: "I'm struggling to stay motivated. Can you help?" },
  { label: '🌅 Breakfast tips', text: "What's a quick healthy breakfast under 1200 kJ?" },
  { label: '💧 Water intake', text: "How much water should I drink daily?" },
];

const ChatScreen = () => {
  const { chatHistory, addChatMessage, clearChat } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const handleSend = async (messageText = null) => {
    const text = (messageText || input).trim();
    if (!text || isTyping) return;

    const userMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    addChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await sendChatMessage(text, chatHistory);
      const assistantMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(assistantMessage);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: "Oh no, I'm having a moment! 😅 Please try again in a sec, love 💚",
        timestamp: new Date().toISOString(),
      };
      addChatMessage(errorMessage);
    }

    setIsTyping(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerEmoji}>💬</Text>
            <View>
              <Text style={styles.headerTitle}>Glow Coach</Text>
              <Text style={styles.headerSubtitle}>Your friendly nutrition buddy</Text>
            </View>
          </View>
          {chatHistory.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {chatHistory.length === 0 && (
            <View style={styles.welcome}>
              <Text style={styles.welcomeEmoji}>🌸</Text>
              <Text style={styles.welcomeTitle}>Hi there, gorgeous!</Text>
              <Text style={styles.welcomeText}>
                I'm your Glow Coach — here to help with healthy eating, meal ideas, motivation,
                and anything wellness-related. Ask me anything! 💚
              </Text>

              <Text style={styles.quickTitle}>Try asking me:</Text>
              <View style={styles.quickPrompts}>
                {QUICK_PROMPTS.map((prompt, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickButton}
                    onPress={() => handleSend(prompt.text)}
                  >
                    <Text style={styles.quickButtonText}>{prompt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {chatHistory.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              {msg.role === 'assistant' && (
                <Text style={styles.coachLabel}>🌟 Glow Coach</Text>
              )}
              <Text style={[
                styles.messageText,
                msg.role === 'user' ? styles.userText : styles.assistantText,
              ]}>
                {msg.content}
              </Text>
              <Text style={[
                styles.timestamp,
                msg.role === 'user' && { color: '#FFFFFF90' },
              ]}>
                {new Date(msg.timestamp).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageBubble, styles.assistantBubble, styles.typingBubble]}>
              <Text style={styles.coachLabel}>🌟 Glow Coach</Text>
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.typingText}>Thinking... ✨</Text>
              </View>
            </View>
          )}

          {chatHistory.length > 0 && !isTyping && (
            <View style={styles.suggestionsSection}>
              <Text style={styles.suggestionsTitle}>More questions?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {QUICK_PROMPTS.slice(0, 4).map((prompt, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionPill}
                    onPress={() => handleSend(prompt.text)}
                  >
                    <Text style={styles.suggestionText}>{prompt.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything about healthy eating... 💬"
            placeholderTextColor={COLORS.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            editable={!isTyping}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || isTyping) && styles.sendButtonDisabled]}
            onPress={() => handleSend()}
            disabled={!input.trim() || isTyping}
          >
            <Text style={styles.sendText}>💚</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerEmoji: { fontSize: 28, marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textDark },
  headerSubtitle: { fontSize: 13, color: COLORS.textMuted },
  clearButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  clearText: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  // Messages
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  // Welcome
  welcome: {
    alignItems: 'center',
    padding: 20,
  },
  welcomeEmoji: { fontSize: 56, marginBottom: 16 },
  welcomeTitle: { ...FONTS.h2, textAlign: 'center', marginBottom: 12 },
  welcomeText: {
    ...FONTS.body,
    textAlign: 'center',
    color: COLORS.textSecondary,
    lineHeight: 26,
    marginBottom: 24,
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  quickPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  quickButton: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickButtonText: { fontSize: 15, fontWeight: '600', color: COLORS.primaryDark },
  // Message bubbles
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    backgroundColor: COLORS.cardBg,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  coachLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: { color: COLORS.white },
  assistantText: { color: COLORS.textDark },
  timestamp: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: 'right',
  },
  // Typing
  typingBubble: { minWidth: 140 },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typingText: { fontSize: 14, color: COLORS.textMuted, fontStyle: 'italic' },
  // Suggestions
  suggestionsSection: { marginTop: 8, marginBottom: 16 },
  suggestionsTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted, marginBottom: 8 },
  suggestionPill: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestionText: { fontSize: 14, color: COLORS.textSecondary },
  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 14,
    paddingTop: 14,
    fontSize: 16,
    color: COLORS.textDark,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    ...SHADOWS.glow,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.grey,
    shadowColor: 'transparent',
  },
  sendText: { fontSize: 22 },
});

export default ChatScreen;
