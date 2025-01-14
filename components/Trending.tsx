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

import * as Animatable from "react-native-animatable";
import { Models } from "react-native-appwrite";

import { useVideoPlayer, VideoView } from "expo-video";

import { icons } from "../constants";

const zoomIn = {
  0: {
    scale: 0.9,
    opacity: 1,
  },

  1: {
    scale: 1,
    opacity: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
    opacity: 1,
  },

  1: {
    scale: 0.9,
    opacity: 1,
  },
};

type TrendingItemProps = {
  activeItemId: string | undefined;
  item: Models.Document;
};
const TrendingItem = ({ activeItemId, item }: TrendingItemProps) => {
  const [play, setPlay] = React.useState(false);
  console.info(item.video);
  const player = useVideoPlayer(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItemId === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <>
          <Text>hello</Text>
          <VideoView
            player={player}
            style={{
              width: 350,
              height: 275,
              flex: 1,
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 50,
              padding: 10,
            }}
            // className="w-full h-60 rounded-xl  mt-3 "
            contentFit="contain"
            allowsFullscreen
            allowsPictureInPicture
          />
        </>
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[35px] mr-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
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
      contentOffset={{ x: 170, y: 100 }}
    />
  );
};

export default Trending;
