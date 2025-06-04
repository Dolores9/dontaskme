import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

export default function header() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />
      <TouchableOpacity
        onPress={() => router.push("/modal")}
        style={styles.button}
      >
        <FontAwesome name="plus-circle" size={28} color="#5C6BC0" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  button: {
    padding: 5,
  },
});
