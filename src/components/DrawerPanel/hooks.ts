import { useCallback, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const MIN_WIDTH = 150;
const MAX_WIDTH = screenWidth / 2;

export const useDrawerResize = (initialWidth: number, animatedWidth: Animated.Value) => {
  const [drawerWidth, setDrawerWidth] = useState(initialWidth);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(initialWidth);

  const handlePointerDown = useCallback(
    (e: any) => {
      setDragging(true);
      startXRef.current = e.nativeEvent.pageX;
      startWidthRef.current = drawerWidth;

      if (e?.target?.setPointerCapture) {
        e.target.setPointerCapture(e.nativeEvent.pointerId);
      }
    },
    [drawerWidth],
  );

  const handlePointerMove = useCallback(
    (e: any) => {
      if (!dragging) return;

      const delta = e.nativeEvent.pageX - startXRef.current;
      const newWidth = Math.min(
        Math.max(startWidthRef.current + delta, MIN_WIDTH),
        MAX_WIDTH,
      );

      setDrawerWidth(newWidth);
      animatedWidth.setValue(newWidth);
    },
    [dragging, animatedWidth],
  );

  const handlePointerUp = useCallback((e: any) => {
    setDragging(false);

    if (e?.target?.releasePointerCapture) {
      e.target.releasePointerCapture(e.nativeEvent.pointerId);
    }
  }, []);

  return { drawerWidth, handlePointerDown, handlePointerMove, handlePointerUp };
};
