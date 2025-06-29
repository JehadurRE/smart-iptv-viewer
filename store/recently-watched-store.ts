import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RecentlyWatchedState {
  recentlyWatched: string[];
  addToRecentlyWatched: (channelId: string) => void;
  clearRecentlyWatched: () => void;
}

const MAX_RECENT_ITEMS = 10;

export const useRecentlyWatchedStore = create<RecentlyWatchedState>()(
  persist(
    (set) => ({
      recentlyWatched: [],
      
      addToRecentlyWatched: (channelId) => {
        set((state) => {
          // Remove the channel if it already exists in the list
          const filtered = state.recentlyWatched.filter((id) => id !== channelId);
          
          // Add the channel to the beginning of the list
          const updated = [channelId, ...filtered];
          
          // Limit the list to MAX_RECENT_ITEMS
          if (updated.length > MAX_RECENT_ITEMS) {
            return {
              recentlyWatched: updated.slice(0, MAX_RECENT_ITEMS),
            };
          }
          
          return {
            recentlyWatched: updated,
          };
        });
      },
      
      clearRecentlyWatched: () => {
        set({ recentlyWatched: [] });
      },
    }),
    {
      name: "iptv-recently-watched",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);