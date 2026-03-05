import { View } from "react-native";
import { STRIP_WIDTH } from "./components/DrawerPanel";
import Header from "./components/Header";
import Chat from "./components/Layout/Chat";
import Messages from "./components/Messages";

export const Explore = () => {

    return (<View className="flex-1">
        <Header />
        <Chat>
            <Messages messages={[{ id: '1', content: 'Hi', sender: 'user' }, { id: '2', content: 'How kan I help?', sender: 'bot' }]} style={{
                marginRight: STRIP_WIDTH
            }} />
        </Chat>
    </View>);
}