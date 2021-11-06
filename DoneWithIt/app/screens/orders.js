import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Orders = ({ navigation }) => {
  const [town, setTown] = useState("");
  const [litres, setLitres] = useState("");
  const [fuel, setFuel] = useState("");
  const [county, setCounty] = useState("");
  const [sent, setSent] = useState(true);
  const [okay, setOkay] = useState(false);
  const [response, setResponse] = useState([]);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState();

  const handleOrders = () => {
    if (
      litres.length > 0 &&
      town.length > 0 &&
      county.length > 0 &&
      fuel.length > 0
    ) {
      AsyncStorage.getItem("token").then((value) => {
        if (value && value.length > 0) {
          setLoading(true);
          fetch("http://eph.pythonanywhere.com/api/order/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${value}`,
            },
            body: JSON.stringify({
              litres,
              county,
              market: town,
              fuel,
              user1: 1,
              company: 1,
            }),
          })
            .then((resp) => resp.json())
            .then((res) => {
              setResponse(res.id), setSent(false);
            })
            .catch((err) => console.log(err));
        }
      });
    } else {
      Alert.alert("Warning!", "Please fill the form completely");
    }
  };

  useEffect(() => {
    const aborting = new AbortController();
    AsyncStorage.getItem("token").then((value) => {
      if (value && value.length > 0) {
        fetch("http://eph.pythonanywhere.com/api/analytics/", {
          signal: aborting.signal,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${value}`,
          },
        })
          .then((resp) => {
            resp.json();
          })
          .then((res) => {
            setLoading(false);
            setOrder(res);
          })
          .catch((err) => {
            if (err.name === "AbortError") {
              null;
            } else {
              console.log(err);
            }
          });
      }
    });
    return () => {
      aborting.abort();
    };
  }, [order, response]);

  const cancelOrder = () => {
    AsyncStorage.getItem("token").then((value) => {
      if (value && value.length > 0) {
        const url = `http://eph.pythonanywhere.com/api/${response}/`;

        fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${value}`,
          },
        })
          .then((resp) => resp.text())
          .then((res) => console.log(res))
          .catch((err) => console.log(err));

        Alert.alert("Note", "successfully cancelled");
        setSent(true);
        setLitres("");
        setTown("");
      }
    });
  };

  const AnotherOrder = () => {
    setSent(true);
    setLitres("");
  };

  return (
    <SafeAreaView>
      {loading ? (
        <ActivityIndicator size="large" color="fb5b5a" />
      ) : (
        <>
          {sent ? (
            <View>
              <View style={styles.button1View}>
                <Text style={styles.currentText}>
                  Enter the amount of litres you want delivered to you*
                </Text>

                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputText}
                    placeholder="Amount of litres"
                    placeholderTextColor="#003f5c"
                    value={litres}
                    onChangeText={(text) => setLitres(text)}
                  />
                </View>

                <Text style={styles.currentText}>
                  Enter the nearest market/town to your petrol station*
                </Text>
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputText}
                    placeholder="Nearest town/market"
                    placeholderTextColor="#003f5c"
                    value={town}
                    onChangeText={(text) => setTown(text)}
                  />
                </View>

                <Text style={styles.currentText}>
                  Select type of fuel you want delivered*
                </Text>
                <Picker
                  selectedValue={fuel}
                  style={{ height: 40, width: 220 }}
                  onValueChange={(itemValue, itemIndex) => setFuel(itemValue)}
                >
                  <Picker.Item label="Select type of fuel" value="" />
                  <Picker.Item label="Petrol" value="Petrol" />
                  <Picker.Item label="Diesel" value="Diesel" />
                  <Picker.Item label="Kerosene" value="Kerosene" />
                </Picker>
                <View
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    width: "80%",
                  }}
                />

                <Text style={styles.currentText}>
                  Select your county of busines*
                </Text>
                <Picker
                  selectedValue={county}
                  style={{ height: 40, width: 270 }}
                  onValueChange={(itemValue, itemIndex) => setCounty(itemValue)}
                >
                  <Picker.Item label="Select county of business" value="" />
                  <Picker.Item label="Nyamira" value="Nyamira" />
                  <Picker.Item label="Kisii" value="Kisii" />
                  <Picker.Item label="Homa Bay" value="Homa Bay" />
                  <Picker.Item label="Migori" value="Migori" />
                  <Picker.Item label="Kisumu" value="Kisumu" />
                  <Picker.Item label="siaya" value="siaya" />
                </Picker>

                <View
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    width: "80%",
                  }}
                />

                <TouchableOpacity style={styles.button1} onPress={handleOrders}>
                  <Text style={styles.button1Text}>Place your order</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {okay ? (
                <></>
              ) : (
                <View style={styles.infoView}>
                  <View style={styles.button1View}>
                    <Icon name="hazard-lights" size={15} color="#000" />
                  </View>
                  <Text style={styles.searchingText}>
                    Order has been placed. Once a supplier at pipeline picks
                    your order we will notify you through sms and also in the
                    app then your order will be delivered within 24 hours.Order
                    number #{response}
                  </Text>
                  <View style={styles.head}>
                    <TouchableOpacity onPress={AnotherOrder}>
                      <Text style={styles.registerText}>
                        Place another order?
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={cancelOrder}>
                      <Text style={styles.registerText}>Cancel order?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setOkay(true)}>
                      <Text style={styles.registerText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
};
export default Orders;

const styles = StyleSheet.create({
  head: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#FFFEF7",
  },
  container: {
    flex: 2,
    paddingTop: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  head: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  logo: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#fb5b5a",
  },
  logoText: {
    fontSize: 10,
    color: "#fb5b5a",
    marginBottom: 1,
  },
  regArea: {
    backgroundColor: "#003f5c",
    marginLeft: 10,
    marginRight: 10,
  },
  regText: {
    fontWeight: "700",
    color: "#fff",
    padding: 20,
  },
  liveText: {
    fontWeight: "700",
    padding: 10,
    color: "#fb5b5a",
  },
  liveText2: {
    fontWeight: "700",
    padding: 2,
    color: "#000",
  },
  liveText3: {
    fontWeight: "700",
    padding: 2,
    color: "#fb5b5a",
    textAlign: "center",
  },
  live: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
  },
  data2: {
    padding: 5,
  },
  button1: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  button1Text: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  button1View: {
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    height: 50,
    color: "#000",
  },
  inputView: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 5,
    height: 50,
    marginBottom: 10,
    justifyContent: "center",
    padding: 10,
    borderColor: "black",
    borderWidth: 1,
  },
  numberArea: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  numberText: {
    color: "#fb5b5a",
    fontSize: 40,
    fontWeight: "bold",
  },
  currentText: {
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  searchingText: {
    padding: 15,
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  registerText: {
    color: "#fb5b5a",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoView: {
    backgroundColor: "yellow",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
});
