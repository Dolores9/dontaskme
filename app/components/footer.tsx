import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Square } from "lucide-react-native"; 

const Footer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.brand}>ERICAI</Text>
        <Square size={12} color="#9ca3af" style={styles.icon} />
      </View>
      <Text style={styles.disclaimer}>
        All rights reserved. Unauthorized reproduction or distribution of this
        application or any portion of it may result in severe civil and criminal penalties.
      </Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
    backgroundColor: "#f3f4f6",
    borderTopWidth: 1,
    borderTopColor: "#d1d5db", 
    alignItems: "center",
    width: "100%",
    marginTop: 5
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  brand: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4b5563", 
  },
  icon: {
    marginLeft: 4,
  },
  disclaimer: {
    fontSize: 11,
    textAlign: "center",
    color: "#6b7280", 
  },
});
