import "react-native-gesture-handler";
import React from "react";
import { Login } from "./app/screens/login";
import { Register } from "./app/screens/register";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./app/screens/home";
import Orders from "./app/screens/orders";

import ForgotPassword from "./app/screens/forgotpassword";

const Stack = createStackNavigator();

export default function App() {
  console;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: "Welcome",
            headerStyle: {
              backgroundColor: "#FFFEF7",
            },
            headerTintColor: "#fb5b5a",
            headerTitleStyle: {
              fontWeight: "bold",
              textAlign: "center",
            },
            headerLeft: () => {
              return null;
            },
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            title: "Register",
            headerStyle: {
              backgroundColor: "#FFFEF7",
            },
            headerTintColor: "#fb5b5a",
            headerTitleStyle: {
              fontWeight: "bold",
              textAlign: "center",
            },
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Cigate",
            headerStyle: {
              backgroundColor: "#FFFEF7",
            },
            headerTintColor: "#fb5b5a",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 30,
              paddingLeft: 10,
            },
            headerLeft: () => {
              return null;
            },
          }}
        />

        <Stack.Screen
          name="Orders"
          options={{
            title: "Order",
            headerStyle: {
              backgroundColor: "#FFFEF7",
            },
            headerTintColor: "#fb5b5a",
            headerTitleStyle: {
              fontWeight: "bold",
              textAlign: "center",
            },
          }}
          component={Orders}
        />
        <Stack.Screen
          name="ForgotPassword"
          options={{
            title: "Forgot password",
            headerStyle: {
              backgroundColor: "#FFFEF7",
            },
            headerTintColor: "#fb5b5a",
            headerTitleStyle: {
              fontWeight: "bold",
              textAlign: "center",
            },
          }}
          component={ForgotPassword}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
