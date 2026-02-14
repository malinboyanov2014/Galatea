import { Colors } from "@/constants/theme";
import { HapticTab } from "@/Legacy/components/ui/haptic-tab";
import { IconSymbol } from "@/Legacy/components/ui/icon-symbol.ios";
import { useColorScheme } from "@/Legacy/hooks/use-color-scheme";
import { Tabs } from "expo-router";

export default function LayoutTabs() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
