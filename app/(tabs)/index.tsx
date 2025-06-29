import React, { useEffect, useCallback, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl, Platform, Dimensions } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { usePlaylistStore } from "@/store/playlist-store";
import { useRecentlyWatchedStore } from "@/store/recently-watched-store";
import { CategoryList } from "@/components/CategoryList";
import { ChannelCard } from "@/components/ChannelCard";
import { PlaylistStatus } from "@/components/PlaylistStatus";
import { Footer } from "@/components/Footer";
import { isTVDevice, isLargeScreen, getFontSize, getSpacing, getGridColumns, isGoogleTV } from "@/utils/tv-utils";
import { TVFocusable } from "@/components/TVFocusable";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { playlists, fetchPlaylists, loading, error } = usePlaylistStore();
  const { recentlyWatched } = useRecentlyWatchedStore();
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  
  const isTV = isTVDevice() || isGoogleTV();
  const isLarge = isLargeScreen();
  const isLandscape = dimensions.width > dimensions.height;

  // Listen for dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleRefresh = useCallback(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleChannelPress = (channelId: string) => {
    router.push(`/player?id=${channelId}`);
  };

  const allChannels = playlists.flatMap(playlist => playlist.channels || []);
  const featuredChannels = allChannels.slice(0, (isTV || isLarge) ? 15 : 10);
  const categories = [...new Set(allChannels.map(channel => channel.category))].slice(0, (isTV || isLarge) ? 8 : 5);

  // Render retry button based on platform
  const renderRetryButton = () => {
    if (isTV) {
      return (
        <TVFocusable
          style={[styles.retryButton, { backgroundColor: colors.primary, padding: getSpacing(16) }]}
          onPress={handleRefresh}
          isDefault={true}
        >
          <Text style={[styles.retryButtonText, { color: colors.white, fontSize: getFontSize(18) }]}>
            Retry
          </Text>
        </TVFocusable>
      );
    }

    return (
      <Pressable
        style={[styles.retryButton, { backgroundColor: colors.primary }]}
        onPress={handleRefresh}
      >
        <Text style={[styles.retryButtonText, { color: colors.white }]}>
          Retry
        </Text>
      </Pressable>
    );
  };

  // Adjust padding and layout for TV in landscape mode
  const contentStyle = [
    styles.content,
    (isTV || isLarge) && { padding: getSpacing(24) },
    isTV && isLandscape && { paddingHorizontal: getSpacing(40) }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ResponsiveLayout>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={contentStyle}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
        >
          <PlaylistStatus />

          {loading && !allChannels.length ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={isTV ? "large" : "large"} color={colors.primary} />
              <Text style={[
                styles.loadingText, 
                { 
                  color: colors.text,
                  fontSize: isTV ? getFontSize(18) : 16,
                  marginTop: isTV ? getSpacing(24) : 16
                }
              ]}>
                Loading channels...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={[
                styles.errorText, 
                { 
                  color: colors.error,
                  fontSize: isTV ? getFontSize(18) : 16
                }
              ]}>
                {error}
              </Text>
              {renderRetryButton()}
            </View>
          ) : (
            <>
              {recentlyWatched.length > 0 && (
                <View style={[styles.section, (isTV || isLarge) && { marginBottom: getSpacing(32) }]}>
                  <Text style={[
                    styles.sectionTitle, 
                    { 
                      color: colors.text,
                      fontSize: isTV ? getFontSize(24) : 20
                    }
                  ]}>
                    Continue Watching
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={[
                      styles.channelRow, 
                      (isTV || isLarge) && { gap: getSpacing(16) },
                      isTV && isLandscape && { paddingBottom: getSpacing(16) }
                    ]}>
                      {recentlyWatched.map((channelId, index) => {
                        const channel = allChannels.find(c => c.id === channelId);
                        if (!channel) return null;
                        return (
                          <ChannelCard
                            key={channel.id}
                            channel={channel}
                            onPress={() => handleChannelPress(channel.id)}
                            index={index}
                            rowIndex={0}
                          />
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              )}

              <View style={[styles.section, (isTV || isLarge) && { marginBottom: getSpacing(32) }]}>
                <Text style={[
                  styles.sectionTitle, 
                  { 
                    color: colors.text,
                    fontSize: isTV ? getFontSize(24) : 20
                  }
                ]}>
                  Featured Channels
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={[
                    styles.channelRow, 
                    (isTV || isLarge) && { gap: getSpacing(16) },
                    isTV && isLandscape && { paddingBottom: getSpacing(16) }
                  ]}>
                    {featuredChannels.map((channel, index) => (
                      <ChannelCard
                        key={channel.id}
                        channel={channel}
                        onPress={() => handleChannelPress(channel.id)}
                        index={index}
                        rowIndex={recentlyWatched.length > 0 ? 1 : 0}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>

              {categories.map((category, index) => (
                <CategoryList
                  key={category}
                  category={category}
                  channels={allChannels.filter(c => c.category === category).slice(0, (isTV || isLarge) ? 15 : 10)}
                  onChannelPress={handleChannelPress}
                  categoryIndex={index + (recentlyWatched.length > 0 ? 2 : 1)}
                />
              ))}
              
              <Footer />
            </>
          )}
        </ScrollView>
      </ResponsiveLayout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  channelRow: {
    flexDirection: "row",
    gap: 12,
  },
});