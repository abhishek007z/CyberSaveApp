import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
const HomeScreen = ({ navigation }) => {
  const handleNotifications = () => {
    navigation.navigate("Notifications");
  };

  const handleGovernmentSchemes = () => {
    navigation.navigate("GovernmentSchemes");
  };

  const handleChatbot = () => {
    navigation.navigate("Chatbot");
  };

  return (
    <ScreenContainer style={styles.container}>
   
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CyberSave</Text>

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotifications}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.greeting}>
          Welcome to CyberSave
        </Text>

        <Text style={styles.subtitle}>
          Manage your financial services easily
        </Text>

        {/* Government Schemes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Government Schemes
          </Text>

          <TouchableOpacity
            onPress={handleGovernmentSchemes}
          >
            <Text style={styles.viewAll}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.schemeCard}
          onPress={handleGovernmentSchemes}
        >
          <View style={styles.schemeIcon}>
            <Text style={styles.schemeIconText}>🏛️</Text>
          </View>

          <View style={styles.schemeInfo}>
            <Text style={styles.schemeTitle}>
              Government Schemes
            </Text>

            <Text style={styles.schemeDescription}>
              Explore available government schemes and benefits
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chatbot Floating Button */}
      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={handleChatbot}
      >
        <Text style={styles.chatbotIcon}>
          💬
        </Text>
      </TouchableOpacity>
   
  </ScreenContainer>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

header: {
  height: 80,
  paddingHorizontal: 20,
  paddingTop: 15,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottomWidth: 1,
  borderBottomColor: "#EEEEEE",
},

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  notificationIcon: {
    fontSize: 22,
  },

  content: {
    flex: 1,
    padding: 20,
  },

  greeting: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 6,
    marginBottom: 30,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
  },

  viewAll: {
    fontSize: 14,
    fontWeight: "600",
  },

  schemeCard: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  schemeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
  },

  schemeIconText: {
    fontSize: 24,
  },

  schemeInfo: {
    flex: 1,
    marginLeft: 14,
  },

  schemeTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  schemeDescription: {
    marginTop: 5,
    fontSize: 12,
    color: "#666666",
    lineHeight: 17,
  },

  arrow: {
    fontSize: 28,
    marginLeft: 8,
  },

  chatbotButton: {
    position: "absolute",
    right: 20,
    bottom: 25,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  chatbotIcon: {
    fontSize: 24,
  },
});

export default HomeScreen;