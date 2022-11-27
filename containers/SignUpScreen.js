import { useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const SignUpScreen = ({ handleTokenAndUserId }) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState(false);

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
      }
    } else {
      alert("Permision refusée.");
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
      }
    } else {
      alert("Permission refusée.");
    }
  };

  const handleSubmit = async () => {
    try {
      setErrorMessage("");
      if (
        !username ||
        !email ||
        !description ||
        !password ||
        !passwordConfirmation
      ) {
        setErrorMessage("Veillez à remplir tous les champs.");
        return;
      }
      if (password !== passwordConfirmation) {
        setErrorMessage("Vos deux mots de passe doivent être identiques.");
        return;
      }

      setLoading(true);
      const response = await axios.post(
        "https://express-airbnb-api.herokuapp.com/user/sign_up",
        {
          email: email,
          username: username,
          description: description,
          password: password,
        }
      );

      // console.log(response.data.token);
      handleTokenAndUserId(response.data.token, response.data.id);
      setLoading(false);
      // alert("Vous êtes désormais inscrit.");
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.error === "This email already has an account.") {
        setErrorMessage("Cette adresse e-mail est déjà utilisée.");
        setLoading(false);
      }
      if (
        error.response.data.error === "This username already has an account."
      ) {
        setErrorMessage("Ce nom d'utilisateur est déjà utilisé.");
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView style={styles.main}>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <Image
            source={require("../assets/airbnb_logo.png")}
            style={styles.logo}
          />
          <Text>Sign up</Text>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="purple"
              style={{ marginTop: 200, position: "absolute" }}
            />
          ) : null}
          <TextInput
            placeholder="email"
            style={styles.input}
            value={email}
            autoCapitalize="none"
            onChangeText={(email) => {
              setEmail(email);
            }}
          ></TextInput>
          <TextInput
            placeholder="username"
            style={styles.input}
            value={username}
            autoCapitalize="none"
            onChangeText={(username) => {
              setUsername(username);
            }}
          ></TextInput>
          <TextInput
            placeholder="Describe yourself in a few words..."
            style={styles.description}
            multiline={true}
            textAlignVertical="top"
            value={description}
            onChangeText={(description) => {
              setDescription(description);
            }}
          ></TextInput>

          <TextInput
            placeholder="password"
            secureTextEntry={passwordVisible ? false : true}
            style={styles.input}
            value={password}
            autoCapitalize="none"
            onChangeText={(password) => {
              setPassword(password);
            }}
          ></TextInput>
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"}
            size={24}
            color="black"
            style={styles.eyeIcon}
            autoCapitalize="none"
            onPress={() => {
              setPasswordVisible(!passwordVisible);
            }}
          />
          <TextInput
            placeholder="password"
            secureTextEntry={passwordConfirmationVisible ? false : true}
            style={styles.input}
            value={passwordConfirmation}
            onChangeText={(passwordConfirmation) => {
              setPasswordConfirmation(passwordConfirmation);
            }}
          ></TextInput>
          <Ionicons
            name={passwordConfirmationVisible ? "eye-off" : "eye"}
            size={24}
            color="black"
            style={styles.eyeIcon2}
            onPress={() => {
              setPasswordConfirmationVisible(!passwordConfirmationVisible);
            }}
          />
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : (
            <Text style={styles.errorMessage}></Text>
          )}
          {loading ? (
            <TouchableOpacity
              style={styles.signupBtnDisactivated}
              disabled={true}
            >
              <Text style={styles.btnText}>Sign in</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.signupBtn}
              activeOpacity={0.7}
              onPress={handleSubmit}
            >
              <Text style={styles.btnText}>Sign up</Text>
            </TouchableOpacity>
          )}
          {loading ? (
            <TouchableOpacity disabled={true}>
              <Text>Already have an account? Sign in</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Sign In")}
            >
              <Text>Already have an account? Sign in</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  main: {
    backgroundColor: "white",
  },
  container: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 30,
    backgroundColor: "white",
    flex: 1,
    position: "relative",
  },
  logo: {
    height: 80,
    width: 80,
    marginBottom: 10,
  },
  input: {
    borderBottomColor: "#FFBAC0",
    borderBottomWidth: 2,
    width: "100%",
    paddingBottom: 10,
    marginBottom: 20,
    fontSize: 15,
  },
  description: {
    borderColor: "#FFBAC0",
    borderWidth: 2,
    width: "100%",
    height: 100,
    padding: 10,
    marginBottom: 40,
    marginTop: 10,
    fontSize: 15,
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
  eyeIcon: {
    position: "absolute",
    top: Platform.OS === "ios" ? 365 : 395,
    left: Platform.OS === "ios" ? 320 : 340,
  },
  eyeIcon2: {
    position: "absolute",
    top: Platform.OS === "ios" ? 415 : 455,
    left: Platform.OS === "ios" ? 320 : 340,
  },
  errorMessage: {
    height: 40,
    marginTop: 40,
    flex: 1,
    color: "red",
    fontSize: 12,
  },
  signupBtn: {
    borderColor: "#F9575C",
    borderWidth: 3,
    borderRadius: 50,
    height: 55,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  signupBtnDisactivated: {
    borderColor: "darkgrey",
    backgroundColor: "lightgrey",
    borderWidth: 3,
    borderRadius: 50,
    height: 55,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  btnText: {
    color: "#717171",
    fontSize: 16,
    fontWeight: "600",
  },
});
