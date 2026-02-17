import { useState } from "react";
import { ScrollView, View } from "react-native";
import GButton from "./common/GButton";
import GCard from "./common/GCard";
import GCheckbox from "./common/GCheckbox";
import GHelperText from "./common/GHelperText";
import GIcon from "./common/GIcon";
import GIconButton from "./common/GIconButton";
import GRadioButton from "./common/GRadioButton";
import GSearchbar from "./common/GSearchbar";
import GSwitch from "./common/GSwitch";
import GText from "./common/GText";
import GTextInput from "./common/GTextInput";
import { useTheme } from "./components/PaperTheme";

export const Home = () => {
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [textInput, setGTextInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isDark, toggleTheme } = useTheme();

  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Theme Toggle */}
      <View className="flex-row items-center justify-between p-4 bg-white dark:bg-gray-800">
        <GText className="text-lg font-bold">Dark Mode</GText>
        <GSwitch value={isDark} onValueChange={toggleTheme} />
      </View>

      <View className="flex-row flex-wrap p-2">
        {/* GButton Card */}
        <GCard className="m-2 p-4 flex-1 min-w-[30%]">
          <GText className="text-lg font-bold mb-2">GButton</GText>
          <GButton mode="contained" onPress={() => console.log("Pressed")}>
            Contained Button
          </GButton>
          <GButton
            mode="outlined"
            onPress={() => console.log("Pressed")}
            className="mt-2"
          >
            Outlined Button
          </GButton>
          <GButton
            mode="text"
            onPress={() => console.log("Pressed")}
            className="mt-2"
          >
            GText Button
          </GButton>
        </GCard>

        {/* GGTextInput Card */}
        <GCard className="m-2 p-4 flex-1 min-w-[30%]">
          <GText className="text-lg font-bold mb-2">GTextInput</GText>
          <GTextInput
            label="Enter text"
            value={textInput}
            onChangeText={setGTextInput}
            mode="outlined"
            className="mb-2"
          />
          <GTextInput
            label="Readonly"
            value={"Readonly value"}
            onChangeText={setGTextInput}
            mode="outlined"
            className="mb-2"
            readOnly={true}
          />
          <GHelperText type="info">This is a helper text</GHelperText>
        </GCard>

        {/* GSearchbar Card */}
        <GCard className="m-2 p-4 flex-1 min-w-[30%]">
          <GText className="text-lg font-bold mb-2">GSearchbar</GText>
          <GSearchbar
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </GCard>

        {/* GSwitch Card */}
        <GCard className="m-2 p-4 flex-1 min-w-[30%]">
          <GText className="text-lg font-bold mb-2">GSwitch</GText>
          <GSwitch value={switchValue} onValueChange={setSwitchValue} />
          <GText className="mt-2">Switch is {switchValue ? "ON" : "OFF"}</GText>
        </GCard>

        {/* GCheckbox Card */}
        <GCard className="m-2 p-4 flex-1 min-w-[30%]">
          <GText className="text-lg font-bold mb-2">GCheckbox</GText>
          <GCheckbox
            status={checkboxValue ? "checked" : "unchecked"}
            onPress={() => setCheckboxValue(!checkboxValue)}
          />
          <GText className="mt-2">
            Checkbox is {checkboxValue ? "checked" : "unchecked"}
          </GText>
        </GCard>

        {/* GRadioButton Card */}
        <GCard className="m-2 p-4 flex-1 min-w-[30%]">
          <GText className="text-lg font-bold mb-2">GRadioButton</GText>
          <GRadioButton
            value="option1"
            status={radioValue === "option1" ? "checked" : "unchecked"}
            onPress={() => setRadioValue("option1")}
          />
          <GText>Option 1</GText>
          <GRadioButton
            value="option2"
            status={radioValue === "option2" ? "checked" : "unchecked"}
            onPress={() => setRadioValue("option2")}
            className="mt-2"
          />
          <GText>Option 2</GText>
        </GCard>

        {/* GIconButton & GIcon Card */}
        <GCard className="m-2 p-4 flex-1 min-w-[30%]">
          <GText className="text-lg font-bold mb-2">GIconButton & GIcon</GText>
          <View className="flex-row">
            <GIconButton
              icon="camera"
              size={24}
              onPress={() => console.log("Icon button pressed")}
            />
            <GIcon source="heart" size={24} className="mt-2" />
          </View>
        </GCard>
      </View>
    </ScrollView>
  );
};
