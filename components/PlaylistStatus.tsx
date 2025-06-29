import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { usePlaylistStore } from "@/store/playlist-store";
import { AlertCircle, Plus } from "lucide-react-native";

export function PlaylistStatus() {
  const router = useRouter();
  const { colors } = useTheme();
  const { playlists } = usePlaylistStore();

  const handleAddPlaylist = () => {
    router.push("/settings/add-playlist");
  };

  if (playlists.length > 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <AlertCircle size={24} color={colors.primary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            No playlists found
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Add an M3U playlist to start watching channels
          </Text>
        </View>
      </View>
      <Pressable
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={handleAddPlaylist}
      >
        <Plus size={16} color={colors.white} />
        <Text style={[styles.addButtonText, { color: colors.white }]}>
          Add Playlist
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});