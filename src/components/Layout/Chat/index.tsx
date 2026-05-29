import { useProgressSearch } from "@/api/query";
import GView from "@/src/common/GView";
import { encryptForUrl } from "@/src/utils";
import React, { memo, useState } from "react";
import { View } from "react-native";
import GSearchbar from "../../../common/GSearchbar";
import DrawerPanel, { STRIP_WIDTH } from "../../DrawerPanel";
import MatrixLoadingProgressIndicator from "../../MatrixLoadingProgressIndicator";
import Messages from "../../Messages";
import { ChatProvider, useChatContext } from "./ChatContext";

const ChatBackground = memo(
  ({ visible, progress }: { visible: boolean; progress?: number }) => {
    if (!visible) return null;
    return (
      <MatrixLoadingProgressIndicator
        progress={progress}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.8,
        }}
      />
    );
  },
);

ChatBackground.displayName = "ChatBackground";

interface ChatProps {
  children?: React.ReactNode;
  searchPlaceholder?: string;
  drawerContent?: React.ReactNode;
  i?: string;
  config?: Record<string, string>;
}

function ChatInner({
  children,
  searchPlaceholder = "Message...",
  drawerContent,
  i = "",
}: ChatProps) {
  const { searchQuery, messages, addUserMessage, addBotComponent } =
    useChatContext();
  const [inputText, setInputText] = useState("");

  const params = { i, q: searchQuery };
  const request_id =
    i && searchQuery ? encryptForUrl({ i, searchQuery }) : undefined;
  const body = {
    context: JSON.stringify({
      user_id: "mboyanov@curativeai.com",
      section: "schedule_tx",
      request_id,
    }),
  };
  const { isFetching, progress } = useProgressSearch({
    params,
    body,
    onResult: addBotComponent,
  });

  const handleSubmit = () => {
    addUserMessage(inputText);
    setInputText("");
  };

  return (
    <GView style={{ flex: 1, flexDirection: "row" }}>
      {drawerContent && <DrawerPanel>{drawerContent}</DrawerPanel>}
      <View style={{ flex: 1 }}>
        <ChatBackground visible={isFetching} progress={progress} />
        <View style={{ flex: 1 }}>
          <Messages
            messages={messages}
            style={{ marginRight: drawerContent ? STRIP_WIDTH : 0 }}
          />
          {children}
        </View>
        <GView
          className="px-2 pb-2 pt-1"
          style={{ marginRight: drawerContent ? STRIP_WIDTH : 0 }}
        >
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
