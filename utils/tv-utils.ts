import { Platform, Dimensions } from "react-native";

export function isTVDevice(): boolean {
  // Check if running on a TV device
  if (Platform.isTV) {
    return true;
  }
  
  // Additional check for Android TV/Google TV
  if (Platform.OS === "android") {
    const { width, height } = Dimensions.get("window");
    // Most TV screens are large and have specific aspect ratios
    // This is a simple heuristic that can be improved
    return width >= 960 && height >= 540;
  }
  
  return false;
}

export function isLargeScreen(): boolean {
  const { width, height } = Dimensions.get("window");
  // Consider large screens to be tablets, TVs, or desktop browsers
  return width >= 768;
}

export function isLandscapeMode(): boolean {
  const { width, height } = Dimensions.get("window");
  return width > height;
}

export function isGoogleTV(): boolean {
  // More aggressive detection for Google TV
  if (Platform.OS === "android" && Platform.isTV) {
    return true;
  }
  
  // Additional heuristics for Google TV
  if (Platform.OS === "android") {
    const { width, height } = Dimensions.get("window");
    // Google TV typically has 16:9 aspect ratio and large screen
    const aspectRatio = width / height;
    return (width >= 1280 && aspectRatio >= 1.7 && aspectRatio <= 1.8);
  }
  
  return false;
}

export function isLeanbackSupported(): boolean {
  return Platform.OS === "android" && (isTVDevice() || isGoogleTV());
}

export function getTVFocusProperties(isDefault: boolean = false) {
  if (isTVDevice() || isGoogleTV()) {
    return {
      hasTVPreferredFocus: isDefault,
      tvParallaxProperties: { enabled: false },
      accessible: true,
      accessibilityRole: "button",
    };
  }
  return {};
}

// TV-specific styles
export const tvStyles = {
  // Larger focus ring for TV navigation
  focusRing: {
    borderWidth: 3,
    borderColor: "#4361ee",
    borderRadius: 8,
  },
  
  // Larger text for TV viewing distance
  text: {
    fontSize: 18,
  },
  
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  
  // Larger touch targets for remote navigation
  touchable: {
    minHeight: 60,
    minWidth: 60,
    padding: 16,
    margin: 8,
  },
  
  // Card styles optimized for TV
  card: {
    padding: 16,
    margin: 12,
    borderRadius: 8,
  },
};

// Helper to get appropriate styles based on platform
export function getPlatformStyles(tvStyle: any, mobileStyle: any) {
  return isTVDevice() || isGoogleTV() ? tvStyle : mobileStyle;
}

// Calculate appropriate font size based on platform
export function getFontSize(baseFontSize: number): number {
  return isTVDevice() || isGoogleTV() || isLargeScreen() ? baseFontSize * 1.5 : baseFontSize;
}

// Calculate appropriate spacing based on platform
export function getSpacing(baseSpacing: number): number {
  return isTVDevice() || isGoogleTV() || isLargeScreen() ? baseSpacing * 1.5 : baseSpacing;
}

// Get grid column count based on screen size
export function getGridColumns(): number {
  const { width } = Dimensions.get("window");
  
  if (width >= 1600) return 6; // Very large TV or desktop
  if (width >= 1200) return 5; // Large TV or desktop
  if (width >= 900) return 4;  // Medium TV or desktop
  if (width >= 600) return 3;  // Small TV or tablet
  return 2;                    // Mobile
}

// Get content max width for centered layouts on large screens
export function getContentMaxWidth(): number {
  const { width } = Dimensions.get("window");
  
  if (width >= 1600) return 1400;
  if (width >= 1200) return 1100;
  if (width >= 900) return 800;
  
  // On smaller screens, use full width
  return width;
}

// Get appropriate layout direction based on screen size
export function getLayoutDirection(): "row" | "column" {
  return isLargeScreen() || isTVDevice() || isGoogleTV() ? "row" : "column";
}