import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Analytics from "./analytics";
import Orders from "./orders";

const Home = ({ navigation }) => {
  const [datas, setDatas] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [veh, setVeh] = useState([]);
  const [open, setOpen] = useState(false);
  const [ordr, setOrdr] = useState([]);
  const [analyse, setAnalyse] = useState(false);
  const [coloor, setColoor] = useState("#fb5b5a");
  const [color1, setColor1] = useState("blue");
  const [live, setLive] = useState([]);
  const [cnfmd, setcnfmd] = useState([]);
  const [order, setOrder] = useState([]);
  const [load, setLoad] = useState(false);
  const [statistics, setStatistics] = useState([]);

  const logoutBtn = () => {
    AsyncStorage.removeItem("token").catch((err) => console.log(err));
    navigation.navigate("Login");
  };

  useEffect(() => {
    AsyncStorage.getItem("token").then((value) => {
      if (value && value.length > 0) {
        fetch("http://eph.pythonanywhere.com/api/vehicles/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${value}`,
          },
        })
          .then((resp) => resp.json())
          .then((resp) => setDatas(resp))
          .catch((error) => console.log(error));

        fetch("http://eph.pythonanywhere.com/api/live/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${value}`,
          },
        })
          .then((resp) => resp.json())
          .then((resp) => {
            setLive(resp);
            if (resp.length > 0) {
              setIsEnabled(true);
            }
          })
          .catch((error) => console.log(error));

        fetch("http://eph.pythonanywhere.com/api/alllive/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${value}`,
          },
        })
          .then((resp) => resp.json())
          .then((resp) => {
            setVeh(resp);
            setOpen(true);
          })
          .catch((error) => console.log(error));
      }
    });
  }, []);

  useEffect(() => {
    const aborting = new AbortController();
    AsyncStorage.getItem("token").then((value) => {
      if (value && value.length > 0) {
        fetch("http://eph.pythonanywhere.com/api/algo/", {
          signal: aborting.signal,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${value}`,
          },
        })
          .then((resp) => resp.json())
          .then((resp) => {
            setOrdr(resp);
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
  }, [live, cnfmd, ordr]);

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
          .then((resp) => resp.json())
          .then((res) => {
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
  }, [order, analyse]);

  useEffect(() => {
    const aborting = new AbortController();
    AsyncStorage.getItem("token").then((value) => {
      if (value && value.length > 0) {
        fetch("http://eph.pythonanywhere.com/api/stats/", {
          signal: aborting.signal,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${value}`,
          },
        })
          .then((resp) => resp.json())
          .then((res) => {
            setStatistics(res);
            setOpen(true);
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
  }, [statistics, order]);

  const renderData = (item) => {
    return <Text style={styles.liveText2}>{item.reg_no}</Text>;
  };

  const renderData1 = (item) => {
    return (
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={() => toggleSwitch(item.id)}
        value={isEnabled}
      />
    );
  };

  const renderData2 = (item) => {
    return (
      <View style={styles.data2}>
        <Icon name="tanker-truck" size={30} color="#000" />
      </View>
    );
  };

  const renderData3 = (item) => {
    return (
      <View style={styles.dataView}>
        <Text style={styles.formText}>
          Litres: <Text style={styles.formText1}>{item.litres}</Text>
        </Text>
        <Text style={styles.formText}>
          Delivery county: <Text style={styles.formText1}>{item.county}</Text>{" "}
        </Text>
        <Text style={styles.formText}>
          Delivery market:
          <Text style={styles.formText1}>{item.market}</Text>{" "}
        </Text>
        <Text style={styles.formText}>
          Fuel type: <Text style={styles.formText1}> {item.fuel}</Text>
        </Text>
        <Button
          title="I Confirm"
          color="#fb5b5a"
          onPress={() => Confirmed(item.id)}
        />
      </View>
    );
  };

  const toggleSwitch = (id) => {
    setIsEnabled((previousState) => !previousState);

    AsyncStorage.getItem("token").then((value) => {
      if (value.length > 0) {
        if (isEnabled == false) {
          fetch("http://eph.pythonanywhere.com/api/live/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${value}`,
            },
            body: JSON.stringify({
              reg_no: id,
            }),
          })
            .then((resp) => resp.json())
            .then((res) => {
              setLive(res);

              console.log(res);
              Alert.alert(
                "Note",
                "Your vehicle shall be active for a maximum of 2 hours."
              );
            })
            .catch((err) => {
              console.log("error");
            });
        } else {
          fetch("http://eph.pythonanywhere.com/api/live/delete/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${value}`,
            },
            body: JSON.stringify({
              id,
            }),
          })
            .then((resp) => resp.json())
            .then((res) => console.log(res))
            .catch((err) => {
              console.log("errp1");
            });
        }
      }
    });
  };

  const Confirmed = (id) => {
    setLoad(true);
    AsyncStorage.getItem("token").then((value) => {
      if (value.length > 0) {
        fetch("http://eph.pythonanywhere.com/api/confirmed/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${value}`,
          },
          body: JSON.stringify({
            order: id,
            user1: 1,
            company: 1,
          }),
        })
          .then((resp) => resp.json())
          .then((res) => {
            setcnfmd(res);
            setTimeout(() => {
              setLoad(false);
              setAnalyse(true);
              setColoor("blue");
              setColor1("#fb5b5a");
            }, 3000);
          })
          .catch((err) => console.log(err));
      }
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.lve}>
        <View style={styles.head}>
          <TouchableOpacity
            onPress={() => {
              setAnalyse(false);
              setColor1("blue");
              setColoor("#fb5b5a");
              setLoad(false);
            }}
          >
            <Icon name="home" size={30} color={color1} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              open
                ? (setAnalyse(true), setColoor("blue"), setColor1("#fb5b5a"))
                : null;
            }}
          >
            <Icon name="google-analytics" size={30} color={coloor} />
          </TouchableOpacity>

          <TouchableOpacity onPress={logoutBtn}>
            <Icon name="logout" size={30} color="#fb5b5a" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
          }}
        />

        {analyse ? (
          <Analytics dat={order} dat1={statistics} />
        ) : (
          <View>
            {open ? (
              <View>
                {datas.length > 0 ? (
                  <View>
                    <View style={styles.live}>
                      <View>
                        <Text style={styles.liveText}>Vehicle</Text>
                        <FlatList
                          data={datas}
                          renderItem={({ item }) => {
                            return renderData(item);
                          }}
                          keyExtractor={(item) => `${item.id}`}
                        />
                      </View>
                      <View>
                        <Text style={styles.liveText}>
                          currently at Pipeline??
                        </Text>
                        <FlatList
                          data={datas}
                          renderItem={({ item }) => {
                            return renderData1(item);
                          }}
                          keyExtractor={(item) => `${item.id}`}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.button1View}
                      onPress={() => {
                        setAnalyse(true);
                        setColoor("blue");
                        setColor1("#fb5b5a");
                      }}
                    >
                      <Text style={styles.registerText}>
                        View orders to deliver
                      </Text>
                    </TouchableOpacity>

                    {isEnabled ? (
                      <View style={styles.container}>
                        {!load ? (
                          <>
                            <Text style={styles.liveText3}>Current Orders</Text>
                            {ordr &&
                            ordr.length > 0 &&
                            order[1] &&
                            order[1].length < 2 ? (
                              <FlatList
                                data={ordr}
                                horizontal
                                renderItem={({ item }) => {
                                  return renderData3(item);
                                }}
                                keyExtractor={(item) => `${item.id}`}
                              />
                            ) : order[1] && order[1].length == 2 ? (
                              <Text style={{ fontWeight: "bold" }}>
                                <Icon
                                  name="lock-alert"
                                  size={30}
                                  color="#000"
                                />
                                Orders locked.Please deliver the orders you have
                                first.
                              </Text>
                            ) : (
                              <Text style={{ fontWeight: "bold" }}>
                                0 current orders in your route
                              </Text>
                            )}
                          </>
                        ) : (
                          <ActivityIndicator size="large" color="fb5b5a" />
                        )}
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                ) : (
                  <View>
                    <Text style={styles.currentText} >
                      Do you own a petroleum tanker? Please call 0741849995 to
                      partner with us
                    </Text>
                    <Text style={styles.liveText3}>
                      {veh.length} Vehicles currently at Pipeline
                    </Text>

                    <FlatList
                      data={veh}
                      horizontal
                      renderItem={({ item }) => {
                        return renderData2(item);
                      }}
                      keyExtractor={(item) => `${item.id}`}
                    />
                    <Orders />
                    <TouchableOpacity
                      style={styles.button1View}
                      onPress={() => {
                        setAnalyse(true);
                        setColoor("blue");
                        setColor1("#fb5b5a");
                      }}
                    >
                      <Text style={styles.registerText}>View your orders</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <ActivityIndicator size="large" color="fb5b5a" />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default Home;

const styles = StyleSheet.create({
  head: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#FFFEF7",
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
    padding: 15,
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
    width: "60%",
    backgroundColor: "#fb5b5a",
    borderRadius: 5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  dataView: {
    padding: 5,
    backgroundColor: "#FFF",
    paddingHorizontal: 40,
    paddingVertical: 5,
  },
  formText: {
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
  formText1: {
    color: "#fb5b5a",
  },
  formHead: {
    fontWeight: "bold",
    fontSize: 16,
    padding: 5,
    color: "#fb5b5a",
  },
  lve: {
    backgroundColor: "#FFFEF7",
  },
  registerText: {
    color: "#fb5b5a",
    fontSize: 14,
    fontWeight: "bold",
  },
  currentText: {
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
});
