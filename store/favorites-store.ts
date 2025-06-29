import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (channelId: string) => void;
  addFavorite: (channelId: string) => void;
  removeFavorite: (channelId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: [],
      
      toggleFavorite: (channelId) => {
        set((state) => {
          if (state.favorites.includes(channelId)) {
            return {
              favorites: state.favorites.filter((id) => id !== channelId),
            };
          } else {
            return {
              favorites: [...state.favorites, channelId],
            };
          }
        });
      },
      
      addFavorite: (channelId) => {
        set((state) => {
          if (!state.favorites.includes(channelId)) {
            return {
              favorites: [...state.favorites, channelId],
            };
          }
          return state;
        });
      },
      
      removeFavorite: (channelId) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== channelId),
        }));
      },
    }),
    {
      name: "iptv-favorites",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);