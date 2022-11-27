import { Text, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import * as Location from "expo-location";
import { useState, useEffect } from "react";

import MapAroundMe from "../components/MapAroundMe";

const AroundMe = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const askPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
          const obj = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setCoordinates(obj);
        } else {
          setErrorMessage(true);
        }
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    askPermission();
  }, []);

  return loading ? (
    <ActivityIndicator
      size="large"
      color="purple"
      style={{ marginTop: Dimensions.get("window").height / 2 - 100 }}
    />
  ) : errorMessage ? (
    <Text>Permission refusée</Text>
  ) : (
    <MapAroundMe coordinates={coordinates} />
  );
};

export default AroundMe;

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
});
