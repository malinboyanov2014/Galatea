import GText from "@/src/common/GText";
import { ScrollView } from "react-native";
import type { Adapter, FactoryOutput } from "../types";

const stripMarkdown = (text: string) =>
  text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");

export const textAdapter: Adapter = (_schema, data): FactoryOutput => {
  const raw = typeof data === "string" ? data : "";
  const text = stripMarkdown(raw);

  const Component = () => (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      <GText style={{ lineHeight: 20 }}>{text}</GText>
    </ScrollView>
  );

  return { Component, props: {} };
};
