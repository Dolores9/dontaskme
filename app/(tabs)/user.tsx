import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import Footer from "../components/footer";
import {
  MaterialIcons,
  Feather,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";

export default function TabUser() {
  const user = getAuth().currentUser;

  if (!user) {
    router.replace("..");
    return null;
  }

  const placeholderUser = {
    name: user.displayName || "Dolores Stiegelis",
    email: user.email || "dolores.stiegelis@example.com",
    phone: "+31 6 12345678",
    location: "Rotterdam, Netherlands",
    joinDate: "January 2025",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{placeholderUser.name}</Text>

        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={20} color="#555" />
          <Text style={styles.infoText}>{placeholderUser.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="phone" size={20} color="#555" />
          <Text style={styles.infoText}>{placeholderUser.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Entypo name="location-pin" size={20} color="#555" />
          <Text style={styles.infoText}>{placeholderUser.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome5 name="calendar-alt" size={18} color="#555" />
          <Text style={styles.infoText}>
            Joined: {placeholderUser.joinDate}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
       <Footer />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    color: "#333",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  button: {
    width: "90%",
    backgroundColor: "#5C6BC0",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5C6BC0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
