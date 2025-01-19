import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { useVideoPlayer, VideoView } from "expo-video";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { getErrorMessage } from "@/utils/utils";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { createVideo } from "@/lib/appwrite";

export type FormProp = {
  title: string;
  video: ImagePicker.ImagePickerAsset | null;
  thumbnail: ImagePicker.ImagePickerAsset | null;
  prompt: string;
  userId: string;
};

const Create = () => {
  const [uploading, setUploading] = React.useState(false);
  const { user } = useGlobalContext();
  const [form, setForm] = React.useState<FormProp>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
    userId: user?.$id || "",
  });

  const videoUrl =
    (form.video && typeof form.video === "object" && form.video.uri) || "";

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.play();
  });

  const openPicker = async (selectType: "video" | "image") => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === "image" ? ["images"] : ["videos"],
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }

      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      Alert.alert("Please fill all fields");
      return;
    }

    setUploading(true);

    try {
      await createVideo(form);
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
        userId: "",
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(title) => setForm({ ...form, title })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity
            onPress={() => openPicker("video")}
            disabled={uploading}
          >
            {form.video && player ? (
              <VideoView
                player={player}
                className="w-full h-64 rounded-2xl"
                contentFit="cover"
                allowsFullscreen
                nativeControls={false}
                style={{
                  width: "100%",
                  height: 256,
                  borderRadius: 16,
                }}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity
            onPress={() => openPicker("image")}
            disabled={uploading}
          >
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5 mr-2"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI promt"
          value={form.prompt}
          placeholder="The promt you used to create this video"
          handleChangeText={(prompt) => setForm({ ...form, prompt })}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
