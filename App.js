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
  const [userId, setUserId] = useState(null);
  function LogoTitle() {
    return (
      <Image
        style={{ width: 30, height: 30 }}
        source={require("./assets/airbnb_logo.png")}
      />
    );
  }
  const handleTokenAndUserId = async (token, userId) => {
    if (token && userId) {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userId", userId);
    } else {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
    }
    setToken(token);
    setUserId(userId);
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      setToken(token);
      setUserId(userId);
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
              {() => (
                <SignInScreen handleTokenAndUserId={handleTokenAndUserId} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Sign Up">
              {() => (
                <SignUpScreen handleTokenAndUserId={handleTokenAndUserId} />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="TabNav" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  tabBarActiveTintColor: "#F9575C",
                  tabBarInactiveTintColor: "gray",
                }}
              >
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
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Around me"
                        component={AroundMe}
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
                  name="TabProfile"
                  options={{
                    tabBarLabel: "My profile",
                    tabBarIcon: ({ color, size }) => (
                      <Octicons name={"person"} size={size} color={color} />
                    ),
                    headerTitle: (props) => <LogoTitle {...props} />,
                    headerTitleAlign: "center",
                  }}
                >
                  {() => (
                    <Profile
                      handleTokenAndUserId={handleTokenAndUserId}
                      userId={userId}
                      token={token}
                    />
                  )}
                </Tab.Screen>
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
