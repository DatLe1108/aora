import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";
import { router, usePathname } from "expo-router";

type SearchInputProps = {
  initialQuery?: string | string[];
};

const SearchInput = ({ initialQuery }: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(
    (typeof initialQuery === "string"
      ? initialQuery
      : initialQuery?.join("")) || ""
  );
  const pathname = usePathname();

  return (
    <View
      className={`flex-row border-2 w-full h-16 px-4 bg-black-100 rounded-2xl items-center space-x-4 ${
        isFocused ? "border-secondary" : "border-black-200"
      }`}
    >
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder={"Search for a video topic"}
        placeholderTextColor={"#CDCDE0"}
        onChangeText={(e) => {
          setQuery(e);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert("Missing query", "Please enter a search query");
          }

          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
