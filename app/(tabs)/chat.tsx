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
const API_URL = "http://145.137.64.210:3000/api/chat";

type Message = {
  sender: "user" | "bot";
  text: string;
};

const TabChat = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [botTyping, setBotTyping] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(".");

  const sendQuestion = async () => {
  if (!question.trim()) {
    Alert.alert("Fout", "Voer ten minste één argument in.");
    return;
  }

  const userMessage: Message = { sender: 'user', text: question };
  setChatHistory((prev) => [...prev, userMessage]);
  setQuestion("");
  setBotTyping(true); 
  setLoading(true);

  try {
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) {
      throw new Error(`HTTP fout: ${res.status}`);
    }

    const data = await res.json();
    const botMessage: Message = { sender: 'bot', text: data.content };
    setChatHistory((prev) => [...prev, botMessage]);
  } catch (error: any) {
    console.error("Fout:", error);
    Alert.alert("Fout", error.message);
  } finally {
    setBotTyping(false); 
    setLoading(false);
  }
};


  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory]);

  useEffect(() => {
    if (!botTyping) {
      setTypingIndicator(".");
      return;
    }

    const dots = [".", "..", "..."];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % dots.length;
      setTypingIndicator(dots[index]);
    }, 500);

    return () => clearInterval(interval);
  }, [botTyping]);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={110}
      >
        <ScrollView
          style={styles.chatWindow}
          contentContainerStyle={{ paddingBottom: 10 }}
          ref={scrollViewRef}
        >
          {chatHistory.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.message,
                msg.sender === "user" ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text
                style={msg.sender === "user" ? styles.userText : styles.botText}
              >
                {msg.text}
              </Text>
            </View>
          ))}

          {botTyping && (
            <View style={[styles.message, styles.botMessage]}>
              <Text style={styles.botText}>{typingIndicator}</Text>
            </View>
          )}
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
    padding: 7,
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
  },
  userMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
  },
  userText: {
    color: "#000",
  },
  botText: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    alignItems: "center",
    paddingBottom: 5,
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
