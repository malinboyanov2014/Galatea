import Navigation from "@/src/components/Navigation";
import PaperTheme from "@/src/components/Theme";
import "react-native-reanimated";
import "../global.css";

export default function RootLayout() {
  return (
    <PaperTheme>
      <Navigation />
    </PaperTheme>
  );
}
