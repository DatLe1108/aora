import { View, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";

const SearchInput = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`flex-row border-2 w-full h-16 px-4 bg-black-100 rounded-2xl items-center space-x-4 ${
        isFocused ? "border-secondary" : "border-black-200"
      }`}
    >
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={""}
        placeholder={"Search for a video topic"}
        placeholderTextColor={"#7b7b8b"}
        onChangeText={() => {}}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <TouchableOpacity>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
