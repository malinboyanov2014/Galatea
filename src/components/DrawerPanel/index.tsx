import { GripVertical, Menu, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, View } from "react-native";
import { Drawer, useTheme } from "react-native-paper";
import { useDrawerResize } from "./hooks";

const DRAWER_WIDTH = 280;
export const STRIP_WIDTH = 52;
const HANDLE_WIDTH = 16;

interface DrawerPanelProps {
  width?: number;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

export default function DrawerPanel({
  width = DRAWER_WIDTH,
  defaultOpen = false,
  children,
}: DrawerPanelProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(defaultOpen);
  const animatedWidth = useRef(new Animated.Value(defaultOpen ? width : STRIP_WIDTH)).current;
  const animatedOpacity = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;
  const { drawerWidth, handlePointerDown, handlePointerMove, handlePointerUp } =
    useDrawerResize(width, animatedWidth);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedWidth, {
        toValue: open ? drawerWidth : STRIP_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: open ? 1 : 0,
        duration: open ? 200 : 100,
        useNativeDriver: false,
      }),
    ]).start();
  }, [open, drawerWidth]);

  const handleLeft = Animated.subtract(animatedWidth, HANDLE_WIDTH / 2);

  return (
    <View style={{ flexDirection: "row", position: "relative" }}>
      <Animated.View
        style={{
          width: animatedWidth,
          overflow: "hidden",
          backgroundColor: theme.colors.surface,
          elevation: 4,
          borderRightWidth: open ? 1 : 0,
          borderTopWidth: open ? 1 : 0,
          borderRightColor: theme.colors.outline,
          borderTopColor: theme.colors.outline,
          borderTopRightRadius: 12,
        }}
      >
        <Pressable
          onPress={() => setOpen((v) => !v)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: STRIP_WIDTH,
            height: STRIP_WIDTH,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            backgroundColor: theme.colors.surface,
          }}
        >
          {open
            ? <X size={22} color={theme.colors.onSurface} />
            : <Menu size={22} color={theme.colors.onSurface} />
          }
        </Pressable>
        <ScrollView>
          <View style={{ width: drawerWidth, paddingTop: STRIP_WIDTH }}>
            <Animated.View style={{ opacity: animatedOpacity }}>
              {children ?? (
                <Drawer.Item icon="inbox" label="Inbox" />
              )}
            </Animated.View>
          </View>
        </ScrollView>
      </Animated.View>

      {open && (
        <Animated.View
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="items-center justify-center cursor-col-resize select-none"
          style={{
            position: "absolute",
            left: handleLeft,
            top: '50%',
            bottom: 0,
            width: HANDLE_WIDTH,
            zIndex: 1000,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              paddingVertical: 4,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: theme.colors.outline,
            }}
          >
            <GripVertical size={12} color={theme.colors.outline} style={{ cursor: 'pointer' }} />
          </View>
        </Animated.View>
      )}
    </View>
  );
}
