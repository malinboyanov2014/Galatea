import { Text } from "react-native";

export default function HomeScreen() {
  const data = fetch(
    "https://http://localhost:8082/api/worker/mboyanov@curativeai.com/feature_access",
  );
  data.then(
    (x) => console.log(x),
    (e) => console.log(e),
  );
  return <Text>Hello</Text>;
}
