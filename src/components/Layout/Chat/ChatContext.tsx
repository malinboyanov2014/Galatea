import React, {
  ComponentType,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { Message } from "../../Messages";

interface ChatState {
  searchQuery: string;
  messages: Message[];
  addUserMessage: (text: string) => void;
  addBotMessage: (text: string) => void;
  addBotComponent: (factory: {
    Component: ComponentType<any>;
    props: any;
  }) => void;
}

const ChatContext = createContext<ChatState | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messageCounterRef = useRef(0);

  const createMessageId = () => {
    messageCounterRef.current += 1;
    return `${Date.now()}-${messageCounterRef.current}`;
  };

  const addUserMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId(),
        content: text,
        sender: "user",
      },
    ]);
    setSearchQuery(text);
  };

  const addBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId(),
        content: text,
        sender: "bot",
      },
    ]);
  };

  const addBotComponent = (factory: {
    Component: ComponentType<any>;
    props: any;
  }) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId(),
        component: factory,
        sender: "bot",
      },
    ]);
  };

  return (
    <ChatContext.Provider
      value={{
        searchQuery,
        messages,
        addUserMessage,
        addBotMessage,
        addBotComponent,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx)
    throw new Error("useChatContext must be used within a ChatProvider");
  return ctx;
};
