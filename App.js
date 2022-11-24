import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, Dimensions, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Octicons } from "@expo/vector-icons";
import SignUpScreen from "./containers/SignUpScreen";
import SignInScreen from "./containers/SignInScreen";
import HomeScreen from "./containers/HomeScreen";
import RoomScreen from "./containers/RoomScreen";
import AroundMe from "./containers/AroundMe";
import Profile from "./containers/Profile";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  function LogoTitle() {
    return (
      <Image
        style={{ width: 30, height: 30 }}
        source={require("./assets/airbnb_logo.png")}
      />
    );
  }
  const handleToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("token", token);
    } else {
      await AsyncStorage.removeItem("token");
    }
    setToken(token);
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      const token = await AsyncStorage.getItem("token");
      setToken(token);
      setLoading(false);
    };
    bootstrapAsync();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="purple"
        style={{ marginTop: Dimensions.get("window").height / 2 }}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <>
            <Stack.Screen name="Sign In">
              {() => <SignInScreen handleToken={handleToken} />}
            </Stack.Screen>
            <Stack.Screen name="Sign Up">
              {() => <SignUpScreen handleToken={handleToken} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="TabNav" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator>
                <Tab.Screen
                  name="TabHome"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                    headerTitle: (props) => <LogoTitle {...props} />,
                    headerTitleAlign: "center",
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                          headerShown: false,
                        }}
                      />

                      <Stack.Screen
                        name="Room"
                        component={RoomScreen}
                        options={{
                          title: "Room",
                        }}
                      />
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="TabAroundMe"
                  component={AroundMe}
                  options={{
                    tabBarLabel: "Around me",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"ios-location-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                    headerTitle: (props) => <LogoTitle {...props} />,
                    headerTitleAlign: "center",
                  }}
                />

                <Tab.Screen
                  name="TabProfile"
                  component={Profile}
                  options={{
                    tabBarLabel: "My profile",
                    tabBarIcon: ({ color, size }) => (
                      <Octicons name={"person"} size={size} color={color} />
                    ),
                    headerTitle: (props) => <LogoTitle {...props} />,
                    headerTitleAlign: "center",
                  }}
                />
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
