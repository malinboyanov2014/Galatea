import { Text } from "react-native";

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
  return <Text>Hello</Text>;
}
