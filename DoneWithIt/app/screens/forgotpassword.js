import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const ForgotPassword = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState("");
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [love, setLove] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState("");
  const [seconds, setSeconds] = useState(30);

  const handleSubmit = ({ navigation }) => {
    fetch("http://eph.pythonanywhere.com/api/reset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        setPasscode(res);
        console.log(res);
      })
      .catch((err) => console.log(err));
    setOpen(true);
  };

  const handleConfirm = () => {
    if (password == confirmPassword) {
      fetch("http://eph.pythonanywhere.com/api/password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          station_name: "citygate",
          username,
          password,
        }),
      })
        .then((resp) => resp.json())
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
      navigation.navigate("Login");
    }
  };

  useEffect(() => {
    if (username.length == 10) {
      fetch("http://eph.pythonanywhere.com/api/username/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
        }),
      })
        .then((resp) => resp.json())
        .then((res) => {
          setUser(res), console.log(res);
        })
        .catch((err) => console.log(err));
    }
  }, [username]);

  useEffect(() => {
    if (code.length == 4) {
      if (code == passcode) {
        setLove(true);
      } else {
        Alert.alert("Incorrect passcode");
      }
    }
  }, [code]);

  useEffect(() => {
    if (open == true) {
      if (love == false) {
        if (seconds > 0) {
          const timer = () => setTimeout(() => setSeconds(seconds - 1), 1000);
          const timerId = timer();
          return () => {
            clearTimeout(timerId);
          };
        } else {
          setSeconds("BOOOOM!");
        }
      } else {
        setSeconds(0);
      }
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Cigate</Text>
      <Text style={styles.logoText}>
        deliveries <Icon name="tanker-truck" size={30} color="#fb5b5a" />{" "}
      </Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="phone Number..."
          placeholderTextColor="#003f5c"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
          }}
        />
      </View>
      {open ? (
        <>
          <Text style={styles.warningText}>Seconds remaining: {seconds}</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Enter passcode sent to the number"
              placeholderTextColor="#003f5c"
              value={code}
              onChangeText={(text) => {
                setCode(text);
              }}
            />
          </View>
        </>
      ) : user == 1 ? (
        <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
          <Text style={styles.loginText}>SUBMIT</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}

      {love ? (
        <>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="New password..."
              placeholderTextColor="#003f5c"
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="confirm new Password..."
              placeholderTextColor="#003f5c"
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleConfirm}>
            <Text style={styles.loginText}>CONFIRM</Text>
          </TouchableOpacity>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export default ForgotPassword;

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
  warningText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
  },
});
