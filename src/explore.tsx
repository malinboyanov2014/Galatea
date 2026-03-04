import { View } from "react-native";
import GSwitch from "./common/GSwitch";
import GText from "./common/GText";
import GView from "./common/GView";
import Chat from "./components/Layout/Chat";
import { useTheme } from "./components/PaperTheme";

export const Explore = () => {
    const { isDark, toggleTheme } = useTheme();

    return (<View className="flex-1">
        <GView className="flex-row items-center justify-between p-4">
            <GText className="text-lg font-bold">Mode</GText>
            <GSwitch value={isDark} onValueChange={toggleTheme} />
        </GView>
        <Chat />
    </View>);
}