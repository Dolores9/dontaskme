import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const API_URL = "http://192.168.2.5:3000/api/chat";

const TabChat = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const sendQuestion = async () => {
    if (!question.trim()) {
      Alert.alert("Fout", "Voer ten minste één argument in.");
      return;
    }

    setLoading(true);

    console.log(question);
    try {
      const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error(`HTTP fout: ${res.status}`);
      }
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        `You: ${question}`,
        `Bot: ${data.content}`,
      ]);
      setQuestion("");
    } catch (error: any) {
      console.error("Fout:", error);
      Alert.alert("Fout", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={110}
      >
        <ScrollView
          style={styles.chatWindow}
          contentContainerStyle={{ paddingBottom: 10 }}
          ref={scrollViewRef} // Verbind de ref met de ScrollView
        >
          {chatHistory.map((msg, idx) => (
            <View key={idx} style={styles.message}>
              <Text>{msg}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Typ een argument..."
            value={question}
            onChangeText={setQuestion}
          />
          {loading ? (
            <ActivityIndicator style={{ marginLeft: 10 }} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={sendQuestion}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TabChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignSelf: "center",
    width: "90%",
    maxWidth: 400,
    paddingTop: 0,
    paddingBottom: 0,
  },
  chatWindow: {
    flex: 1,
    paddingTop: 0,
  },
  message: {
    marginVertical: 5,
    padding: 10,
    maxWidth: "80%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    alignItems: "center",
    paddingBottom: 0,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  button: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#5C6BC0",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
