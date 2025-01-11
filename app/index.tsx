import { StatusBar, Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-green-300">
      <Text className="text-3xl font-pblack">
        Edit app/index.tsx to edit this screen.
      </Text>
      <Link href="/home" style={{ color: "blue" }}>
        Go to Home
      </Link>
    </View>
  );
}
