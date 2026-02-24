import React from "react";
import { View, Dimensions } from "react-native";
import { useTheme } from "react-native-paper";
import { GripHorizontal } from "lucide-react-native";
import { useSplitView } from "./hooks";

const screenHeight = Dimensions.get("window").height;

interface SplitViewProps {
  initialHeight?: number;
  topComponent?: React.ReactNode;
  bottomComponent?: React.ReactNode;
  headerComponent?: React.ReactNode;
  searchComponent?: React.ReactNode;
}

export default function SplitView({
  initialHeight = screenHeight / 1.5,
  topComponent,
  bottomComponent,
  headerComponent,
  searchComponent,
}: SplitViewProps) {
  const theme = useTheme();
  const { topHeight, handlePointerDown, handlePointerMove, handlePointerUp } =
    useSplitView(initialHeight);

  return (
    <View className="flex-1">
      {headerComponent && <View className="px-2 pt-2">{headerComponent}</View>}
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.surfaceVariant,
        }}
      >
        <View
          className="flex-1 mx-2 my-2 overflow-hidden"
          style={{
            borderWidth: 1,
            borderColor: theme.colors.outline,
            borderRadius: 12,
          }}
        >
          <View style={{ height: topHeight }} className="p-2">
            {topComponent}
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.outline,
            }}
          />

          <View style={{ flex: 1 }} className="p-2">
            {bottomComponent}
          </View>

          <View
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="items-center justify-center cursor-row-resize select-none"
            style={{
              position: "absolute",
              top: topHeight - 4,
              left: 0,
              right: 0,
              height: 8,
              zIndex: 10,
            }}
          >
            <View
              style={{
                backgroundColor: theme.colors.surface,
                paddingHorizontal: 4,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: theme.colors.outline,
              }}
            >
              <GripHorizontal size={12} color={theme.colors.outline} />
            </View>
          </View>
        </View>

        {searchComponent && (
          <View className="px-2 pb-2">{searchComponent}</View>
        )}
      </View>
    </View>
  );
}
