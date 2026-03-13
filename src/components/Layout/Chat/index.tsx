import { useProgressSearch } from "@/api/query";
import GView from "@/src/common/GView";
import React, { memo, useState } from "react";
import { View } from "react-native";
import GSearchbar from "../../../common/GSearchbar";
import DrawerPanel, { STRIP_WIDTH } from "../../DrawerPanel";
import MatrixLoadingProgressIndicator from "../../MatrixLoadingProgressIndicator";
import Messages from "../../Messages";
import { ChatProvider, useChatContext } from "./ChatContext";

const ChatBackground = memo(({ visible }: { visible: boolean }) => {
  if (!visible) return null;
  return (
    <MatrixLoadingProgressIndicator
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.8 }}
    />
  );
});

interface ChatProps {
  children?: React.ReactNode;
  searchPlaceholder?: string;
  drawerContent?: React.ReactNode;
  i?: string;
  config?: Record<string, string>;
}

function ChatInner({ children, searchPlaceholder = "Message...", drawerContent, i = '', config = {} }: ChatProps) {
  const { searchQuery, messages, addUserMessage, addBotMessage } = useChatContext();
  const [inputText, setInputText] = useState('');
  const params = { i, q: searchQuery };
  const { isFetching } = useProgressSearch({ params, config, onMessage: addBotMessage });

  const handleSubmit = () => {
    addUserMessage(inputText);
    setInputText('');
  };

  return (
    <GView style={{ flex: 1, flexDirection: "row" }}>
      <DrawerPanel>{drawerContent}</DrawerPanel>
      <View style={{ flex: 1 }}>
        <ChatBackground visible={isFetching} />
        <View style={{ flex: 1 }}>
          <Messages messages={messages} style={{ marginRight: STRIP_WIDTH }} />
          {children}
        </View>
        <GView className="px-2 pb-2 pt-1" style={{ marginRight: STRIP_WIDTH }}>
          <GSearchbar
            placeholder={searchPlaceholder}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSubmit}
            onIconPress={handleSubmit}
            disabled={isFetching}
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
