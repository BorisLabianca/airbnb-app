import {
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const RoomCardHome = ({
  image,
  price,
  userPhoto,
  title,
  ratings,
  reviews,
  roomId,
}) => {
  const navigation = useNavigation();
  const starRating = (ratings) => {
    const rating = [];
    for (let i = 0; i < 5; i++) {
      if (i < ratings) {
        rating.push(
          <Ionicons name="star-sharp" size={22} color="#FFB000" key={i} />
        );
      } else {
        rating.push(
          <Ionicons name="star-sharp" size={22} color="#BBBBBB" key={i} />
        );
      }
    }
    return rating;
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("Room", { id: roomId })}
    >
      <ImageBackground
        source={{ uri: image }}
        style={styles.mainPic}
        resizeMode="cover"
      >
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{price} €</Text>
        </View>
      </ImageBackground>

      <View style={styles.subRoomPicPart}>
        <View style={styles.titleNInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.stars}>
            {starRating(ratings)}
            <Text style={styles.reviewNumber}>{reviews} reviews</Text>
          </View>
        </View>
        <Image source={{ uri: userPhoto }} style={styles.user} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomColor: "#BEBEBE",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  mainPic: {
    height: 180,
    width: "100%",
    position: "relative",
  },
  priceContainer: {
    height: 50,
    width: 100,
    backgroundColor: "black",
    position: "absolute",
    top: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  priceText: {
    color: "white",
    fontSize: 22,
    fontWeight: "500",
  },
  subRoomPicPart: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
});

export default RoomCardHome;
