import { useProgressSearch } from "@/api/query";
import GView from "@/src/common/GView";
import React, { useState } from "react";
import { View } from "react-native";
import GSearchbar from "../../../common/GSearchbar";
import DrawerPanel, { STRIP_WIDTH } from "../../DrawerPanel";
import Messages from "../../Messages";
import { ChatProvider, useChatContext } from "./ChatContext";

interface ChatProps {
  children?: React.ReactNode;
  searchPlaceholder?: string;
  drawerContent?: React.ReactNode;
  i?: string;
  config?: Record<string, string>;
}

function ChatInner({ children, searchPlaceholder = "Message...", drawerContent, i = '', config = {} }: ChatProps) {
  const { searchQuery, messages, submitSearch, addBotMessage } = useChatContext();
  const [inputText, setInputText] = useState('');
  const { isPending } = useProgressSearch({ i, q: searchQuery, config, onMessage: addBotMessage });

  const handleSubmit = () => {
    submitSearch(inputText);
    setInputText('');
  };

  return (
    <GView style={{ flex: 1, flexDirection: "row" }}>
      <DrawerPanel>{drawerContent}</DrawerPanel>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Messages messages={messages} isLoading={isPending} style={{ marginRight: STRIP_WIDTH }} />
          {children}
        </View>
        <GView className="px-2 pb-2 pt-1" style={{ marginRight: STRIP_WIDTH }}>
          <GSearchbar
            placeholder={searchPlaceholder}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSubmit}
            onIconPress={handleSubmit}
          />
        </GView>
      </View>
    </GView>
  );
}

export default function Chat(props: ChatProps) {
  return (
    <ChatProvider>
      <ChatInner {...props} />
    </ChatProvider>
  );
}
