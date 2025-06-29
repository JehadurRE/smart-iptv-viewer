import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Pressable, ActivityIndicator, Platform, BackHandler, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/theme-context";
import { usePlaylistStore } from "@/store/playlist-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { useRecentlyWatchedStore } from "@/store/recently-watched-store";
import { 
  ArrowLeft, 
  Heart, 
  Maximize2, 
  Minimize2, 
  Pause, 
  Play, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { isTVDevice, isLargeScreen, isGoogleTV } from "@/utils/tv-utils";
import { TVFocusable } from "@/components/TVFocusable";

export default function PlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { playlists } = usePlaylistStore();
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { addToRecentlyWatched } = useRecentlyWatchedStore();
  
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [controlsVisible, setControlsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  
  const allChannels = playlists.flatMap(playlist => playlist.channels || []);
  const channel = allChannels.find(c => c.id === id);
  
  const isFavorite = favorites.includes(id || "");
  const isTV = isTVDevice() || isGoogleTV();
  const isLarge = isLargeScreen();
  const isLandscape = dimensions.width > dimensions.height;
  
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Listen for dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (id) {
      addToRecentlyWatched(id);
    }
    
    // Handle back button on Android/TV
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (controlsVisible) {
        router.back();
        return true;
      } else {
        showControls();
        return true;
      }
    });
    
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
      backHandler.remove();
    };
  }, [id, addToRecentlyWatched, controlsVisible]);

  const hideControlsWithDelay = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    // On TV, keep controls visible longer
    const delay = isTV ? 5000 : 3000;
    
    controlsTimeout.current = setTimeout(() => {
      setControlsVisible(false);
    }, delay);
  };

  const showControls = () => {
    setControlsVisible(true);
    hideControlsWithDelay();
  };

  const handlePlaybackStatusUpdate = (playbackStatus: any) => {
    setStatus(playbackStatus);
    
    if (playbackStatus.isLoaded) {
      setLoading(false);
      setError(null);
    } else if (playbackStatus.error) {
      setError("An error occurred while playing this stream.");
      setLoading(false);
    }
  };

  const handleError = () => {
    setError("Failed to load the stream. Please try again later.");
    setLoading(false);
  };

  const togglePlayPause = async () => {
    if (status.isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
    showControls();
  };

  const toggleMute = async () => {
    setMuted(!muted);
    await videoRef.current?.setIsMutedAsync(!muted);
    showControls();
  };

  const handleBack = () => {
    router.back();
  };

  const handleFavoriteToggle = () => {
    if (id) {
      toggleFavorite(id);
      showControls();
    }
  };

  const handleFullscreen = async () => {
    if (Platform.OS !== "web") {
      if (isFullscreen) {
        // Exit fullscreen
        setIsFullscreen(false);
      } else {
        // Enter fullscreen
        if (videoRef.current) {
          await videoRef.current.presentFullscreenPlayer();
          setIsFullscreen(true);
        }
      }
    }
    showControls();
  };

  // Render control button based on platform
  const renderControlButton = (
    icon: React.ReactNode, 
    onPress: () => void, 
    isFirst: boolean = false,
    isLast: boolean = false
  ) => {
    if (isTV) {
      return (
        <TVFocusable
          style={styles.controlButton}
          onPress={onPress}
          nextFocusUp={null}
          nextFocusLeft={isFirst ? null : undefined}
          nextFocusRight={isLast ? null : undefined}
        >
          {icon}
        </TVFocusable>
      );
    }

    return (
      <Pressable style={styles.controlButton} onPress={onPress}>
        {icon}
      </Pressable>
    );
  };

  if (!channel) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Channel not found</Text>
        {isTV ? (
          <TVFocusable
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={handleBack}
            isDefault={true}
          >
            <Text style={[styles.backButtonText, { color: colors.white }]}>Go Back</Text>
          </TVFocusable>
        ) : (
          <Pressable
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={handleBack}
          >
            <Text style={[styles.backButtonText, { color: colors.white }]}>Go Back</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // For TV and large screens, use a different layout
  const videoContainerStyle = (isTV || (isLarge && isLandscape)) 
    ? { ...styles.videoContainer, width: "100%", height: "100%" }
    : styles.videoContainer;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar hidden />
      
      <Pressable style={videoContainerStyle} onPress={showControls}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: channel.url }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={handleError}
          isMuted={muted}
          useNativeControls={isTV}
        />
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size={isTV ? "large" : "large"} color={colors.white} />
            <Text style={[
              styles.loadingText, 
              { fontSize: isTV ? 20 : 16 }
            ]}>
              Loading stream...
            </Text>
          </View>
        )}
        
        {error && (
          <View style={styles.errorOverlay}>
            <Text style={[
              styles.errorText, 
              { fontSize: isTV ? 20 : 16 }
            ]}>
              {error}
            </Text>
            {isTV ? (
              <TVFocusable
                style={[styles.retryButton, { backgroundColor: colors.primary, padding: 16 }]}
                onPress={() => {
                  setLoading(true);
                  setError(null);
                  videoRef.current?.loadAsync({ uri: channel.url }, {}, true);
                }}
                isDefault={true}
              >
                <Text style={[styles.retryButtonText, { fontSize: 18 }]}>Retry</Text>
              </TVFocusable>
            ) : (
              <Pressable
                style={[styles.retryButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setLoading(true);
                  setError(null);
                  videoRef.current?.loadAsync({ uri: channel.url }, {}, true);
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            )}
          </View>
        )}
        
        {controlsVisible && (
          <View style={styles.controlsContainer}>
            <LinearGradient
              colors={["rgba(0,0,0,0.7)", "transparent"]}
              style={styles.topGradient}
            >
              <SafeAreaView edges={["top"]} style={styles.topControls}>
                {isTV ? (
                  <TVFocusable 
                    onPress={handleBack} 
                    style={styles.backButtonControl}
                    isDefault={true}
                  >
                    <ArrowLeft size={28} color={colors.white} />
                  </TVFocusable>
                ) : (
                  <Pressable onPress={handleBack} style={styles.backButtonControl}>
                    <ArrowLeft size={24} color={colors.white} />
                  </Pressable>
                )}
                
                <Text 
                  style={[
                    styles.channelTitle, 
                    { fontSize: isTV ? 24 : (isLarge ? 20 : 18) }
                  ]} 
                  numberOfLines={1}
                >
                  {channel.name}
                </Text>
                
                {isTV ? (
                  <TVFocusable onPress={handleFavoriteToggle} style={styles.favoriteButton}>
                    <Heart
                      size={28}
                      color={colors.white}
                      fill={isFavorite ? colors.white : "none"}
                    />
                  </TVFocusable>
                ) : (
                  <Pressable onPress={handleFavoriteToggle} style={styles.favoriteButton}>
                    <Heart
                      size={isLarge ? 28 : 24}
                      color={colors.white}
                      fill={isFavorite ? colors.white : "none"}
                    />
                  </Pressable>
                )}
              </SafeAreaView>
            </LinearGradient>
            
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.bottomGradient}
            >
              <SafeAreaView edges={["bottom"]} style={styles.bottomControls}>
                <View style={styles.playbackControls}>
                  {renderControlButton(
                    status.isPlaying ? (
                      <Pause size={isTV ? 36 : (isLarge ? 32 : 28)} color={colors.white} />
                    ) : (
                      <Play size={isTV ? 36 : (isLarge ? 32 : 28)} color={colors.white} />
                    ),
                    togglePlayPause,
                    true
                  )}
                  
                  {renderControlButton(
                    muted ? (
                      <VolumeX size={isTV ? 28 : (isLarge ? 26 : 24)} color={colors.white} />
                    ) : (
                      <Volume2 size={isTV ? 28 : (isLarge ? 26 : 24)} color={colors.white} />
                    ),
                    toggleMute
                  )}
                  
                  <View style={styles.spacer} />
                  
                  {renderControlButton(
                    isFullscreen ? (
                      <Minimize2 size={isTV ? 28 : (isLarge ? 26 : 24)} color={colors.white} />
                    ) : (
                      <Maximize2 size={isTV ? 28 : (isLarge ? 26 : 24)} color={colors.white} />
                    ),
                    handleFullscreen,
                    false,
                    true
                  )}
                </View>
              </SafeAreaView>
            </LinearGradient>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  loadingText: {
    color: "#fff",
    marginTop: 16,
    fontSize: 16,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topGradient: {
    height: 100,
  },
  bottomGradient: {
    height: 100,
    justifyContent: "flex-end",
  },
  topControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButtonControl: {
    padding: 8,
  },
  channelTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
  },
  favoriteButton: {
    padding: 8,
  },
  bottomControls: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  playbackControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    padding: 12,
  },
  spacer: {
    flex: 1,
  },
});