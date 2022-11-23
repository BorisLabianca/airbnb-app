import {
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
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
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("Room", { id: roomId })}
    >
      <Image
        source={{ uri: image }}
        style={styles.mainPic}
        resizeMode="cover"
      />
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>{price} €</Text>
      </View>
      <View style={styles.subRoomPicPart}>
        <View style={styles.titleNInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.stars}>
            {rating}
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
    top: 130,
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
    // borderRadius: "50%",
  },
});

export default RoomCardHome;
