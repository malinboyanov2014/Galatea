import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function HomeScreen() {
  const data = fetch(
    "http://localhost:8080/api/worker/mboyanov@curativeai.com/feature_access",
    {
      headers: {
        "x-cai-as-user-id": "mboyanov@curativeai.com",
      },
    },
  );
  data.then(
    (x) => console.log(x),
    (e) => console.log(e),
  );
  return (
    <View style={{ margin: 8 }}>
      <Text>Hello</Text>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log("Pressed")}
      >
        Press me
      </Button>
    </View>
  );
}
