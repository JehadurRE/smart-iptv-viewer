import React, { useRef } from "react";
import { StyleSheet, View, Text, Pressable, findNodeHandle, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/context/theme-context";
import { Channel } from "@/types/channel";
import { useFavoritesStore } from "@/store/favorites-store";
import { Heart } from "lucide-react-native";
import { isTVDevice, isLargeScreen, getTVFocusProperties, getFontSize, getSpacing, isGoogleTV } from "@/utils/tv-utils";
import { TVFocusable } from "@/components/TVFocusable";

type ChannelCardProps = {
  channel: Channel;
  onPress: () => void;
  index?: number;
  rowIndex?: number;
};

export function ChannelCard({ channel, onPress, index = 0, rowIndex = 0 }: ChannelCardProps) {
  const { colors } = useTheme();
  const { favorites } = useFavoritesStore();
  const isFavorite = favorites.includes(channel.id);
  const isTV = isTVDevice() || isGoogleTV();
  const isLarge = isLargeScreen();
  const { width, height } = Dimensions.get("window");
  const isLandscape = width > height;
  
  // Refs for TV navigation
  const cardRef = useRef(null);
  
  // Calculate next focus targets for TV navigation
  const getNextFocusProps = () => {
    if (!isTV) return {};
    
    return {
      nextFocusUp: rowIndex > 0 ? undefined : null,
      nextFocusDown: undefined,
      nextFocusLeft: index > 0 ? undefined : null,
      nextFocusRight: undefined,
    };
  };

  // Calculate card width based on screen size and orientation
  let cardWidth = isTV || isLarge ? 200 : 140;
  
  // For TV in landscape mode, make cards larger
  if (isTV && isLandscape) {
    cardWidth = 240;
  }

  // Use TVFocusable for TV devices, regular Pressable for mobile
  if (isTV) {
    return (
      <TVFocusable
        style={[
          styles.container, 
          { 
            backgroundColor: colors.card,
            width: cardWidth,
            margin: getSpacing(8)
          }
        ]}
        focusedStyle={{ borderColor: colors.primary }}
        onPress={onPress}
        {...getNextFocusProps()}
      >
        <View style={[styles.imageContainer, { height: cardWidth * 0.6 }]}>
          {channel.logo ? (
            <Image
              source={{ uri: channel.logo }}
              style={styles.logo}
              contentFit="contain"
              transition={200}
            />
          ) : (
            <View style={[styles.placeholderLogo, { backgroundColor: colors.border }]}>
              <Text style={[styles.placeholderText, { color: colors.text, fontSize: getFontSize(24) }]}>
                {channel.name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
          {isFavorite && (
            <View style={[styles.favoriteIcon, { backgroundColor: colors.primary }]}>
              <Heart size={16} color={colors.white} fill={colors.white} />
            </View>
          )}
        </View>
        <Text
          style={[
            styles.name, 
            { 
              color: colors.text,
              fontSize: getFontSize(16)
            }
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {channel.name}
        </Text>
        <Text style={[
          styles.category, 
          { 
            color: colors.textSecondary,
            fontSize: getFontSize(14)
          }
        ]}>
          {channel.category}
        </Text>
      </TVFocusable>
    );
  }

  // Mobile or browser version
  return (
    <Pressable
      ref={cardRef}
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          width: isLarge ? 180 : 140
        }
      ]}
      onPress={onPress}
    >
      <View style={[
        styles.imageContainer, 
        { height: isLarge ? 100 : 80 }
      ]}>
        {channel.logo ? (
          <Image
            source={{ uri: channel.logo }}
            style={styles.logo}
            contentFit="contain"
            transition={200}
          />
        ) : (
          <View style={[styles.placeholderLogo, { backgroundColor: colors.border }]}>
            <Text style={[
              styles.placeholderText, 
              { 
                color: colors.text,
                fontSize: isLarge ? 28 : 24
              }
            ]}>
              {channel.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        )}
        {isFavorite && (
          <View style={[styles.favoriteIcon, { backgroundColor: colors.primary }]}>
            <Heart size={isLarge ? 14 : 12} color={colors.white} fill={colors.white} />
          </View>
        )}
      </View>
      <Text
        style={[
          styles.name, 
          { 
            color: colors.text,
            fontSize: isLarge ? 16 : 14
          }
        ]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {channel.name}
      </Text>
      <Text style={[
        styles.category, 
        { 
          color: colors.textSecondary,
          fontSize: isLarge ? 14 : 12
        }
      ]}>
        {channel.category}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logo: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  placeholderLogo: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    paddingHorizontal: 8,
    height: 40,
  },
  category: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});