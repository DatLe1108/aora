import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Models } from "react-native-appwrite";

import { icons } from "../constants";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";

type VideoCardProps = {
  video: Models.Document;
};

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}: VideoCardProps) => {
  const player = useVideoPlayer(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    (player) => {}
  );

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular">
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
      {isPlaying ? (
        <VideoView
          player={player}
          style={{
            width: "100%",
            height: 240,
            borderRadius: 12,
            marginTop: 12,
            overflow: "hidden",
          }}
          contentFit="cover"
          allowsFullscreen
          allowsPictureInPicture
        />
      ) : (
        <TouchableOpacity
          style={{
            width: "100%",
            height: 240,
            borderRadius: 12,
            marginTop: 12,
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
          activeOpacity={0.7}
          onPress={() => player.play()}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
