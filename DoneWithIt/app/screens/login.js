import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [text, setText] = useState("LOGIN");

  const handleSubmit = () => {
    if (username.length > 0 && password.length > 0) {
      setText(<ActivityIndicator color="#fff" size="large" />);
      fetch("http://eph.pythonanywhere.com/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })
        .then((resp) => resp.json())
        .then((res) => {
          setToken(token);
          if (res.token != undefined) {
            AsyncStorage.setItem("token", res.token);

            navigation.navigate("Home");
            setPassword("");
            setText("LOGIN");
          } else {
            setText("LOGIN");
            Alert.alert("warning!","Your credentials do not match");
          }
        })
        .catch((err) => console.log(err));
    } else {
      Alert.alert("warning!","Please fill in the form");
    }
  };
  useEffect(() => {
    AsyncStorage.getItem("token").then((value) => {
      if (value) {
        navigation.navigate("Home");
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Cigate</Text>
      <Text style={styles.logoText}>
        logistics <Icon name="tanker-truck" size={30} color="#fb5b5a" />{" "}
      </Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="phone Number..."
          placeholderTextColor="#003f5c"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
        <Text style={styles.loginText}>{text}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>Don't have an account? Signup</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEF7",
    alignItems: "center",
    justifyContent: "center",
  },
  inputView: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "#fb5b5a",
  },
  inputText: {
    height: 50,
    color: "#fb5b5a",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
  },
  logoText: {
    fontSize: 10,
    color: "#fb5b5a",
    marginBottom: 50,
  },
  forgot: {
    color: "#fb5b5a",
    fontSize: 11,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    color: "#fb5b5a",
    fontSize: 14,
    fontWeight: "bold",
  },
  warningText: {
    color: "red",
    fontSize: 10,
    fontWeight: "bold",
  },
});
