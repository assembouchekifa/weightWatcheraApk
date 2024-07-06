import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { AntDesign, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [showModal, setShowModal] = useState(false);
  const [exoName, setExoName] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState<
    { exoName: string; weight: string; date: Date }[]
  >([]);
  const [serchData, setSerchData] = useState<
    {
      exoName: string;
      weight: string;
      date: Date;
    }[]
  >([]);

  const storeData = async (value: any) => {
    try {
      await AsyncStorage.setItem("data", value);
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("data");
      if (value !== null) {
        setData(JSON.parse(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setSerchData(data);
  }, [data]);

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FFF",
      }}
    >
      <TextInput
        style={{
          height: 40,
          minWidth: 140,
          fontSize: 20,
          padding: 10,
          borderBottomWidth: 1,
          marginTop: 30,
          marginHorizontal: 10,
        }}
        placeholder="Search by exercise name..."
        onChangeText={(e) => {
          const newD = data.filter((ele) => {
            return ele.exoName.startsWith(e);
          });
          setSerchData(newD);
        }}
      />
      <View
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          zIndex: 2,
        }}
      >
        <TouchableHighlight
          style={{ margin: 12, borderRadius: 10 }}
          onPress={() => {
            setShowModal(true);
          }}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#FFF",
              padding: 12,
              borderRadius: 10,
              borderColor: "#333333",
              borderWidth: 2,
            }}
          >
            <FontAwesome5 name="plus" size={24} color="black" />
          </View>
        </TouchableHighlight>
        <Modal visible={showModal} animationType="fade" transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FFF",
            }}
          >
            <TextInput
              style={{
                height: 40,
                minWidth: 140,
                margin: 12,
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                fontSize: 20,
              }}
              placeholder="Exercise name..."
              value={exoName}
              onChangeText={(e) => {
                setExoName(e);
              }}
            />
            <TextInput
              style={{
                height: 40,
                minWidth: 140,
                fontSize: 20,
                margin: 12,
                padding: 10,
                borderWidth: 1,
                borderRadius: 10,
              }}
              keyboardType="numeric"
              placeholder="weight...(Kg)"
              value={weight}
              onChangeText={(e) => {
                setWeight(e);
              }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  marginVertical: 20,
                }}
              >
                {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}{" "}
              </Text>
              <AntDesign
                name="calendar"
                size={30}
                color="black"
                onPress={() => {
                  DateTimePickerAndroid.open({
                    value: date,
                    onChange: (ev, selectedDate) => {
                      const currentDate = selectedDate;
                      if (currentDate) {
                        setDate(currentDate);
                      }
                    },
                    mode: "date",
                    is24Hour: true,
                  });
                }}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <View
                style={{
                  marginEnd: 20,
                }}
                onTouchStart={() => {
                  setShowModal(false);
                }}
              >
                <FontAwesome6 name="circle-xmark" size={40} color="red" />
              </View>

              <AntDesign
                name="pluscircleo"
                size={40}
                color="green"
                onPress={() => {
                  if (exoName == "" || weight == "") {
                    return;
                  }
                  storeData(
                    JSON.stringify([...data, { date, exoName, weight }])
                  );
                  setData([...data, { date, exoName, weight }]);
                  setShowModal(false);
                  setExoName("");
                  setWeight("");
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
      <View style={{ marginTop: 30 }}>
        <FlatList
          data={serchData}
          refreshing={true}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "#232D3F",
                    flexWrap: "wrap",
                    width: 100,
                  }}
                >
                  {item.exoName}
                </Text>
                <Text style={{ fontSize: 20, color: "#005B41" }}>
                  {item.weight} Kg
                </Text>
                <Text style={{ fontSize: 20, color: "#008170" }}>
                  {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}{" "}
                </Text>
                <AntDesign
                  name="delete"
                  size={30}
                  color="red"
                  onPress={() => {
                    Alert.alert(
                      "Delete",
                      "Are you sure you want to delete the item?",
                      [
                        {
                          text: "cancel",
                          onPress: () => {},
                        },
                        {
                          text: "ok",
                          onPress: () => {
                            const newData = [...data];
                            newData.splice(data.indexOf(item), 1);
                            storeData(JSON.stringify(newData));
                            setData(newData);
                          },
                        },
                      ]
                    );
                  }}
                />
              </View>
            );
          }}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  width: "90%",
                  borderColor: "#000",
                  borderTopWidth: 2,
                  marginVertical: 10,
                  alignSelf: "center",
                }}
              ></View>
            );
          }}
        />
      </View>
    </View>
  );
}
