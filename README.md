# Smart IPTV Viewer

A modern, cross-platform IPTV streaming application built with React Native and Expo. This app allows users to add and manage M3U playlists, browse channels by category, mark favorites, and enjoy a seamless streaming experience on mobile devices, tablets, TVs, and web browsers.

## Screenshots

<div align="center">

| ![Home](Screenshot_20250629-070450.png) | ![Categories](Screenshot_20250629-064420.png) | ![Channel List](Screenshot_20250629-064828.png) |
|:---:|:---:|:---:|
| ![Player](Screenshot_20250629-064907.png) | ![Favorites](Screenshot_20250629-064924.png) | ![Recently Watched](Screenshot_20250629-065117.png) |
| ![TV Mode](Screenshot_20250629-065146.png) | ![TV Navigation](Screenshot_20250629-065209.png) | ![Settings](Screenshot_20250629-065236.png) |
| ![Update](Screenshot_20250629-065249.png) | ![Web Preview](Screenshot_20250629-070647.png) |  |

</div>

## Features

- **M3U/M3U8 Playlist Support**: Add and manage multiple IPTV playlists
- **Automatic Updates**: Periodically check for playlist updates in the background
- **Category Browsing**: Browse channels organized by categories
- **Favorites**: Mark and access your favorite channels quickly
- **Recently Watched**: Continue watching from where you left off
- **Search**: Find channels by name or category
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized layouts for phones, tablets, TVs, and web browsers
- **Cross-Platform**: Works on iOS, Android, Android TV, Google TV, and web platforms

## TV Mode Features

- **D-pad Navigation**: Full support for TV remote navigation with directional focus management
- **Focus Indicators**: Visual highlights for the currently focused element
- **Optimized UI**: Larger text, buttons, and touch targets for TV viewing distance
- **TV Banner Support**: Proper Android TV/Google TV home screen integration
- **Remote-Friendly Controls**: Easy playback control with TV remote
- **Full-Screen Experience**: Landscape-optimized layouts that utilize the entire TV screen
- **Row-Based Navigation**: Intuitive horizontal and vertical navigation patterns
- **Accessibility**: High contrast elements and readable text at a distance
- **Google TV Support**: Enhanced detection and layout optimization for Google TV devices

## Web Support

- **Responsive Layout**: Automatically adapts to browser window size
- **Desktop Experience**: Enhanced layouts for larger screens
- **Consistent Design**: Maintains the same visual language across platforms
- **Development Mode**: Use the web version for quick testing before deploying to TV
- **TV Preview Mode**: Web browser can simulate TV layouts for easier development

## Responsive Design

The app features a fully responsive design that adapts to different screen sizes:

- **Mobile**: Optimized for portrait orientation with compact layouts
- **Tablet**: Enhanced layouts with multi-column grids and larger elements
- **TV/Desktop**: Full landscape experience with row-based navigation and optimized spacing
- **Adaptive Components**: UI elements that resize based on screen dimensions
- **Flexible Grids**: Dynamic column counts based on available space
- **Orientation Support**: Automatically adjusts layout for portrait and landscape modes

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/JehadurRE/smart-iptv-viewer.git
   cd smart-iptv-viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Run on your device or emulator:
   - Scan the QR code with the Expo Go app
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator
   - Press 'w' for web browser

## TV Development

For testing on Android TV or Google TV:

1. Build the Android APK:
   ```bash
   expo build:android -t apk
   ```

2. Install on your TV device:
   ```bash
   adb connect YOUR_TV_IP
   adb install app-release.apk
   ```

3. For TV emulator testing:
   ```bash
   # Start Android TV emulator
   emulator -avd Android_TV_1080p_API_30
   # Install and run
   adb install app-release.apk
   ```

4. Web-based TV testing:
   ```bash
   # Start web version for TV layout testing
   npm run start-web
   # Then resize browser window to TV aspect ratio (16:9)
   ```

## Usage

### Adding a Playlist

1. Navigate to the Settings tab
2. Tap "Add" in the Playlists section
3. Enter a name for your playlist (optional)
4. Enter the URL of your M3U playlist
5. Tap "Add Playlist"

### Watching Channels

1. Browse channels on the Home or Channels tab
2. Tap on a channel to start watching
3. Use the player controls to play/pause, adjust volume, or go fullscreen
4. Tap the heart icon to add to favorites

### TV Navigation

1. Use D-pad to navigate between elements (Up/Down/Left/Right)
2. Press Select/OK to activate buttons or play channels
3. Use Back button to return to previous screens
4. Player controls are optimized for remote navigation
5. Focus automatically moves to logical next elements

### Managing Playlists

1. Go to the Settings tab
2. View all your added playlists
3. Tap the refresh icon to update a specific playlist
4. Tap the trash icon to remove a playlist

### Customizing Update Settings

1. Go to Settings > Update Settings
2. Choose how often the app should check for playlist updates
3. Manually update all playlists by tapping "Update Now"

## Technical Details

### Architecture

- **React Native**: Core framework for building the mobile app
- **Expo**: Development platform and toolchain
- **Expo Router**: File-based routing similar to Next.js
- **Zustand**: State management with persistence
- **AsyncStorage**: Local storage for playlists and preferences
- **TV Focus Management**: Custom implementation for D-pad navigation

### Key Components

- **M3U Parser**: Custom utility for parsing M3U playlist files
- **Background Fetch**: Periodic playlist update mechanism
- **Video Player**: Built with Expo AV for streaming support
- **Theme Provider**: Context-based theming system
- **TV Focusable**: Component for TV remote navigation with focus management
- **Responsive Layout**: Adaptive layouts for different screen sizes
- **Platform Detection**: Utilities to optimize UI based on device type
- **Orientation Support**: Layout adjustments for portrait and landscape modes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

**JehadurRE**  
CyArm  
🇧🇩 🇵🇸

- GitHub: [https://github.com/JehadurRE](https://github.com/JehadurRE)
- Website: [https://www.jehadurre.me](https://www.jehadurre.me)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This app does not provide any IPTV content. It is a player for M3U playlists that you provide. The developers are not responsible for the content accessed through this application. Please ensure you have the right to access any content you stream.

---

© 2025 JehadurRE@CyArm 🇧🇩 🇵🇸