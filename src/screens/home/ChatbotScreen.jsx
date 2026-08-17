import { View, Text, TouchableOpacity } from "react-native";

const ChatbotScreen = ({ navigation }) => {
  return (
    <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 18 }}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 20, fontSize: 24 }}>
        Chatbot Screen
      </Text>
    </View>
  );
};

export default ChatbotScreen;