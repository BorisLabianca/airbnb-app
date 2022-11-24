import { Text, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";

const AroundMe = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(false);
  const [coordinates, setCoordinates] = useState();
  const [aroundMe, setAroundMe] = useState();

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

          if (coordinates) {
            try {
              const response = await axios.get(
                `https://express-airbnb-api.herokuapp.com/rooms/around?latitude=${obj.latitude}&longitude=${obj.longitude}`
              );
              setAroundMe(response.data);
            } catch (error) {
              console.log(error);
            }
          }
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
      style={{ marginTop: Dimensions.get("window").height / 2 }}
    />
  ) : errorMessage ? (
    <Text>Permission refusée</Text>
  ) : (
    <MapView
      showsUserLocation={true}
      initialRegion={{
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      style={styles.map}
    >
      {aroundMe.map((appart) => {
        return (
          <Marker
            key={appart._id}
            coordinate={{
              latitude: appart.location[1],
              longitude: appart.location[0],
            }}
          />
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
});

export default AroundMe;
