import apiClient from "./api/client";

const chatbotService = {
  /**
   * Send a message to the CyberSave Unified Chatbot Backend
   * @param {Object} params
   * @param {string} params.message - The user's input question
   * @param {string} [params.context="general"] - "home" | "faq" | "general"
   * @param {Array} [params.history=[]] - Conversation history [{ role: "user"|"assistant", content: string }]
   */
  sendMessage: async ({ message, context = "general", history = [] }) => {
    const response = await apiClient.post("/auth/chatbot/message", {
      message: message.trim(),
      context,
      history,
    });
    return response.data;
  },
};

export default chatbotService;
