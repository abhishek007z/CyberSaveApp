import React from "react";
import { View, StyleSheet } from "react-native";

const OnboardingPagination = ({ activeIndex }) => {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          style={
            index === activeIndex
              ? styles.activePill
              : styles.inactiveDot
          }
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginVertical: 18,
  },
  activePill: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563EB",
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CBD5E1",
  },
});

export default OnboardingPagination;