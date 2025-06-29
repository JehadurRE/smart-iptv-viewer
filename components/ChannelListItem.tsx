import React, { useRef } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/context/theme-context";
import { Channel } from "@/types/channel";
import { Heart, Play } from "lucide-react-native";
import { isTVDevice, isLargeScreen, getFontSize, getSpacing } from "@/utils/tv-utils";
import { TVFocusable } from "@/components/TVFocusable";

type ChannelListItemProps = {
  channel: Channel;
  onPress: () => void;
  isFavorite?: boolean;
  index?: number;
};

export function ChannelListItem({ channel, onPress, isFavorite, index = 0 }: ChannelListItemProps) {
  const { colors } = useTheme();
  const isTV = isTVDevice();
  const isLarge = isLargeScreen();

  // Use TVFocusable for TV devices, regular Pressable for mobile
  if (isTV) {
    return (
      <TVFocusable
        style={[
          styles.container, 
          { 
            backgroundColor: colors.card,
            padding: getSpacing(16),
            marginBottom: getSpacing(12)
          }
        ]}
        focusedStyle={{ borderColor: colors.primary }}
        onPress={onPress}
        nextFocusUp={index === 0 ? null : undefined}
      >
        <View style={[styles.logoContainer, { width: 70, height: 70 }]}>
          {channel.logo ? (
            <Image
              source={{ uri: channel.logo }}
              style={styles.logo}
              contentFit="contain"
              transition={200}
            />
          ) : (
            <View style={[styles.placeholderLogo, { backgroundColor: colors.border }]}>
              <Text style={[styles.placeholderText, { color: colors.text, fontSize: getFontSize(18) }]}>
                {channel.name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text 
            style={[
              styles.name, 
              { 
                color: colors.text,
                fontSize: getFontSize(18)
              }
            ]} 
            numberOfLines={1}
          >
            {channel.name}
          </Text>
          <Text 
            style={[
              styles.category, 
              { 
                color: colors.textSecondary,
                fontSize: getFontSize(16)
              }
            ]}
          >
            {channel.category}
          </Text>
        </View>
        
        <View style={styles.actions}>
          {isFavorite && (
            <Heart size={24} color={colors.primary} fill={colors.primary} style={styles.favoriteIcon} />
          )}
          <View style={[styles.playButton, { backgroundColor: colors.primary, width: 40, height: 40 }]}>
            <Play size={20} color={colors.white} fill={colors.white} />
          </View>
        </View>
      </TVFocusable>
    );
  }

  // Mobile or browser version
  return (
    <Pressable
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          padding: isLarge ? 16 : 12
        }
      ]}
      onPress={onPress}
    >
      <View style={[
        styles.logoContainer, 
        { 
          width: isLarge ? 60 : 50, 
          height: isLarge ? 60 : 50 
        }
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
                fontSize: isLarge ? 22 : 18
              }
            ]}>
              {channel.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={[
          styles.name, 
          { 
            color: colors.text,
            fontSize: isLarge ? 18 : 16
          }
        ]} numberOfLines={1}>
          {channel.name}
        </Text>
        <Text style={[
          styles.category, 
          { 
            color: colors.textSecondary,
            fontSize: isLarge ? 16 : 14
          }
        ]}>
          {channel.category}
        </Text>
      </View>
      
      <View style={styles.actions}>
        {isFavorite && (
          <Heart 
            size={isLarge ? 20 : 16} 
            color={colors.primary} 
            fill={colors.primary} 
            style={styles.favoriteIcon} 
          />
        )}
        <View style={[
          styles.playButton, 
          { 
            backgroundColor: colors.primary,
            width: isLarge ? 40 : 32,
            height: isLarge ? 40 : 32
          }
        ]}>
          <Play 
            size={isLarge ? 20 : 16} 
            color={colors.white} 
            fill={colors.white} 
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteIcon: {
    marginRight: 12,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});