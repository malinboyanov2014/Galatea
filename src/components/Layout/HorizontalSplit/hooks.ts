import { useCallback, useRef, useState } from "react";
import { Dimensions } from "react-native";

const screenHeight = Dimensions.get("window").height;

export const useSplitView = (initialHeight: number) => {
  const [topHeight, setTopHeight] = useState(initialHeight);
  const [dragging, setDragging] = useState(false);

  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(initialHeight);

  const handlePointerDown = useCallback(
    (e: any) => {
      setDragging(true);

      startYRef.current = e.nativeEvent.pageY;
      startHeightRef.current = topHeight;

      if (e?.target?.setPointerCapture) {
        e.target.setPointerCapture(e.nativeEvent.pointerId);
      }
    },
    [topHeight],
  );

  const handlePointerMove = useCallback(
    (e: any) => {
      if (!dragging) return;

      const currentY = e.nativeEvent.pageY;
      const delta = currentY - startYRef.current;

      const minHeight = 100;
      const maxHeight = screenHeight - 150;

      const newHeight = Math.min(
        Math.max(startHeightRef.current + delta, minHeight),
        maxHeight,
      );

      setTopHeight(newHeight);
    },
    [dragging],
  );

  const handlePointerUp = useCallback((e: any) => {
    setDragging(false);

    if (e?.target?.releasePointerCapture) {
      e.target.releasePointerCapture(e.nativeEvent.pointerId);
    }
  }, []);

  return { handlePointerDown, handlePointerMove, handlePointerUp, topHeight };
};
