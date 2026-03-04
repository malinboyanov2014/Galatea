import { View } from "react-native";
import Header from "./components/Header";
import Chat from "./components/Layout/Chat";

export const Explore = () => {

    return (<View className="flex-1">
        <Header />
        <Chat />
    </View>);
}