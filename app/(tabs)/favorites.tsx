import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { usePlaylistStore } from "@/store/playlist-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { ChannelListItem } from "@/components/ChannelListItem";
import { Heart } from "lucide-react-native";
import { Footer } from "@/components/Footer";
import { isTVDevice, isLargeScreen, getFontSize, getSpacing } from "@/utils/tv-utils";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { playlists } = usePlaylistStore();
  const { favorites } = useFavoritesStore();
  const isTV = isTVDevice();
  const isLarge = isLargeScreen();

  const allChannels = playlists.flatMap(playlist => playlist.channels || []);
  const favoriteChannels = allChannels.filter(channel => favorites.includes(channel.id));

  const handleChannelPress = (channelId: string) => {
    router.push(`/player?id=${channelId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <ResponsiveLayout>
        <FlatList
          data={favoriteChannels}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <ChannelListItem
              channel={item}
              onPress={() => handleChannelPress(item.id)}
              isFavorite={true}
              index={index}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            (isTV || isLarge) && { padding: getSpacing(24) }
          ]}
          numColumns={isLarge ? 2 : 1}
          key={isLarge ? "grid" : "list"}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Heart size={(isTV || isLarge) ? 64 : 48} color={colors.textSecondary} />
              <Text style={[
                styles.emptyTitle, 
                { 
                  color: colors.text,
                  fontSize: (isTV || isLarge) ? getFontSize(24) : 20,
                  marginTop: (isTV || isLarge) ? getSpacing(24) : 16
                }
              ]}>
                No favorites yet
              </Text>
              <Text style={[
                styles.emptyText, 
                { 
                  color: colors.textSecondary,
                  fontSize: (isTV || isLarge) ? getFontSize(18) : 16,
                  maxWidth: (isTV || isLarge) ? 500 : 300
                }
              ]}>
                Add channels to your favorites by tapping the heart icon while watching.
              </Text>
            </View>
          }
          ListFooterComponent={<Footer />}
        />
      </ResponsiveLayout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    maxWidth: 300,
  },
});