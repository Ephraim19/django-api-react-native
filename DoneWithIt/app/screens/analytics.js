import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-community/async-storage";

const Analytics = (props) => {
  const [load, setLoad] = useState(false);
  const renderData = (item) => {
    return (
      <Text style={styles.numberText}>
        {" "}
        <Icon name="hazard-lights" size={15} color="#000" /> Order number #
        {item.id}
      </Text>
    );
  };

  const renderData1 = (item) => {
    return (
      <View>
        <Text style={styles.numberText}>
          {" "}
          <Icon name="hazard-lights" size={15} color="#000" /> Order number #
          {item.id}
        </Text>
        <Text style={styles.numberText}>
          {" "}
          Fuel:
          {item.fuel}{" "}
        </Text>
        <Text style={styles.numberText}>
          {" "}
          Litres:
          {item.litres}{" "}
        </Text>
        <Text style={styles.numberText}>
          {" "}
          County:
          {item.county}{" "}
        </Text>
        <Text style={styles.numberText}>
          {" "}
          market:
          {item.market}{" "}
        </Text>
        <Text style={styles.numberText}>
          {" "}
          Company:
          {item.company}{" "}
        </Text>
        <Text style={styles.numberText}>
          {" "}
          <Icon name="phone" size={15} color="#000" />
          Contact:
          {item.user1}{" "}
        </Text>
        <Text style={styles.currentText}>
          {" "}
          Contact the {item.company} to arrange for payment{" "}
        </Text>
        <Text style={styles.currentText1}>
          {" "}
          <Icon name="hazard-lights" size={15} color="#FF0000" /> Order must be
          delivered within 24 hours*
        </Text>
        <View style={styles.button1View}>
          <Button
            title="I have delivered"
            color="#fb5b5a"
            onPress={() => handleDelivered(item.id)}
          />
        </View>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
            width: "100%",
          }}
        />
      </View>
    );
  };

  const handleDelivered = (id) => {
    setLoad(true);
    AsyncStorage.getItem("token").then((value) => {
      if (value && value.length > 0) {
        const url = `http://eph.pythonanywhere.com/api/delivered/${id}/`;

        fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${value}`,
          },
          body: JSON.stringify({
            delivered: true,
          }),
        })
          .then((resp) => resp.text())
          .then((res) => {
            setTimeout(() => {
              setLoad(false);
            }, 3000);
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const renderData2 = (item) => {
    return (
      <Text style={styles.numberText}>
        {" "}
        <Icon name="hazard-lights" size={15} color="#000" /> Order number #
        {item.order} will be delivered by {item.company} of contact:{" "}
        {item.user1}
      </Text>
    );
  };

  return (
    <View>
      {!load ? (
        <View>
          {props.dat[0].length > 0 || props.dat[2].length > 0 ? (
            <View style={styles.container}>
              <Text style={styles.currentText}>Current orders</Text>
              {props.dat[0].length > 0 ? (
                <FlatList
                  data={props.dat[0]}
                  renderItem={({ item }) => {
                    return renderData(item);
                  }}
                  keyExtractor={(item) => `${item.id}`}
                />
              ) : (
                <Text style={styles.numberText}>0 current orders</Text>
              )}
              <Text style={styles.currentText}>
                Confirmed but undelivered orders
              </Text>
              {props.dat[2].length > 0 ? (
                <FlatList
                  data={props.dat[2]}
                  renderItem={({ item }) => {
                    return renderData2(item);
                  }}
                  keyExtractor={(item) => `${item.id}`}
                />
              ) : (
                <Text style={styles.numberText}>0 undelivered orders</Text>
              )}
            </View>
          ) : props.dat[1].length > 0 ? (
            <View>
              <Text style={styles.currentText}>
                {" "}
                Orders you need to deliver{" "}
              </Text>

              {props.dat[1].length > 0 ? (
                <>
                  <FlatList
                    data={props.dat[1]}
                    vertical
                    renderItem={({ item }) => {
                      return renderData1(item);
                    }}
                    keyExtractor={(item) => `${item.id}`}
                  />
                </>
              ) : (
                <Text style={styles.numberText}>
                  0 orders you need to deliver
                </Text>
              )}
            </View>
          ) : (
            <>
              <Text style={styles.currentText}>
                Please make/receive orders to view them here
              </Text>
              {props.dat1[0] && props.dat1[0].length > 0 ? (
                <>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: 5,
                    }}
                  >
                    {props.dat1[0].length} total orders made
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: 5,
                    }}
                  >
                    {props.dat1[0].length} total orders delivered to you
                  </Text>
                </>
              ) : (
                <></>
              )}
              {props.dat1[1] && props.dat1[1].length > 0 ? (
                <>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: 5,
                    }}
                  >
                    {props.dat1[1].length} total deliveries made
                  </Text>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </View>
      ) : (
        <ActivityIndicator size="large" color="fb5b5a" />
      )}
    </View>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFEF7",
    alignItems: "center",
    justifyContent: "center",
  },
  currentText: {
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
    color: "#fb5b5a",
    textAlign: "center",
  },
  currentText1: {
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF0000",
    textAlign: "center",
  },
  numberText: {
    padding: 2,
    fontSize: 12,
    fontWeight: "bold",
  },
  live: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
  },
  button1View: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
});
