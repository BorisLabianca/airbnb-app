import {
  Text,
  Image,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import SwiperWithRenderItems from "../components/SwiperWithRenderItems";
import MapView, { Marker } from "react-native-maps";

const RoomScreen = ({ route }) => {
  // const route = useRoute();
  // console.log(route);
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState();
  const [fullDesc, setFullDesc] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  // console.log(route.params.id);
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${route.params.id}`
        );
        setRoomData(response.data);

        // console.log(longitude);

        setLatitude(response.data.location[1]);
        // console.log(response.data.location[1]);
        setLongitude(response.data.location[0]);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoom();
  }, []);
  const rating = [];
  if (!loading) {
    for (let i = 0; i < 5; i++) {
      if (i < roomData.ratingValue) {
        rating.push(
          <Ionicons name="star-sharp" size={22} color="#FFB000" key={i} />
        );
      } else {
        rating.push(
          <Ionicons name="star-sharp" size={22} color="#BBBBBB" key={i} />
        );
      }
    }
  }

  return loading ? (
    <ActivityIndicator
      size="large"
      color="purple"
      style={{ marginTop: Dimensions.get("window").height / 2 - 100 }}
    />
  ) : (
    <ScrollView style={styles.container}>
      <View style={styles.picturesContainer}>
        <View style={styles.carrouselContainer}>
          <SwiperWithRenderItems roomData={roomData} />
        </View>
        {/* <Image source={{ uri: roomData.photos[0].url }} style={styles.image} /> */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{roomData.price} €</Text>
        </View>
      </View>
      <View style={styles.subRoomPicPart}>
        <View style={styles.titleNInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {roomData.title}
          </Text>
          <View style={styles.stars}>
            {rating}
            <Text style={styles.reviewNumber}>{roomData.reviews} reviews</Text>
          </View>
        </View>
        <Image
          source={{ uri: roomData.user.account.photo.url }}
          style={styles.user}
        />
      </View>
      <Text style={styles.description} numberOfLines={!fullDesc ? 3 : null}>
        {roomData.description}
      </Text>
      {fullDesc ? (
        <TouchableOpacity
          style={styles.moreLessContainer}
          onPress={() => {
            setFullDesc(!fullDesc);
          }}
        >
          <Text style={styles.moreLess}>Show less</Text>
          <Ionicons name="caret-up-sharp" size={20} color="#757575" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.moreLessContainer}
          onPress={() => {
            setFullDesc(!fullDesc);
          }}
        >
          <Text style={styles.moreLess}>Show more</Text>
          <Ionicons name="caret-down-sharp" size={20} color="#757575" />
        </TouchableOpacity>
      )}
      <MapView
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        style={styles.map}
      >
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title={roomData.title}
          description={roomData.description}
        />
      </MapView>
    </ScrollView>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  child: {
    width: Dimensions.get("window").width,
    height: 300,
    justifyContent: "center",
  },
  picturesContainer: {
    position: "relative",
  },
  image: {
    width: Dimensions.get("window").width,
    height: 300,
  },
  priceContainer: {
    height: 50,
    width: 100,
    backgroundColor: "black",
    position: "absolute",
    top: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  priceText: {
    color: "white",
    fontSize: 22,
    fontWeight: "500",
    alignItems: "center",
    justifyContent: "center",
  },
  subRoomPicPart: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  titleNInfo: {
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 19,
    fontWeight: "500",
    width: Dimensions.get("window").width - 125,
  },
  stars: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  reviewNumber: {
    marginLeft: 5,
    color: "#BEBEBE",
  },
  user: {
    height: 80,
    width: 80,
    borderRadius: 80,
  },
  description: {
    paddingHorizontal: 20,
    marginTop: 15,
    fontSize: 15,
  },
  moreLessContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  moreLess: {
    paddingHorizontal: 20,
    marginTop: 15,
    color: "#757575",
    fontSize: 15,
    marginRight: -15,
  },
  map: {
    height: 300,
    width: Dimensions.get("window").width,
  },
});
