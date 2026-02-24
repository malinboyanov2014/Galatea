import GSearchbar from "@/src/common/GSearchbar";
import SplitView from "@/src/components/Layout/HorizontalSplit";

export default function TabTwoScreen() {
  return (
    <SplitView
      searchComponent={
        <GSearchbar
          placeholder="Search"
          value={""}
          onChangeText={() => console.log("Search")}
          style={{ borderRadius: 12 }}
        />
      }
    />
  );
}
