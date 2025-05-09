import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSQLiteContext } from "expo-sqlite";
import useCurrentUserId from "../hooks/useAuth";
import Geofencing from "../components/geofence";

export default function TabHome(props: {
  onStateChange: (arg0: string, arg1: null) => void;
}) {
  const [geofenceMessage, setGeofenceMessage] = useState<string | undefined>();
  const [data, setData] = useState<
    { id: number; title: string; description: string; uid: string }[]
  >([]);
  const database = useSQLiteContext();
  const uid = useCurrentUserId();

  useFocusEffect(
    useCallback(() => {
      if (uid) {
        loadData();
      }
    }, [uid])
  );

  const headerRight = () => (
    <TouchableOpacity
      onPress={() => router.push("/modal")}
      style={{ marginRight: 10 }}
    >
      <FontAwesome name="plus-circle" size={28} color="#5C6BC0" />
    </TouchableOpacity>
  );

  const loadData = async () => {
    const result = await database.getAllAsync<{
      id: number;
      title: string;
      description: string;
      uid: string;
    }>("SELECT * FROM tasks WHERE uid = ?", [uid]);

    setData(result);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerRight }} />
      <FlatList
        data={data}
        renderItem={({
          item,
        }: {
          item: { id: number; title: string; description: string; uid: string };
        }) => (
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                router.push(`/modal?id=${item.id}&uid=${uid}`);
              }}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text style={styles.message}>{geofenceMessage}</Text>
      <Geofencing onGeofenceCheck={setGeofenceMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f4f4f4",
  },
  card: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderColor: "#ccc",
    elevation: 5,
    marginBottom: 5,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    marginBottom: 5,
  },
  titleText: {
    color: "#333",
    fontSize: 28,
    fontWeight: "800",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#5C6BC0",
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 0,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  message: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});
