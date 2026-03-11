import { View } from "react-native";
import { STRIP_WIDTH } from "./components/DrawerPanel";
import Header from "./components/Header";
import useComponent from "./components/Hooks/useComponent";
import Chat from "./components/Layout/Chat";
import Messages from "./components/Messages";

const DrawerContent = () => {
    const { Component, props } = useComponent({
        i: 'reporting_bar_rcm_report',
        config: {
            data: 'report_data',
            type: 'report_type',
            schema: 'schema',
            meta: {
                count: 'row_count',
                title: 'report_name',
            },
        }
    })

    return <Component {...props} />;
};

export const Explore = () => {
    return (
        <View className="flex-1">
            <Header />
            <Chat drawerContent={<DrawerContent />}>
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
