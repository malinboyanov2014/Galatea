import GSwitch from "../../common/GSwitch";
import GText from "../../common/GText";
import GView from "../../common/GView";
import { useTheme } from "../Theme";

export default function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <GView className="flex-row items-center justify-between p-4">
      <GText className="text-lg font-bold">CurativeAI</GText>
      <GSwitch value={isDark} onValueChange={toggleTheme} />
    </GView>
  );
}
