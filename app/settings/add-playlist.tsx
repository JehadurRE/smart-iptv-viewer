import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { usePlaylistStore } from "@/store/playlist-store";
import { fetchM3uPlaylist } from "@/utils/m3u-parser";
import { Footer } from "@/components/Footer";
import { isTVDevice, isLargeScreen, getFontSize, getSpacing } from "@/utils/tv-utils";
import { TVFocusable } from "@/components/TVFocusable";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";

export default function AddPlaylistScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { addPlaylist } = usePlaylistStore();
  
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isTV = isTVDevice();
  const isLarge = isLargeScreen();
  
  const handleAddPlaylist = async () => {
    if (!url) {
      setError("Please enter a valid M3U playlist URL");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const playlist = await fetchM3uPlaylist(url, name);
      addPlaylist(playlist);
      router.back();
    } catch (err) {
      setError("Failed to load playlist. Please check the URL and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Render add button based on platform
  const renderAddButton = () => {
    if (isTV) {
      return (
        <TVFocusable
          style={[
            styles.addButton,
            { 
              backgroundColor: colors.primary,
              height: 60,
              opacity: loading ? 0.7 : 1
            }
          ]}
          onPress={handleAddPlaylist}
          disabled={loading}
          isDefault={true}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={[
              styles.addButtonText, 
              { 
                color: colors.white,
                fontSize: getFontSize(18)
              }
            ]}>
              Add Playlist
            </Text>
          )}
        </TVFocusable>
      );
    }

    return (
      <Pressable
        style={[
          styles.addButton,
          { 
            backgroundColor: colors.primary,
            height: isLarge ? 56 : 48
          },
          loading && { opacity: 0.7 }
        ]}
        onPress={handleAddPlaylist}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text style={[
            styles.addButtonText, 
            { 
              color: colors.white,
              fontSize: isLarge ? 18 : 16
            }
          ]}>
            Add Playlist
          </Text>
        )}
      </Pressable>
    );
  };
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.background,
        padding: (isTV || isLarge) ? getSpacing(24) : 16
      }
    ]}>
      <ResponsiveLayout>
        <View style={styles.form}>
          <Text style={[
            styles.label, 
            { 
              color: colors.text,
              fontSize: (isTV || isLarge) ? getFontSize(18) : 16,
              marginBottom: (isTV || isLarge) ? getSpacing(12) : 8
            }
          ]}>
            Playlist Name (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
                height: (isTV || isLarge) ? 60 : 48,
                fontSize: (isTV || isLarge) ? getFontSize(18) : 16,
                marginBottom: (isTV || isLarge) ? getSpacing(24) : 16
              }
            ]}
            placeholder="My IPTV Playlist"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          />
          
          <Text style={[
            styles.label, 
            { 
              color: colors.text,
              fontSize: (isTV || isLarge) ? getFontSize(18) : 16,
              marginBottom: (isTV || isLarge) ? getSpacing(12) : 8
            }
          ]}>
            M3U Playlist URL
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
                height: (isTV || isLarge) ? 60 : 48,
                fontSize: (isTV || isLarge) ? getFontSize(18) : 16,
                marginBottom: (isTV || isLarge) ? getSpacing(24) : 16
              }
            ]}
            placeholder="https://example.com/playlist.m3u"
            placeholderTextColor={colors.textSecondary}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            keyboardType="url"
          />
          
          {error && (
            <Text style={[
              styles.errorText, 
              { 
                color: colors.error,
                fontSize: (isTV || isLarge) ? getFontSize(16) : 14,
                marginBottom: (isTV || isLarge) ? getSpacing(24) : 16
              }
            ]}>
              {error}
            </Text>
          )}
          
          {renderAddButton()}
        </View>
        
        <View style={[
          styles.helpSection,
          (isTV || isLarge) && { marginTop: getSpacing(32) }
        ]}>
          <Text style={[
            styles.helpTitle, 
            { 
              color: colors.text,
              fontSize: (isTV || isLarge) ? getFontSize(20) : 18
            }
          ]}>
            How to add a playlist
          </Text>
          <Text style={[
            styles.helpText, 
            { 
              color: colors.textSecondary,
              fontSize: (isTV || isLarge) ? getFontSize(16) : 14
            }
          ]}>
            1. Enter a name for your playlist (optional)
          </Text>
          <Text style={[
            styles.helpText, 
            { 
              color: colors.textSecondary,
              fontSize: (isTV || isLarge) ? getFontSize(16) : 14
            }
          ]}>
            2. Enter the URL of your M3U playlist
          </Text>
          <Text style={[
            styles.helpText, 
            { 
              color: colors.textSecondary,
              fontSize: (isTV || isLarge) ? getFontSize(16) : 14
            }
          ]}>
            3. Tap "Add Playlist" to import your channels
          </Text>
          <Text style={[
            styles.helpNote, 
            { 
              color: colors.textSecondary,
              fontSize: (isTV || isLarge) ? getFontSize(16) : 14
            }
          ]}>
            Note: The app supports standard M3U and M3U8 playlists. Make sure your playlist URL is accessible.
          </Text>
        </View>
        
        <Footer />
      </ResponsiveLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
  addButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  helpSection: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    marginBottom: 8,
  },
  helpNote: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: "italic",
  },
});