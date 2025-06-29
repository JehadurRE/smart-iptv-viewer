import React from "react";
import { StyleSheet, View, Text, ScrollView, Dimensions } from "react-native";
import { useTheme } from "@/context/theme-context";
import { ChannelCard } from "./ChannelCard";
import { Channel } from "@/types/channel";
import { isTVDevice, isLargeScreen, getFontSize, getSpacing, isGoogleTV } from "@/utils/tv-utils";

type CategoryListProps = {
  category: string;
  channels: Channel[];
  onChannelPress: (channelId: string) => void;
  categoryIndex?: number;
};

export function CategoryList({ category, channels, onChannelPress, categoryIndex = 0 }: CategoryListProps) {
  const { colors } = useTheme();
  const isTV = isTVDevice() || isGoogleTV();
  const isLarge = isLargeScreen();
  const { width, height } = Dimensions.get("window");
  const isLandscape = width > height;

  if (channels.length === 0) {
    return null;
  }

  return (
    <View style={[
      styles.container,
      isTV && isLandscape && { marginBottom: getSpacing(32) }
    ]}>
      <Text 
        style={[
          styles.title, 
          { 
            color: colors.text,
            fontSize: (isTV || isLarge) ? getFontSize(22) : 20,
            marginBottom: (isTV || isLarge) ? getSpacing(16) : 12
          }
        ]}
      >
        {category}
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={isTV && isLandscape ? { paddingBottom: getSpacing(16) } : undefined}
      >
        <View style={[
          styles.channelRow,
          (isTV || isLarge) && { gap: getSpacing(16) }
        ]}>
          {channels.map((channel, index) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onPress={() => onChannelPress(channel.id)}
              index={index}
              rowIndex={categoryIndex}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  channelRow: {
    flexDirection: "row",
    gap: 12,
  },
});