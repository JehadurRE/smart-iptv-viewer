import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePlaylistStore } from "@/store/playlist-store";

// Keys for storing update settings
const LAST_UPDATE_CHECK_KEY = "last_update_check";
const UPDATE_INTERVAL_KEY = "update_interval";

// Default update interval in minutes (6 hours)
export const DEFAULT_UPDATE_INTERVAL = 360;

// Update intervals in minutes for settings
export const UPDATE_INTERVALS = [
  { label: "1 hour", value: 60 },
  { label: "6 hours", value: 360 },
  { label: "12 hours", value: 720 },
  { label: "24 hours", value: 1440 },
  { label: "Manual only", value: 0 },
];

export async function setupBackgroundFetch() {
  if (Platform.OS === "web") {
    console.log("Background fetch not supported on web");
    return;
  }
  
  // Check if we need to update on app start
  await checkForUpdatesIfNeeded();
  
  // Set up a periodic check
  // This is a simplified version since we can't use actual background fetch in Expo without ejecting
  setInterval(async () => {
    await checkForUpdatesIfNeeded();
  }, 15 * 60 * 1000); // Check every 15 minutes if an update is needed
}

export async function checkForUpdatesIfNeeded(): Promise<boolean> {
  try {
    // Get the last update time and interval setting
    const lastUpdateTimeStr = await AsyncStorage.getItem(LAST_UPDATE_CHECK_KEY);
    const updateIntervalStr = await AsyncStorage.getItem(UPDATE_INTERVAL_KEY);
    
    const lastUpdateTime = lastUpdateTimeStr ? parseInt(lastUpdateTimeStr) : 0;
    const updateInterval = updateIntervalStr 
      ? parseInt(updateIntervalStr) 
      : DEFAULT_UPDATE_INTERVAL;
    
    // If update interval is 0, only manual updates are allowed
    if (updateInterval === 0) {
      return false;
    }
    
    const now = Date.now();
    const minutesSinceLastUpdate = (now - lastUpdateTime) / (1000 * 60);
    
    // Check if it's time to update
    if (minutesSinceLastUpdate >= updateInterval) {
      return await performUpdate();
    }
    
    return false;
  } catch (error) {
    console.error("Error checking for updates:", error);
    return false;
  }
}

export async function performUpdate(): Promise<boolean> {
  try {
    const { fetchPlaylists } = usePlaylistStore.getState();
    await fetchPlaylists();
    
    // Update the last check time
    await AsyncStorage.setItem(LAST_UPDATE_CHECK_KEY, Date.now().toString());
    return true;
  } catch (error) {
    console.error("Failed to update playlists:", error);
    return false;
  }
}

export async function getLastUpdateTime(): Promise<number> {
  try {
    const lastUpdateTimeStr = await AsyncStorage.getItem(LAST_UPDATE_CHECK_KEY);
    return lastUpdateTimeStr ? parseInt(lastUpdateTimeStr) : 0;
  } catch (error) {
    console.error("Error getting last update time:", error);
    return 0;
  }
}

export async function getUpdateInterval(): Promise<number> {
  try {
    const updateIntervalStr = await AsyncStorage.getItem(UPDATE_INTERVAL_KEY);
    return updateIntervalStr ? parseInt(updateIntervalStr) : DEFAULT_UPDATE_INTERVAL;
  } catch (error) {
    console.error("Error getting update interval:", error);
    return DEFAULT_UPDATE_INTERVAL;
  }
}

export async function setUpdateInterval(minutes: number): Promise<void> {
  try {
    await AsyncStorage.setItem(UPDATE_INTERVAL_KEY, minutes.toString());
  } catch (error) {
    console.error("Error setting update interval:", error);
  }
}