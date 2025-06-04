import { router, Stack, useLocalSearchParams } from "expo-router";
import useCurrentUserId from './hooks/useAuth';
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ItemModal() {
  // gat the id from the url
  const { id } = useLocalSearchParams();
  const uid = useCurrentUserId(); 

  // local state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // local state for edit mode
  const [editMode, setEditMode] = useState(false);

  // get the database context
  const database = useSQLiteContext();

  React.useEffect(() => {
    if (id) {
      // if id is present, then we are in edit mode
      setEditMode(true);
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    const result = await database.getFirstAsync<{
      id: number;
      title: string;
      description: string;
      uid: string;
    }>(`SELECT * FROM tasks WHERE uid = ?`, [parseInt(uid as string)]);
    setTitle(result?.title!);
    setDescription(result?.description!);
  };

  const handleSave = async () => {
    try {
      const response = await database.runAsync(
        `INSERT INTO tasks (title, description, uid) VALUES (?, ?, ?)`,
        [title, description, uid]
      );
      console.log("Item saved successfully:", response?.changes!);
      router.back();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await database.runAsync(
        `UPDATE tasks SET title = ?, description = ? WHERE id = ?`,
        [title, description, parseInt(id as string)]
      );
      console.log("Task updated successfully:", response?.changes!);
      router.back();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await database.runAsync(`DELETE FROM tasks WHERE id = ?`, [parseInt(id as string)]);
      console.log("Task deleted");
      router.back();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "task Modal" }} />
        <View style={styles.card}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          style={styles.textTitle}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
          style={styles.textDescription}
        />
    </View>
      <View style={{ flex: 1, flexDirection: "row", gap: 20 }}>
      {editMode && (
          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.button]}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.button]}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            editMode ? handleUpdate() : handleSave();
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonText}>{editMode ? "Update" : "Save"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    padding: 10,
  },
  textTitle: {
    borderWidth: 1,
    padding: 10,
    margin: 5,
    width: 300,
    borderRadius: 5,
    borderColor: "lightgrey",
    
  },
  textDescription: {
    borderWidth: 1,
    padding: 30,
    margin: 5,
    width: 300,
    borderRadius: 5,
    borderColor: "lightgrey",
    
  },
  button: {
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "#5C6BC0",
    margin: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  card: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderColor: "#ccc",
    marginBottom: 5,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
