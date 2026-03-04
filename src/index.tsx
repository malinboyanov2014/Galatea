import { useState } from "react";
import { View } from "react-native";
import GButton from "./common/GButton";
import GCard from "./common/GCard";
import GCheckbox from "./common/GCheckbox";
import GHelperText from "./common/GHelperText";
import GIcon from "./common/GIcon";
import GIconButton from "./common/GIconButton";
import GRadioButton from "./common/GRadioButton";
import GScrollView from "./common/GScrollView";
import GSearchbar from "./common/GSearchbar";
import GSwitch from "./common/GSwitch";
import GText from "./common/GText";
import GTextInput from "./common/GTextInput";
import GView from "./common/GView";
import Header from "./components/Header";

export const Home = () => {
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [textInput, setGTextInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <GScrollView className="flex-1">
      <Header />

      <View className="flex-row flex-wrap p-2">
        <GCard className="m-1 p-4 flex-1 min-w-[30%]">
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

        <GCard className="m-1 p-4 flex-1 min-w-[30%]">
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
            disabled={true}
          />
          <GHelperText type="info">This is a helper text</GHelperText>
        </GCard>

        <GCard className="m-1 p-4 flex-1 min-w-[30%]">
          <GText className="text-lg font-bold mb-2">GSearchbar</GText>
          <GSearchbar
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </GCard>

        <GCard className="m-1 p-4 flex-1 min-w-[30%]">
          <GText className="text-lg font-bold mb-2">GSwitch</GText>
          <GSwitch
            value={switchValue}
            onValueChange={setSwitchValue}
            label="Turn it ON"
          />
          <GText className="mt-2">
            Switch is {switchValue ? "ON" : "OFF"}
          </GText>
        </GCard>

        <GCard className="m-1 p-4 flex-1 min-w-[30%]">
          <GText className="text-lg font-bold mb-2">GCheckbox</GText>
          <GCheckbox
            status={checkboxValue ? "checked" : "unchecked"}
            onPress={() => setCheckboxValue(!checkboxValue)}
            label="Optional label"
          />
          <GText className="mt-2">
            Checkbox is {checkboxValue ? "checked" : "unchecked"}
          </GText>
        </GCard>

        <GCard className="m-1 p-4 flex-1 min-w-[30%]">
          <GText className="text-lg font-bold mb-2">GRadioButton</GText>
          <GRadioButton
            value="option1"
            status={radioValue === "option1" ? "checked" : "unchecked"}
            onPress={() => setRadioValue("option1")}
            label="Option 1"
          />
          <GRadioButton
            value="option2"
            status={radioValue === "option2" ? "checked" : "unchecked"}
            onPress={() => setRadioValue("option2")}
            className="mt-2"
            label="Option 2"
          />
        </GCard>

        <GCard className="m-1 p-4 flex-1 min-w-[30%]">
          <GText className="text-lg font-bold mb-2">
            GIconButton & GIcon
          </GText>
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
    </GScrollView>
  );
};
