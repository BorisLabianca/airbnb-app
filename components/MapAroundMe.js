import { useState, useEffect } from "react";
import { StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const MapAroundMe = ({ coordinates }) => {
  const [loading, setLoading] = useState(true);
  const [aroundMe, setAroundMe] = useState(null);
  const navigation = useNavigation();
  //   console.log(coordinates);
  useEffect(() => {
    const fetchAround = async () => {
      try {
        const roomsAround = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
        );
        // console.log(roomsAround.data);
        setAroundMe(roomsAround.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAround();
  }, []);

  return loading ? (
    <ActivityIndicator
      size="large"
      color="purple"
      style={{ marginTop: Dimensions.get("window").height / 2 - 100 }}
    />
  ) : (
    <MapView
      showsUserLocation={true}
      initialRegion={{
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
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
            title={appart.title}
            description={appart.description}
            onPress={() => {
              navigation.navigate("Room", { id: appart._id });
            }}
          />
        );
      })}
    </MapView>
  );
};

export default MapAroundMe;

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
});
