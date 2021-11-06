import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  CheckBox,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [station_name, setStation_name] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [text, setText] = useState("REGISTER");
  const [data, setData] = useState("");
  const [passcode, setPasscode] = useState(true);
  const [code, setCode] = useState("");
  const [user, setUser] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [isSelected, setSelection] = useState(false);

  const handleUserReg = () => {
    setText(<ActivityIndicator color="#fff" size="large" />);

    if (username && station_name) {
      if (username.length == 10) {
        if (password === confirmPassword) {
          if (isSelected === true) {
            if (user == 0) {
              fetch("http://eph.pythonanywhere.com/api/generate/", {
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
                  setData(res);
                })
                .catch((err) => console.log(err));

              setText("REGISTER");
              setPasscode(false);
            } else {
              Alert.alert("warning!", "Phone number is already registered");
            }
          } else {
            Alert.alert("Warning!", "Please agree to terms and conditions");
          }
        } else {
          Alert.alert("warning!", "passwords do not match");
        }
      } else {
        Alert.alert("warning!", "Invalid phone number");
      }
    } else {
      Alert.alert("warning!", "Please fill the form completely");
    }
  };

  const handleCode = () => {
    if (code.length == 4) {
      if (code == data) {
        fetch("http://eph.pythonanywhere.com/api/users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            station_name,
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
      } else {
        Alert.alert("passcode is incorrect");
      }
    } else {
      Alert.alert("Please fill the code");
    }
  };

  const uniqueUsername = () => {
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
  };

  useEffect(() => {
    uniqueUsername();
  }, [username]);

  useEffect(() => {
    if (!passcode) {
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
      setSeconds(30);
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Cigate</Text>
      <Text style={styles.logoText}>
        deliveries <Icon name="tanker-truck" size={30} color="#fb5b5a" />{" "}
      </Text>
      {passcode ? (
        <>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Business name..."
              placeholderTextColor="#003f5c"
              onChangeText={(text) => setStation_name(text)}
            />
          </View>
          {user == 1 ? (
            <Text style={styles.warningText}>
              <Icon name="hazard-lights" size={15} color="#000" />
              Phone number is already registered
            </Text>
          ) : (
            <></>
          )}
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="phone Number..."
              placeholderTextColor="#003f5c"
              onChangeText={(text) => setUsername(text)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Password..."
              placeholderTextColor="#003f5c"
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="confirm Password..."
              placeholderTextColor="#003f5c"
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              style={styles.checkbox}
            />
            <Text style={styles.label}>Agree to tems and conditions</Text>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleUserReg}>
            <Text style={styles.loginText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>{text}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.warningText}>Seconds remaining: {seconds}</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Auth passcode"
              placeholderTextColor="#003f5c"
              value={code}
              onChangeText={(text) => setCode(text)}
            />
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleCode}>
            <Text style={styles.loginText}>{text}</Text>
          </TouchableOpacity>
        </>
      )}
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
    borderWidth: 1,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
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
    marginBottom: 30,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
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
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 3,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});
