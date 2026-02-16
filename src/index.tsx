import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import GButton from "./common/GButton";

export const Home = () => {
  // const data = fetch(
  //   "http://localhost:8080/api/worker/mboyanov@curativeai.com/feature_access",
  //   {
  //     headers: {
  //       "x-cai-as-user-id": "mboyanov@curativeai.com",
  //     },
  //   },
  // );
  // data.then(
  //   (x) => console.log(x),
  //   (e) => console.log(e),
  // );

  return (
    <View style={{ margin: 8 }}>
      <Text className="text-lg font-bold text-red-800">Hello</Text>
      <GButton mode="outlined" onPress={() => console.log("Aha")}>
        Aha
      </GButton>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log("Pressed")}
      >
        Press me
      </Button>
    </View>
  );
};
