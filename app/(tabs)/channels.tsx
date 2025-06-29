import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { usePlaylistStore } from "@/store/playlist-store";
import { ChannelListItem } from "@/components/ChannelListItem";
import { PlaylistStatus } from "@/components/PlaylistStatus";
import { Footer } from "@/components/Footer";
import { isTVDevice, isLargeScreen, getFontSize, getSpacing, getGridColumns } from "@/utils/tv-utils";
import { TVFocusable } from "@/components/TVFocusable";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";

export default function ChannelsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { playlists, loading } = usePlaylistStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isTV = isTVDevice();
  const isLarge = isLargeScreen();

  const allChannels = playlists.flatMap(playlist => playlist.channels || []);
  const categories = [...new Set(allChannels.map(channel => channel.category))].sort();
  
  const filteredChannels = selectedCategory
    ? allChannels.filter(channel => channel.category === selectedCategory)
    : allChannels;

  const handleChannelPress = (channelId: string) => {
    router.push(`/player?id=${channelId}`);
  };

  // Render category button based on platform
  const renderCategoryButton = (category: string | null, label: string, index: number) => {
    const isSelected = selectedCategory === category;
    
    if (isTV) {
      return (
        <TVFocusable
          style={[
            styles.categoryButton,
            { 
              padding: getSpacing(12),
              margin: getSpacing(4)
            },
            isSelected && { backgroundColor: colors.primary },
          ]}
          focusedStyle={{ borderColor: colors.primary }}
          onPress={() => setSelectedCategory(category)}
          nextFocusUp={null} // First row, no up navigation
          nextFocusLeft={index === 0 ? null : undefined}
        >
          <Text
            style={[
              styles.categoryButtonText,
              { 
                color: isSelected ? colors.white : colors.text,
                fontSize: getFontSize(16)
              },
            ]}
          >
            {label}
          </Text>
        </TVFocusable>
      );
    }

    return (
      <Pressable
        style={[
          styles.categoryButton,
          isSelected && { backgroundColor: colors.primary },
        ]}
        onPress={() => setSelectedCategory(category)}
      >
        <Text
          style={[
            styles.categoryButtonText,
            { color: isSelected ? colors.white : colors.text },
            isLarge && { fontSize: 16 }
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <ResponsiveLayout>
        <PlaylistStatus />
        
        <View style={[
          styles.categoryContainer,
          (isTV || isLarge) && { 
            paddingVertical: getSpacing(16),
            paddingHorizontal: getSpacing(16)
          }
        ]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {renderCategoryButton(null, "All", 0)}
            
            {categories.map((category, index) => (
              renderCategoryButton(category, category, index + 1)
            ))}
          </ScrollView>
        </View>

        {loading && !allChannels.length ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={isTV ? "large" : "large"} color={colors.primary} />
            <Text style={[
              styles.loadingText, 
              { 
                color: colors.text,
                fontSize: isTV ? getFontSize(18) : 16
              }
            ]}>
              Loading channels...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredChannels}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <ChannelListItem
                channel={item}
                onPress={() => handleChannelPress(item.id)}
                index={index}
              />
            )}
            contentContainerStyle={[
              styles.listContent,
              (isTV || isLarge) && { 
                padding: getSpacing(24),
                paddingTop: getSpacing(8)
              }
            ]}
            numColumns={isLarge ? 2 : 1}
            key={isLarge ? "grid" : "list"}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[
                  styles.emptyText, 
                  { 
                    color: colors.text,
                    fontSize: isTV ? getFontSize(18) : 16
                  }
                ]}>
                  No channels found. Add a playlist in Settings.
                </Text>
              </View>
            }
            ListFooterComponent={<Footer />}
          />
        )}
      </ResponsiveLayout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});