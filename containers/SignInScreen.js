import { useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async () => {
    try {
      setErrorMessage("");
      if (!email || !password) {
        setErrorMessage("Please fill all fileds");
        return;
      }
      setLoading(true);
      const response = await axios.post(
        "https://express-airbnb-api.herokuapp.com/user/log_in",
        {
          email: email,
          password: password,
        }
      );

      console.log(response);
      setLoading(false);
      alert("Vous êtes connecté.");
    } catch (error) {
      console.log(error.message);
      if (error.message === "Request failed with status code 401") {
        setErrorMessage("Mauvaise combinaison mot de passe / adresse e-mail");
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.main}>
      <View style={styles.container}>
        <Image
          source={require("../assets/airbnb_logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Sign in</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="purple"
            style={{ marginTop: 200, position: "absolute" }}
          />
        ) : null}
        <TextInput
          placeholder="email"
          textContentType="emailAddress"
          style={styles.input}
          onChangeText={(email) => {
            setEmail(email);
          }}
        ></TextInput>
        <TextInput
          placeholder="password"
          textContentType="password"
          secureTextEntry={passwordVisible ? false : true}
          style={styles.input}
          onChangeText={(password) => {
            setPassword(password);
          }}
        ></TextInput>
        <Ionicons
          name={passwordVisible ? "eye-off" : "eye"}
          size={24}
          color="black"
          style={styles.eyeIcon}
          onPress={() => {
            setPasswordVisible(!passwordVisible);
          }}
        />
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : (
          <Text style={styles.errorMessage}></Text>
        )}
        {loading ? (
          <TouchableOpacity
            style={styles.signInBtnDisactivated}
            disabled={true}
          >
            <Text>Sign in</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.signInBtn} onPress={handleSubmit}>
            <Text>Sign in</Text>
          </TouchableOpacity>
        )}
        {loading ? (
          <TouchableOpacity disabled={true}>
            <Text>No account? Register</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("Sign Up")}>
            <Text>No account? Register</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  main: {
    backgroundColor: "white",
  },
  container: {
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 30,
    backgroundColor: "white",
    flex: 1,
    position: "relative",
  },
  logo: {
    height: 80,
    width: 80,
  },
  title: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: "600",
    color: "#717171",
    marginBottom: 80,
  },
  input: {
    borderBottomColor: "#FFBAC0",
    borderBottomWidth: 2,
    width: "100%",
    paddingBottom: 10,
    marginBottom: 40,
    fontSize: 15,
  },
  eyeIcon: {
    position: "absolute",
    top: Platform.OS === "ios" ? 335 : 355,
    left: Platform.OS === "ios" ? 320 : 340,
  },
  errorMessage: {
    height: 40,
    marginTop: 40,
    flex: 1,
    color: "red",
    fontSize: 12,
  },
  signInBtn: {
    borderColor: "#F9575C",
    borderWidth: 3,
    borderRadius: 50,
    height: 55,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  signInBtnDisactivated: {
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
});

export default SignInScreen;