import { View, Text, StyleSheet,TouchableOpacity } from "react-native";

const NotificationScreen = ({navigation}) => {
  return (
   
 <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 18 }}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 20, fontSize: 24 }}>
        Notifications
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
  },
});

export default NotificationScreen;