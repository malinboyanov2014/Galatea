import { View } from "react-native";
import Header from "./components/Header";
import useComponent from "./components/Hooks/useComponent";
import Chat from "./components/Layout/Chat";

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
            <Chat drawerContent={<DrawerContent />} i="v2_rcm_report" config={{ message: 'explanation' }} />
        </View>
    );
};
