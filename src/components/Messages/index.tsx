import { FlashList } from "@shopify/flash-list";
import { memo } from "react";
import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import GText from "../../common/GText";

export interface Message {
  id: string;
  content: string;
  contentType?: "text" | "html";
  sender: "bot" | "user";
  date?: string;
}

interface MessagesProps {
  messages: Message[];
  direction?: "up" | "down";
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

const MessageBubble = memo(({ message }: { message: Message }) => {
  const theme = useTheme();
  const isUser = message.sender === "user";

  const content =
    message.contentType === "html"
      ? stripHtml(message.content)
      : message.content;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginVertical: 4,
        paddingHorizontal: 12,
      }}
    >
      <View
        style={{
          maxWidth: "75%",
          backgroundColor: isUser
            ? theme.colors.primary
            : theme.colors.surfaceDisabled,
          borderRadius: 12,
          borderBottomRightRadius: isUser ? 2 : 12,
          borderBottomLeftRadius: isUser ? 12 : 2,
          borderWidth: 1,
          borderColor: isUser ? theme.colors.primary : theme.colors.outline,
          padding: 10,
        }}
      >
        <GText
          style={{
            color: isUser
              ? theme.colors.onPrimary
              : theme.colors.onSurface,
          }}
        >
          {content}
        </GText>

        {message.date && (
          <GText
            style={{
              fontSize: 10,
              color: isUser
                ? theme.colors.onPrimary
                : theme.colors.onSurface,
              opacity: 0.7,
              marginTop: 4,
              textAlign: isUser ? "right" : "left",
            }}
          >
            {message.date}
          </GText>
        )}
      </View>
    </View>
  );
});

MessageBubble.displayName = "MessageBubble";

const LoadingBubble = () => {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-start", marginVertical: 4, paddingHorizontal: 12 }}>
      <View style={{
        backgroundColor: theme.colors.surfaceDisabled,
        borderRadius: 12,
        borderBottomLeftRadius: 2,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        padding: 10,
      }}>
        <ActivityIndicator size="small" color={theme.colors.onSurface} />
      </View>
    </View>
  );
};

export default function Messages({ messages, direction = "up", style, contentContainerStyle, isLoading }: MessagesProps) {
  const isUp = direction === "up";
  const data = isUp ? messages : [...messages].reverse();
  if (isUp) {
    messages = messages.reverse();
  }

  return (
    <View style={[{ flex: 1 }, style]}>
      <FlashList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={[{ paddingVertical: 8 }, contentContainerStyle]}
        maintainVisibleContentPosition={{
          startRenderingFromBottom: isUp,
          autoscrollToBottomThreshold: isUp ? 1 : undefined,
          autoscrollToTopThreshold: !isUp ? 1 : undefined,
          animateAutoScrollToBottom: isUp,
        }}
        ListFooterComponent={isLoading ? <LoadingBubble /> : null}
      />
    </View>
  );
}
