import { Channel } from "./channel";

export interface Playlist {
  id: string;
  name: string;
  url: string;
  channels: Channel[];
  lastUpdated: number;
}