import { Channel } from "@/types/channel";
import { Playlist } from "@/types/playlist";

export async function fetchM3uPlaylist(url: string, name?: string): Promise<Playlist> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.status} ${response.statusText}`);
    }
    
    const content = await response.text();
    const channels = parseM3u(content);
    
    return {
      id: generateId(),
      name: name || extractPlaylistName(url) || "My Playlist",
      url,
      channels,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error("Error fetching M3U playlist:", error);
    throw error;
  }
}

function parseM3u(content: string): Channel[] {
  const lines = content.split("\n");
  const channels: Channel[] = [];
  
  if (!lines[0].includes("#EXTM3U")) {
    throw new Error("Invalid M3U format");
  }
  
  let currentChannel: Partial<Channel> | null = null;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith("#EXTINF:")) {
      // Parse channel info
      currentChannel = parseExtInf(line);
    } else if (line && !line.startsWith("#") && currentChannel) {
      // This is a URL line
      currentChannel.url = line;
      currentChannel.id = generateId();
      
      // Ensure category exists
      if (!currentChannel.category) {
        currentChannel.category = "Uncategorized";
      }
      
      channels.push(currentChannel as Channel);
      currentChannel = null;
    } else if (line.startsWith("#EXTGRP:") && currentChannel) {
      // Parse group
      const group = line.substring(8).trim();
      currentChannel.category = group;
    }
  }
  
  return channels;
}

function parseExtInf(line: string): Partial<Channel> {
  const channel: Partial<Channel> = {
    name: "",
    category: "Uncategorized",
  };
  
  // Extract channel name
  const nameMatch = line.match(/,(.+)$/);
  if (nameMatch && nameMatch[1]) {
    channel.name = nameMatch[1].trim();
  }
  
  // Extract attributes
  const attrRegex = /([a-zA-Z0-9-]+)="([^"]*)"/g;
  let match;
  
  while ((match = attrRegex.exec(line)) !== null) {
    const [, key, value] = match;
    
    switch (key.toLowerCase()) {
      case "tvg-logo":
      case "logo":
        channel.logo = value;
        break;
      case "group-title":
        channel.category = value || "Uncategorized";
        break;
      case "tvg-id":
        channel.tvgId = value;
        break;
      case "tvg-name":
        channel.tvgName = value;
        break;
    }
  }
  
  return channel;
}

function extractPlaylistName(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const filename = pathParts[pathParts.length - 1];
    
    if (filename) {
      // Remove extension and replace underscores/hyphens with spaces
      return filename
        .replace(/\.(m3u|m3u8)$/i, "")
        .replace(/[_-]/g, " ")
        .trim();
    }
    
    return urlObj.hostname;
  } catch (error) {
    return null;
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}