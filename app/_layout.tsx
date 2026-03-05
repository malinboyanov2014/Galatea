import Navigation from "@/src/components/Navigation";
import ReactQueryProvider from "@/src/components/Providers/ReactQueryProvider";
import PaperTheme from "@/src/components/Theme";
import "react-native-reanimated";
import "../global.css";

export default function RootLayout() {
  return (
    <PaperTheme>
      <ReactQueryProvider>
        <Navigation />
      </ReactQueryProvider>
    </PaperTheme>
  );
}
