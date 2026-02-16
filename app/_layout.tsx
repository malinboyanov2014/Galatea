import "../global.css";
import "react-native-reanimated";
import PaperTheme from "@/src/components/PaperTheme";
import Navigation from "@/src/components/Navigation";

export default function RootLayout() {
  return (
    <PaperTheme>
      <Navigation />
    </PaperTheme>
  );
}
