import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ViewToken,
} from "react-native";
import React, { useEffect, useState } from "react";

import { Models } from "react-native-appwrite";

import { useVideoPlayer, VideoView } from "expo-video";

import { icons } from "../constants";
import { useEvent } from "expo";

type TrendingItemProps = {
  activeItemId: string | undefined;
  item: Models.Document;
};
const TrendingItem = ({ activeItemId, item }: TrendingItemProps) => {
  const player = useVideoPlayer(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    (player) => {}
  );

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEffect(() => {
    if (activeItemId !== item.$id) {
      player.pause();
    }
  }, [activeItemId, isPlaying]);

  return (
    <View
      className={`mr-5 transition duration-500 ${
        activeItemId === item.$id ? "scale-100" : "scale-90"
      }`}
    >
      {isPlaying ? (
        <VideoView
          player={player}
          style={{
            width: 208,
            height: 288,
            borderRadius: 35,
            marginRight: 5,
            overflow: "hidden",
          }}
          contentFit="cover"
          allowsFullscreen
          allowsPictureInPicture
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => {
            player.play();
          }}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            style={{
              width: 208,
              height: 288,
              borderRadius: 35,
              marginRight: 5,
              overflow: "hidden",
            }}
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

type TrendingProps = {
  posts: Models.Document[];
};

const Trending = ({ posts }: TrendingProps) => {
  const [activeItemId, setActiveItemId] = useState<string>();

  const viewableItemChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken<Models.Document>[];
    changed: ViewToken<Models.Document>[];
  }) => {
    if (viewableItems.length > 0) {
      setActiveItemId(viewableItems[0].item.$id);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item, idx) => String(idx)}
      renderItem={({ item }) => (
        <TrendingItem activeItemId={activeItemId} item={item} />
      )}
      horizontal
      onViewableItemsChanged={viewableItemChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
    />
  );
};

export default Trending;
