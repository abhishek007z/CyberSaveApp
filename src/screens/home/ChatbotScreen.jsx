import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import chatbotService from "../../services/chatbot.service";

const QUICK_CHIPS = [
  { label: "Update Aadhaar", prompt: "How do I update my Aadhaar address online?", icon: "shield-checkmark-outline" },
  { label: "Link PAN", prompt: "How do I link PAN card with Aadhaar?", icon: "link-outline" },
  { label: "Income Cert.", prompt: "What documents are required for Income Certificate?", icon: "document-text-outline" },
  { label: "Check Status", prompt: "How can I track my active application status?", icon: "time-outline" },
];

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    sender: "cyberbot",
    text: "Hello Rajesh! 👋 I am CyberBot, your AI Assistant for Indian Government services.",
    time: "10:00 AM",
  },
  {
    id: "welcome-2",
    sender: "cyberbot",
    text: "How can I help you today? You can ask about Aadhaar, PAN card, Birth/Caste certificates, or active application tracking.",
    time: "10:00 AM",
  },
];

const formatCurrentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};

const ChatbotScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, sending]);

  const sendMessageText = async (rawText) => {
    const trimmed = (rawText || "").trim();
    if (!trimmed || sending) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmed,
      time: formatCurrentTime(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputMessage("");
    setSending(true);

    const historyPayload = nextMessages
      .filter((m) => !m.isError)
      .map((m) => ({
        role: m.sender === "cyberbot" ? "assistant" : "user",
        content: m.text,
      }));

    try {
      const response = await chatbotService.sendMessage({
        message: trimmed,
        context: "home",
        history: historyPayload,
      });

      const botReply =
        response?.reply ||
        response?.data?.reply ||
        "I am here to assist you with all government services available on CyberSave.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "cyberbot",
          text: botReply,
          time: formatCurrentTime(),
        },
      ]);
    } catch (err) {
      console.warn("Chatbot Error:", err.message);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "cyberbot",
          text:
            "I'm having a temporary connectivity issue reaching the CyberSave AI network. Please try asking again shortly.",
          time: formatCurrentTime(),
          isError: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => {
    sendMessageText(inputMessage);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1E3A8A"
        translucent={false}
      />

      {/* TOP HEADER (Figma cyberbot-chat) */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, 20) + 14, paddingBottom: 24 },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={20} color="#1D4ED8" />
          </TouchableOpacity>

          <View style={styles.botAvatar}>
            <Ionicons name="shield" size={20} color="#2563EB" />
          </View>

          <View>
            <Text style={styles.headerTitle}>cyberbot</Text>
            <View style={styles.statusRow}>
              <View style={styles.greenDot} />
              <Text style={styles.headerSubtitle}>Official Assistant • Online</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            setMessages([
              {
                id: Date.now().toString(),
                sender: "cyberbot",
                text: "Chat refreshed. How can I help you next?",
                time: formatCurrentTime(),
              },
            ]);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* CHAT MESSAGES AREA */}
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dateStampContainer}>
            <Text style={styles.dateStampText}>TODAY</Text>
          </View>

          {messages.map((msg) => {
            const isBot = msg.sender === "cyberbot";
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isBot ? styles.botRow : styles.userRow,
                ]}
              >
                {/* Sender label above bubble */}
                <Text
                  style={[
                    styles.senderLabel,
                    isBot ? styles.botSenderLabel : styles.userSenderLabel,
                  ]}
                >
                  {isBot ? "cyberbot" : "You"}
                </Text>

                {/* Message Bubble with Gradient for User */}
                {isBot ? (
                  <View
                    style={[
                      styles.messageBubble,
                      styles.botBubble,
                      msg.isError && styles.errorBubble,
                    ]}
                  >
                    <Text style={styles.botText}>{msg.text}</Text>
                  </View>
                ) : (
                  <LinearGradient
                    colors={["#1E3A8A", "#2563EB"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.messageBubble, styles.userBubble]}
                  >
                    <Text style={styles.userText}>{msg.text}</Text>
                  </LinearGradient>
                )}

                {/* Timestamp below bubble on right */}
                <Text style={styles.msgTime}>{msg.time}</Text>
              </View>
            );
          })}

          {/* Typing Indicator */}
          {sending && (
            <View style={[styles.messageRow, styles.botRow]}>
              <Text style={[styles.senderLabel, styles.botSenderLabel]}>
                cyberbot
              </Text>
              <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
                <ActivityIndicator size="small" color="#2563EB" />
                <Text style={styles.typingText}>cyberbot is typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* QUICK SUGGESTION CHIPS (Figma) */}
        <View style={styles.chipsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContent}
          >
            {QUICK_CHIPS.map((chip) => (
              <TouchableOpacity
                key={chip.label}
                style={styles.chipButton}
                onPress={() => sendMessageText(chip.prompt)}
                disabled={sending}
                activeOpacity={0.75}
              >
                <Ionicons name={chip.icon} size={14} color="#2563EB" />
                <Text style={styles.chipText}>{chip.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* INPUT BAR (Figma) */}
        <View
          style={[
            styles.bottomBarWrapper,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.iconInsideBtn} activeOpacity={0.7}>
              <Ionicons name="attach-outline" size={20} color="#64748B" />
            </TouchableOpacity>

            <TextInput
              style={styles.inputField}
              placeholder="Ask me about Aadhaar, PAN..."
              placeholderTextColor="#94A3B8"
              value={inputMessage}
              onChangeText={setInputMessage}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!sending}
            />

            <TouchableOpacity style={styles.iconInsideBtn} activeOpacity={0.7}>
              <Ionicons name="mic-outline" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.sendButtonTouch}
            onPress={handleSend}
            disabled={!inputMessage.trim() || sending}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={
                !inputMessage.trim() || sending
                  ? ["#CBD5E1", "#94A3B8"]
                  : ["#1E3A8A", "#2563EB"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendGradient}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="send" size={18} color="#FFFFFF" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  flexOne: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#22C55E",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#BFDBFE",
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  chatScroll: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  dateStampContainer: {
    alignSelf: "center",
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  dateStampText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  messageRow: {
    marginBottom: 14,
    maxWidth: "82%",
  },
  botRow: {
    alignSelf: "flex-start",
  },
  userRow: {
    alignSelf: "flex-end",
  },
  senderLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  botSenderLabel: {
    color: "#2563EB",
    marginLeft: 4,
  },
  userSenderLabel: {
    color: "#475569",
    textAlign: "right",
    marginRight: 4,
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  botBubble: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  errorBubble: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  botText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: "#1E293B",
  },
  userText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: "#FFFFFF",
  },
  msgTime: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
    alignSelf: "flex-end",
    marginRight: 4,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  typingText: {
    fontSize: 12.5,
    color: "#64748B",
    fontStyle: "italic",
  },
  chipsContainer: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  chipsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  bottomBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    height: 44,
  },
  iconInsideBtn: {
    padding: 6,
  },
  inputField: {
    flex: 1,
    fontSize: 13,
    color: "#1E293B",
    paddingHorizontal: 6,
  },
  sendButtonTouch: {
    borderRadius: 22,
    overflow: "hidden",
  },
  sendGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatbotScreen;