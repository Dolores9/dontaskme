import React, { useEffect } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Geofencing({
  onGeofenceCheck,
}: {
  onGeofenceCheck: (message?: string) => void;
}) {
  const GEOFENCE_REGION = {
    latitude: 51.91728965933152,
    longitude: 4.484664933067359,
    radius: 100,
  };

  useEffect(() => {
    checkLocationOnce();
  }, []);

  const checkLocationOnce = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      onGeofenceCheck(
        "Toegang geweigerd: Locatie is nodig om te bepalen of je op school bent."
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    console.log("Current Location:", latitude, longitude);

    const today = new Date().toISOString().split("T")[0]; 
    const lastAlert = await AsyncStorage.getItem("lastGeofenceAlert");

    if (lastAlert === today) {
      console.log("Alert is vandaag al getoond.");
      return;
    }

    if (isWithinGeofence(latitude, longitude)) {
      console.log("User is within geofence.");
      onGeofenceCheck();
      Alert.alert("Je bent op school, succes!");
    } else {
      console.log("User is outside geofence.");
      onGeofenceCheck();
      Alert.alert("Tijd om aan de slag te gaan?");
    }

    await AsyncStorage.setItem("lastGeofenceAlert", today);
  };

  const isWithinGeofence = (lat: number, lon: number) => {
    const distance = getDistanceFromLatLonInMeters(
      lat,
      lon,
      GEOFENCE_REGION.latitude,
      GEOFENCE_REGION.longitude
    );
    return distance <= GEOFENCE_REGION.radius;
  };

  function getDistanceFromLatLonInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  return null;
}
