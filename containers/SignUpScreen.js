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
import axios from "axios";

const SignUpScreen = ({ setToken }) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState(false);

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

      console.log(response.data.token);
      setToken(response.data.token);
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
            textContentType="emailAddress"
            style={styles.input}
            value={email}
            autoCapitalize="none"
            onChangeText={(email) => {
              setEmail(email);
            }}
          ></TextInput>
          <TextInput
            placeholder="username"
            textContentType="username"
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
            value={description}
            onChangeText={(description) => {
              setDescription(description);
            }}
          ></TextInput>
          <TextInput
            placeholder="password"
            textContentType="password"
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
            textContentType="password"
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
              <Text>Sign in</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.signupBtn} onPress={handleSubmit}>
              <Text>Sign up</Text>
            </TouchableOpacity>
          )}
          {loading ? (
            <TouchableOpacity disabled={true}>
              <Text>Already have an account? Sign in</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate("Sign In")}>
              <Text>Already have an account? Sign in</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

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
    paddingBottom: 10,
    marginBottom: 20,
    fontSize: 15,
  },
  eyeIcon: {
    position: "absolute",
    top: Platform.OS === "ios" ? 325 : 355,
    left: Platform.OS === "ios" ? 320 : 340,
  },
  eyeIcon2: {
    position: "absolute",
    top: Platform.OS === "ios" ? 375 : 415,
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
});
export default SignUpScreen;
