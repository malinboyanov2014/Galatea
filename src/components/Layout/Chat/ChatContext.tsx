import React, { ComponentType, createContext, useContext, useState } from "react";
import { Message } from "../../Messages";

interface ChatState {
    searchQuery: string;
    messages: Message[];
    addUserMessage: (text: string) => void;
    addBotMessage: (text: string) => void;
    addBotComponent: (factory: { Component: ComponentType<any>; props: any }) => void;
}

const ChatContext = createContext<ChatState | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    const addUserMessage = (text: string) => {
        if (!text.trim()) return;
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: text,
            sender: 'user',
        }]);
        setSearchQuery(text);
    };

    const addBotMessage = (text: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: text,
            sender: 'bot',
        }]);
    };

    const addBotComponent = (factory: { Component: ComponentType<any>; props: any }) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            component: factory,
            sender: 'bot',
        }]);
    };

    return (
        <ChatContext.Provider value={{ searchQuery, messages, addUserMessage, addBotMessage, addBotComponent }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error('useChatContext must be used within a ChatProvider');
    return ctx;
};
