import { View } from "react-native";
import { STRIP_WIDTH } from "./components/DrawerPanel";
import Header from "./components/Header";
import Chat from "./components/Layout/Chat";
import { TableList } from "./components/List";
import Messages from "./components/Messages";

interface Conversation {
    id: string;
    name: string;
    preview: string;
}

const conversations: Conversation[] = [
    { id: "1", name: "Alice", preview: "Hey, how are you?" },
    { id: "2", name: "Bob", preview: "Can we reschedule?" },
    { id: "3", name: "Support", preview: "Your ticket is open." },
    { id: "4", name: "Team", preview: "Meeting at 3pm." },
];

const drawerContent = (
    <TableList<Conversation>
        columns={[
            { key: "name", title: "Name", flex: 1 },
            { key: "preview", title: "Preview", flex: 2 },
        ]}
        data={conversations}
    />
);

export const Explore = () => {
    return (
        <View className="flex-1">
            <Header />
            <Chat drawerContent={drawerContent}>
                <Messages
                    messages={[
                        { id: "1", content: "Hi", sender: "user" },
                        { id: "2", content: "How can I help?", sender: "bot" },
                    ]}
                    style={{ marginRight: STRIP_WIDTH }}
                />
            </Chat>
        </View>
    );
};
