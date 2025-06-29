import React from "react";
import { StyleSheet, View, Text, ScrollView, Switch, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { usePlaylistStore } from "@/store/playlist-store";
import { 
  Plus, 
  Moon, 
  Sun, 
  Trash2, 
  RefreshCw, 
  Info, 
  ChevronRight,
  Clock
} from "lucide-react-native";
import { Footer } from "@/components/Footer";
import { isTVDevice, isLargeScreen, getFontSize, getSpacing } from "@/utils/tv-utils";
import { TVFocusable } from "@/components/TVFocusable";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { playlists, removePlaylist, fetchPlaylists, loading } = usePlaylistStore();
  const isDarkMode = theme === "dark";
  const isTV = isTVDevice();
  const isLarge = isLargeScreen();

  const { colors } = useTheme();

  const handleAddPlaylist = () => {
    router.push("/settings/add-playlist");
  };

  const handleAbout = () => {
    router.push("/settings/about");
  };

  const handleUpdateSettings = () => {
    router.push("/settings/update-settings");
  };

  // Render buttons based on platform
  const renderAddButton = () => {
    if (isTV) {
      return (
        <TVFocusable
          style={[
            styles.addButton, 
            { 
              backgroundColor: colors.primary,
              padding: getSpacing(12)
            }
          ]}
          onPress={handleAddPlaylist}
          nextFocusUp={null} // First row, no up navigation
        >
          <Plus size={20} color={colors.white} />
          <Text style={[
            styles.addButtonText, 
            { 
              color: colors.white,
              fontSize: getFontSize(16),
              marginLeft: getSpacing(8)
            }
          ]}>
            Add
          </Text>
        </TVFocusable>
      );
    }

    return (
      <Pressable
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={handleAddPlaylist}
      >
        <Plus size={isLarge ? 20 : 16} color={colors.white} />
        <Text style={[
          styles.addButtonText, 
          { 
            color: colors.white,
            fontSize: isLarge ? 16 : 14
          }
        ]}>
          Add
        </Text>
      </Pressable>
    );
  };

  const renderMenuButton = (icon: React.ReactNode, text: string, onPress: () => void, index: number) => {
    if (isTV) {
      return (
        <TVFocusable
          style={[
            styles.menuButton, 
            { 
              backgroundColor: colors.card,
              padding: getSpacing(20)
            }
          ]}
          onPress={onPress}
          nextFocusUp={index === 0 ? null : undefined}
        >
          <View style={styles.menuContent}>
            {icon}
            <Text style={[
              styles.settingText, 
              { 
                color: colors.text,
                fontSize: getFontSize(18),
                marginLeft: getSpacing(16)
              }
            ]}>
              {text}
            </Text>
          </View>
          <ChevronRight size={24} color={colors.textSecondary} />
        </TVFocusable>
      );
    }

    return (
      <Pressable 
        style={[styles.menuButton, { backgroundColor: colors.card }]}
        onPress={onPress}
      >
        <View style={styles.menuContent}>
          {icon}
          <Text style={[
            styles.settingText, 
            { 
              color: colors.text,
              fontSize: isLarge ? 18 : 16
            }
          ]}>
            {text}
          </Text>
        </View>
        <ChevronRight size={isLarge ? 24 : 20} color={colors.textSecondary} />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <ResponsiveLayout>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={(isTV || isLarge) ? { padding: getSpacing(16) } : undefined}
        >
          <View style={[styles.section, (isTV || isLarge) && { marginBottom: getSpacing(32) }]}>
            <Text style={[
              styles.sectionTitle, 
              { 
                color: colors.text,
                fontSize: (isTV || isLarge) ? getFontSize(22) : 18,
                marginBottom: (isTV || isLarge) ? getSpacing(16) : 12
              }
            ]}>
              Appearance
            </Text>
            
            {isTV ? (
              <TVFocusable
                style={[
                  styles.settingItem, 
                  { 
                    backgroundColor: colors.card,
                    padding: getSpacing(20)
                  }
                ]}
                onPress={toggleTheme}
                isDefault={true}
              >
                <View style={styles.settingContent}>
                  {isDarkMode ? (
                    <Moon size={24} color={colors.text} style={styles.settingIcon} />
                  ) : (
                    <Sun size={24} color={colors.text} style={styles.settingIcon} />
                  )}
                  <Text style={[
                    styles.settingText, 
                    { 
                      color: colors.text,
                      fontSize: getFontSize(18)
                    }
                  ]}>
                    Dark Mode: {isDarkMode ? "On" : "Off"}
                  </Text>
                </View>
              </TVFocusable>
            ) : (
              <View style={[
                styles.settingItem, 
                { 
                  backgroundColor: colors.card,
                  padding: isLarge ? 20 : 16
                }
              ]}>
                <View style={styles.settingContent}>
                  {isDarkMode ? (
                    <Moon size={isLarge ? 24 : 20} color={colors.text} style={styles.settingIcon} />
                  ) : (
                    <Sun size={isLarge ? 24 : 20} color={colors.text} style={styles.settingIcon} />
                  )}
                  <Text style={[
                    styles.settingText, 
                    { 
                      color: colors.text,
                      fontSize: isLarge ? 18 : 16
                    }
                  ]}>
                    Dark Mode
                  </Text>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
            )}
          </View>

          <View style={[styles.section, (isTV || isLarge) && { marginBottom: getSpacing(32) }]}>
            <View style={styles.sectionHeader}>
              <Text style={[
                styles.sectionTitle, 
                { 
                  color: colors.text,
                  fontSize: (isTV || isLarge) ? getFontSize(22) : 18
                }
              ]}>
                Playlists
              </Text>
              {renderAddButton()}
            </View>

            {playlists.length === 0 ? (
              <View style={[
                styles.emptyPlaylists, 
                { 
                  backgroundColor: colors.card,
                  padding: (isTV || isLarge) ? getSpacing(24) : 16
                }
              ]}>
                <Text style={[
                  styles.emptyPlaylistsText, 
                  { 
                    color: colors.textSecondary,
                    fontSize: (isTV || isLarge) ? getFontSize(18) : 14
                  }
                ]}>
                  No playlists added yet. Add your first M3U playlist.
                </Text>
              </View>
            ) : (
              playlists.map((playlist, index) => {
                if (isTV) {
                  return (
                    <View 
                      key={playlist.id} 
                      style={[
                        styles.playlistItem, 
                        { 
                          backgroundColor: colors.card,
                          padding: getSpacing(20),
                          marginBottom: getSpacing(16)
                        }
                      ]}
                    >
                      <View style={styles.playlistInfo}>
                        <Text style={[
                          styles.playlistName, 
                          { 
                            color: colors.text,
                            fontSize: getFontSize(18)
                          }
                        ]}>
                          {playlist.name || "Unnamed Playlist"}
                        </Text>
                        <Text style={[
                          styles.playlistUrl, 
                          { 
                            color: colors.textSecondary,
                            fontSize: getFontSize(16)
                          }
                        ]}>
                          {playlist.url}
                        </Text>
                        <Text style={[
                          styles.playlistStats, 
                          { 
                            color: colors.textSecondary,
                            fontSize: getFontSize(14)
                          }
                        ]}>
                          {playlist.channels?.length || 0} channels • Last updated: {
                            playlist.lastUpdated 
                              ? new Date(playlist.lastUpdated).toLocaleString() 
                              : "Never"
                          }
                        </Text>
                      </View>
                      <View style={styles.playlistActions}>
                        <TVFocusable 
                          style={[styles.playlistAction, { padding: getSpacing(12) }]}
                          onPress={() => fetchPlaylists(playlist.id)}
                          disabled={loading}
                        >
                          <RefreshCw 
                            size={24} 
                            color={loading ? colors.textSecondary : colors.primary} 
                          />
                        </TVFocusable>
                        <TVFocusable 
                          style={[styles.playlistAction, { padding: getSpacing(12) }]}
                          onPress={() => removePlaylist(playlist.id)}
                        >
                          <Trash2 size={24} color={colors.error} />
                        </TVFocusable>
                      </View>
                    </View>
                  );
                }

                return (
                  <View 
                    key={playlist.id} 
                    style={[
                      styles.playlistItem, 
                      { 
                        backgroundColor: colors.card,
                        padding: isLarge ? 20 : 16
                      },
                      index === playlists.length - 1 && styles.lastItem
                    ]}
                  >
                    <View style={styles.playlistInfo}>
                      <Text style={[
                        styles.playlistName, 
                        { 
                          color: colors.text,
                          fontSize: isLarge ? 18 : 16
                        }
                      ]}>
                        {playlist.name || "Unnamed Playlist"}
                      </Text>
                      <Text style={[
                        styles.playlistUrl, 
                        { 
                          color: colors.textSecondary,
                          fontSize: isLarge ? 16 : 14
                        }
                      ]}>
                        {playlist.url}
                      </Text>
                      <Text style={[
                        styles.playlistStats, 
                        { 
                          color: colors.textSecondary,
                          fontSize: isLarge ? 14 : 12
                        }
                      ]}>
                        {playlist.channels?.length || 0} channels • Last updated: {
                          playlist.lastUpdated 
                            ? new Date(playlist.lastUpdated).toLocaleString() 
                            : "Never"
                        }
                      </Text>
                    </View>
                    <View style={styles.playlistActions}>
                      <Pressable 
                        style={styles.playlistAction}
                        onPress={() => fetchPlaylists(playlist.id)}
                        disabled={loading}
                      >
                        <RefreshCw 
                          size={isLarge ? 24 : 20} 
                          color={loading ? colors.textSecondary : colors.primary} 
                        />
                      </Pressable>
                      <Pressable 
                        style={styles.playlistAction}
                        onPress={() => removePlaylist(playlist.id)}
                      >
                        <Trash2 size={isLarge ? 24 : 20} color={colors.error} />
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {renderMenuButton(
            <Clock size={(isTV || isLarge) ? 24 : 20} color={colors.text} style={styles.settingIcon} />,
            "Update Settings",
            handleUpdateSettings,
            0
          )}

          {renderMenuButton(
            <Info size={(isTV || isLarge) ? 24 : 20} color={colors.text} style={styles.settingIcon} />,
            "About",
            handleAbout,
            1
          )}
          
          <Footer />
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  emptyPlaylists: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  emptyPlaylistsText: {
    fontSize: 14,
    textAlign: "center",
  },
  playlistItem: {
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  },
  lastItem: {
    marginBottom: 0,
  },
  playlistInfo: {
    flex: 1,
    marginBottom: 8,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  playlistUrl: {
    fontSize: 14,
    marginBottom: 4,
  },
  playlistStats: {
    fontSize: 12,
  },
  playlistActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  playlistAction: {
    padding: 8,
    marginLeft: 8,
  },
  menuButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});