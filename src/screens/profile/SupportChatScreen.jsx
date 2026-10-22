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
  { label: "Check Status", prompt: "How do I check my ongoing application status?" },
  { label: "ITR Help", prompt: "How can I link my PAN with Aadhaar for ITR e-filing?" },
  { label: "Talk to Agent", prompt: "I need human support for my grievance ticket." },
];

const SupportChatScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: "support-1",
      sender: "agent",
      text: "Hello! Welcome to Cybersave digital trust support. I can assist you with ITR, DSC, or travel filings.",
    },
    {
      id: "support-2",
      sender: "user",
      text: "Hey, I am having issues while uploading PDF for PAN Update.",
    },
    {
      id: "support-3",
      sender: "agent",
      text: "Got it. Please ensure the PDF is under 5MB and is password-free. Let me check your session status.",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, sending]);

  useEffect(() => {
    if (route?.params?.initialQuery) {
      const q = route.params.initialQuery;
      setTimeout(() => {
        sendMessageText(q);
      }, 300);
    }
  }, [route?.params?.initialQuery]);

  const sendMessageText = async (rawText) => {
    const trimmed = (rawText || "").trim();
    if (!trimmed || sending) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputMessage("");
    setSending(true);

    const historyPayload = nextMessages
      .filter((m) => !m.isError)
      .map((m) => ({
        role: m.sender === "agent" ? "assistant" : "user",
        content: m.text,
      }));

    try {
      const response = await chatbotService.sendMessage({
        message: trimmed,
        context: "support",
        history: historyPayload,
      });

      const botReply =
        response?.reply ||
        response?.data?.reply ||
        "Thank you for contacting support. Our team will review your inquiry.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          text: botReply,
        },
      ]);
    } catch (err) {
      console.warn("Support Chatbot Error:", err.message);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          text:
            "Unable to connect to live support at the moment. Please call our toll-free helpline at 1930 for immediate help.",
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
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      {/* TOP WHITE HEADER (Figma screen-live-chat) */}
      <View
        style={[
          styles.whiteHeader,
          { paddingTop: Math.max(insets.top, 14) + 6 },
        ]}
      >
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerAgentInfo}>
          <View style={styles.agentAvatarBox}>
            <Ionicons name="person" size={16} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.headerAgentName}>Support Chat</Text>
            <View style={styles.onlineRow}>
              <View style={styles.greenDot} />
              <Text style={styles.onlineText}>Agent Online</Text>
            </View>
          </View>
        </View>

        <View style={{ width: 38 }} />
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isUser ? styles.userRow : styles.agentRow,
              ]}
            >
              {!isUser && (
                <View style={styles.msgAvatarBox}>
                  <Ionicons name="headset" size={14} color="#2563EB" />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  isUser ? styles.userBubble : styles.agentBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.userMessageText : styles.agentMessageText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          );
        })}

        {sending && (
          <Text style={styles.typingIndicator}>Agent Rahul is typing...</Text>
        )}
      </ScrollView>

      {/* QUICK PROMPT CHIPS */}
      <View style={styles.chipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {QUICK_CHIPS.map((chip, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.chipPill}
              onPress={() => sendMessageText(chip.prompt)}
              activeOpacity={0.75}
            >
              <Text style={styles.chipText}>{chip.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* BOTTOM INPUT BAR */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity
            style={styles.attachBtn}
            onPress={() =>
              Alert.alert(
                "Attach Document",
                "Attach a screenshot or PDF proof for faster ticket investigation."
              )
            }
            activeOpacity={0.7}
          >
            <Ionicons name="attach-outline" size={22} color="#64748B" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            value={inputMessage}
            onChangeText={setInputMessage}
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSend}
            disabled={!inputMessage.trim() || sending}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
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
  whiteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAgentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  agentAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAgentName: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  onlineText: {
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "600",
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
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  agentRow: {
    justifyContent: "flex-start",
  },
  msgAvatarBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 2,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  agentMessageText: {
    color: "#0F172A",
  },
  typingIndicator: {
    fontSize: 11.5,
    color: "#64748B",
    fontStyle: "italic",
    marginLeft: 36,
    marginTop: 4,
  },
  chipsContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chipPill: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 10,
  },
  attachBtn: {
    padding: 6,
  },
  input: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    height: 40,
    fontSize: 13,
    color: "#0F172A",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SupportChatScreen;