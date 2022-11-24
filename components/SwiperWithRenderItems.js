import { Dimensions, Image, StyleSheet } from "react-native";
import SwiperFlatList from "react-native-swiper-flatlist";
const SwiperWithRenderItems = ({ roomData }) => {
  const photos = [];
  for (let i = 0; i < roomData.photos.length; i++) {
    photos.push(roomData.photos[i].url);
  }
  // console.log(photos);
  return (
    <SwiperFlatList
      autoplay
      autoplayDelay={3}
      autoplayLoop
      index={0}
      showPagination
      data={photos}
      renderItem={({ item }) => (
        <Image source={{ uri: item }} style={styles.child} />
      )}
    />
  );
};
const styles = StyleSheet.create({
  child: {
    width: Dimensions.get("window").width,
    height: 300,
    justifyContent: "center",
  },
});
export default SwiperWithRenderItems;
