import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const Bookmark = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <WebView
        webviewDebuggingEnabled
        javaScriptEnabled={true}
        allowsFullscreenVideo={true}
        source={{ uri: "https://portals.qbrick.com/33c14889" }}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
