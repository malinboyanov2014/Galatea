import GText from "@/src/common/GText";
import GView from "@/src/common/GView";
import { cn } from "@/src/utils";
import { Pressable, View } from "react-native";

interface TableFooterProps {
  onScrollToTop: () => void;
  styles?: string;
}

export function TableFooter({ onScrollToTop, styles }: TableFooterProps) {
  return (
    <GView className={cn("absolute bottom-0 left-0 right-0", styles)}>
      <View className="flex-row items-center gap-1 p-3">
        <Pressable className="ml-auto" onPress={onScrollToTop}>
          <GText>Back to top</GText>
        </Pressable>
      </View>
    </GView>
  );
}
