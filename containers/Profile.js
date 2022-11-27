import {
  Text,
  ScrollView,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = ({ handleTokenAndUserId, userId, token }) => {
  // console.log(token);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [pictureUpdated, setPictureUpdated] = useState(false);
  const [infoUpdated, setInfoUpdated] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const userInfo = await axios.get(
        `https://express-airbnb-api.herokuapp.com/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log(userInfo.data);
      if (userInfo.data?.photo?.url) {
        setAvatar(userInfo.data.photo.url);
      }
      setEmail(userInfo.data.email);
      setUsername(userInfo.data.username);
      if (userInfo.data.description) {
        setDescription(userInfo.data.description);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Une erreur s'est produite.");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const getPermissionAndGetPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (result.canceled === true) {
        alert("Pas de photo sélectionnée.");
      } else {
        setAvatar(result.assets[0].uri);
        setPictureUpdated(true);
      }
    } else {
      alert("Permission refusée.");
    }
  };

  const getPermissionAndTakePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      if (result.canceled === true) {
        alert("Pas de photo prise.");
      } else {
        setAvatar(result.assets[0].uri);
        setPictureUpdated(true);
      }
    } else {
      alert("Permission refusée.");
    }
  };

  const handleUpdate = async () => {
    if (pictureUpdated || infoUpdated) {
      setLoading(true);
      if (pictureUpdated) {
        try {
          const picArray = avatar.split(".");
          const formData = new FormData();
          formData.append("photo", {
            uri: avatar,
            name: `my-picture.${picArray[picArray.length - 1]}`,
            type: `image/${picArray[picArray.length - 1]}`,
          });
          const response = await axios.put(
            "https://express-airbnb-api.herokuapp.com/user/upload_picture",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (!response.data) {
            alert("Une erreur s'est produite, veuillez réessayer.");
          }
        } catch (error) {
          alert("Une erreur s'est produite, veuillez réessayer.");
        }
      }

      if (infoUpdated) {
        try {
          const response = await axios.put(
            "https://express-airbnb-api.herokuapp.com/user/update",
            { email: email, username: username, description: description },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (!response.data) {
            alert("Une erreur s'est produite, veuillez réessayer.");
          }
        } catch (error) {
          alert("Une erreur s'est produite, veuillez réessayer.");
        }
      }
      alert("Votre profile à été mis à jour.");
      setLoading(false);
      fetchUserInfo();
    } else {
      alert(
        "Vous devez faire des modifications pour pouvoir mettre à jour votre profile."
      );
    }
  };

  // console.log(description);
  return loading ? (
    <ActivityIndicator
      size="large"
      color="purple"
      style={{ marginTop: Dimensions.get("window").height / 2 - 50 }}
    />
  ) : (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      <View style={styles.photoRelated}>
        <View style={styles.avatarView}>
          <Image
            source={
              avatar
                ? { uri: avatar }
                : {
                    uri: "https://res.cloudinary.com/dbe27rnpk/image/upload/v1669388414/airbnb/avatar_filler_dwzvqu.png",
                  }
            }
            style={styles.avatar}
            resizeMode="contain"
          />
        </View>
        <View style={{ justifyContent: "space-evenly" }}>
          <TouchableOpacity onPress={getPermissionAndGetPicture}>
            <MaterialIcons name="photo-library" size={30} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity onPress={getPermissionAndTakePicture}>
            <MaterialIcons name="camera-alt" size={30} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        placeholder="Your email address"
        style={styles.input}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setInfoUpdated(true);
        }}
      ></TextInput>
      <TextInput
        placeholder="Your username"
        style={styles.input}
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setInfoUpdated(true);
        }}
      ></TextInput>
      <TextInput
        placeholder="Your description"
        style={styles.description}
        multiline={true}
        textAlignVertical="top"
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          setInfoUpdated(true);
        }}
      ></TextInput>
      <TouchableOpacity
        style={styles.updateBtn}
        activeOpacity={0.7}
        onPress={handleUpdate}
      >
        <Text style={styles.btnText}>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutBtn}
        activeOpacity={0.7}
        onPress={() => {
          handleTokenAndUserId(null, null);
        }}
      >
        <Text style={styles.logoutBtnText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: "white",
  },
  photoRelated: { flexDirection: "row", marginBottom: 50 },
  avatarView: {
    height: 150,
    width: 150,
    borderRadius: 150,
    borderColor: "#FFBAC0",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  avatar: {
    height: 135,
    width: 135,
    borderRadius: 150,
  },
  input: {
    borderBottomColor: "#FFBAC0",
    borderBottomWidth: 2,
    width: "100%",
    paddingBottom: 10,
    marginBottom: 40,
    fontSize: 15,
  },
  description: {
    borderColor: "#FFBAC0",
    borderWidth: 2,
    width: "100%",
    height: 85,
    padding: 10,
    marginBottom: 50,
    fontSize: 15,
  },
  updateBtn: {
    borderColor: "#F9575C",
    borderWidth: 3,
    borderRadius: 50,
    height: 55,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  btnText: {
    color: "#717171",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutBtn: {
    borderColor: "#F9575C",
    backgroundColor: "#F9575C",
    borderWidth: 3,
    borderRadius: 50,
    height: 55,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoutBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
