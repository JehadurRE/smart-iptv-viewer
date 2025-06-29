import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Playlist } from "@/types/playlist";
import { fetchM3uPlaylist } from "@/utils/m3u-parser";

interface PlaylistState {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
  addPlaylist: (playlist: Playlist) => void;
  removePlaylist: (id: string) => void;
  fetchPlaylists: (playlistId?: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      playlists: [],
      loading: false,
      error: null,
      
      addPlaylist: (playlist) => {
        set((state) => ({
          playlists: [...state.playlists, playlist],
        }));
      },
      
      removePlaylist: (id) => {
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== id),
        }));
      },
      
      fetchPlaylists: async (playlistId) => {
        set({ loading: true, error: null });
        
        try {
          const { playlists } = get();
          
          if (playlistId) {
            // Update a specific playlist
            const playlist = playlists.find((p) => p.id === playlistId);
            if (playlist) {
              const updatedPlaylist = await fetchM3uPlaylist(playlist.url, playlist.name);
              set((state) => ({
                playlists: state.playlists.map((p) =>
                  p.id === playlistId ? updatedPlaylist : p
                ),
                loading: false,
              }));
            }
          } else {
            // Update all playlists
            const updatedPlaylists = await Promise.all(
              playlists.map(async (playlist) => {
                try {
                  return await fetchM3uPlaylist(playlist.url, playlist.name);
                } catch (error) {
                  console.error(`Failed to update playlist ${playlist.id}:`, error);
                  return playlist;
                }
              })
            );
            
            set({ playlists: updatedPlaylists, loading: false });
          }
        } catch (error) {
          console.error("Error fetching playlists:", error);
          set({ 
            error: "Failed to fetch playlists. Please try again later.",
            loading: false 
          });
        }
      },
    }),
    {
      name: "iptv-playlists",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);