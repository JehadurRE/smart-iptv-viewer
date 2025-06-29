import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Pressable, 
  StyleSheet, 
  ViewStyle, 
  PressableProps,
  findNodeHandle
} from "react-native";
import { isTVDevice, isGoogleTV } from "@/utils/tv-utils";

interface TVFocusableProps extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle;
  focusedStyle?: ViewStyle;
  isDefault?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  nextFocusDown?: number | null | undefined;
  nextFocusUp?: number | null | undefined;
  nextFocusLeft?: number | null | undefined;
  nextFocusRight?: number | null | undefined;
}

export function TVFocusable({
  children,
  style,
  focusedStyle,
  isDefault = false,
  onFocus,
  onBlur,
  nextFocusDown,
  nextFocusUp,
  nextFocusLeft,
  nextFocusRight,
  ...props
}: TVFocusableProps) {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);
  const isTV = isTVDevice() || isGoogleTV();
  
  useEffect(() => {
    if (isTV && isDefault) {
      // Request focus for this element if it's the default
      const tag = findNodeHandle(ref.current);
      if (tag) {
        setTimeout(() => {
          try {
            // @ts-ignore - This is a TV-specific API
            ref.current?.requestTVFocus();
          } catch (e) {
            console.log("Failed to request TV focus", e);
          }
        }, 100);
      }
    }
  }, [isDefault, isTV]);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  // TV-specific props
  const tvProps = isTV 
    ? {
        hasTVPreferredFocus: isDefault,
        tvParallaxProperties: { enabled: false },
        nextFocusDown,
        nextFocusUp,
        nextFocusLeft,
        nextFocusRight,
      } 
    : {};

  return (
    <Pressable
      ref={ref}
      {...props}
      {...tvProps}
      style={[
        styles.container,
        style,
        isFocused && styles.focused,
        isFocused && focusedStyle,
      ]}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  focused: {
    borderWidth: 3,
    borderColor: "#4361ee",
  },
});