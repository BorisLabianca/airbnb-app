import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";

import RoomCardHome from "../components/RoomCardHome";

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );
        // console.log(response.data[0]._id);
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.log(response.response);
      }
    };
    fetchRooms();
  }, []);
  return loading ? (
    <ActivityIndicator
      size="large"
      color="purple"
      style={{ marginTop: Dimensions.get("window").height / 2 - 100 }}
    />
  ) : (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item }) => (
          <RoomCardHome
            image={item.photos[0].url}
            price={item.price}
            title={item.title}
            roomId={item._id}
            ratings={item.ratingValue}
            reviews={item.reviews}
            userPhoto={item.user.account.photo.url}
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  mainPic: {
    height: 200,
    width: 400,
  },
});
