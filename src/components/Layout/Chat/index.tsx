import GView from "@/src/common/GView";
import React from "react";
import { View } from "react-native";
import GScrollView from "../../../common/GScrollView";
import GSearchbar from "../../../common/GSearchbar";
import DrawerPanel from "../../DrawerPanel";

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
    <View style={{ flex: 1, flexDirection: "row" }}>
      <DrawerPanel>{drawerContent}</DrawerPanel>

      <View style={{ flex: 1 }}>
        <GScrollView className="flex-1 p-2">{children}</GScrollView>

        <GView className="px-2 pb-2 pt-1">
          <GSearchbar
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChangeText={onSearch}
          />
        </GView>
      </View>
    </View>
  );
}
