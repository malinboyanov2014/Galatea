import GView from "@/src/common/GView";
import React from "react";
import { View } from "react-native";
import GSearchbar from "../../../common/GSearchbar";
import DrawerPanel, { STRIP_WIDTH } from "../../DrawerPanel";

interface ChatProps {
  children?: React.ReactNode;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  searchPlaceholder?: string;
  drawerContent?: React.ReactNode;
}

export default function Chat({
  children,
  onSearch,
  searchQuery = "",
  searchPlaceholder = "Message...",
  drawerContent,
}: ChatProps) {

  return (
    <GView style={{ flex: 1, flexDirection: "row" }}>
      <DrawerPanel>{drawerContent}</DrawerPanel>

      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>{children}</View>

        <GView className="px-2 pb-2 pt-1" style={{
          marginRight: STRIP_WIDTH
        }}>
          <GSearchbar
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChangeText={onSearch}
          />
        </GView>
      </View>
    </GView>
  );
}
