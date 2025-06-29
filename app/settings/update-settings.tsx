import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, ActivityIndicator } from "react-native";
import { useTheme } from "@/context/theme-context";
import { 
  getUpdateInterval, 
  setUpdateInterval, 
  UPDATE_INTERVALS,
  performUpdate,
  getLastUpdateTime
} from "@/utils/background-fetch";
import { RefreshCw, Check } from "lucide-react-native";
import { Footer } from "@/components/Footer";
import { isTVDevice, isLargeScreen, getFontSize, getSpacing } from "@/utils/tv-utils";
import { TVFocusable } from "@/components/TVFocusable";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";

export default function UpdateSettingsScreen() {
  const { colors } = useTheme();
  const [selectedInterval, setSelectedInterval] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const isTV = isTVDevice();
  const isLarge = isLargeScreen();

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      const interval = await getUpdateInterval();
      const lastUpdate = await getLastUpdateTime();
      setSelectedInterval(interval);
      setLastUpdateTime(lastUpdate);
      setLoading(false);
    };

    loadSettings();
  }, []);

  const handleIntervalSelect = async (value: number) => {
    setSelectedInterval(value);
    await setUpdateInterval(value);
  };

  const handleManualUpdate = async () => {
    setUpdating(true);
    setUpdateSuccess(null);
    
    try {
      const success = await performUpdate();
      setUpdateSuccess(success);
      
      if (success) {
        // Refresh the last update time
        const lastUpdate = await getLastUpdateTime();
        setLastUpdateTime(lastUpdate);
      }
    } catch (error) {
      console.error("Manual update failed:", error);
      setUpdateSuccess(false);
    } finally {
      setUpdating(false);
    }
  };

  const formatLastUpdateTime = () => {
    if (!lastUpdateTime) {
      return "Never";
    }
    
    return new Date(lastUpdateTime).toLocaleString();
  };

  // Render interval option based on platform
  const renderIntervalOption = (interval: { label: string, value: number }, index: number) => {
    const isSelected = selectedInterval === interval.value;
    
    if (isTV) {
      return (
        <TVFocusable
          key={interval.value}
          style={[
            styles.intervalOption,
            { 
              backgroundColor: colors.card,
              padding: getSpacing(20)
            },
            isSelected && { borderColor: colors.primary, borderWidth: 2 }
          ]}
          onPress={() => handleIntervalSelect(interval.value)}
          nextFocusUp={index === 0 ? null : undefined}
          isDefault={index === 0}
        >
          <Text style={[
            styles.intervalLabel, 
            { 
              color: colors.text,
              fontSize: getFontSize(18)
            }
          ]}>
            {interval.label}
          </Text>
          {isSelected && (
            <Check size={24} color={colors.primary} />
          )}
        </TVFocusable>
      );
    }

    return (
      <Pressable
        key={interval.value}
        style={[
          styles.intervalOption,
          { 
            backgroundColor: colors.card,
            padding: isLarge ? 16 : 12
          },
          isSelected && { borderColor: colors.primary, borderWidth: 2 }
        ]}
        onPress={() => handleIntervalSelect(interval.value)}
      >
        <Text style={[
          styles.intervalLabel, 
          { 
            color: colors.text,
            fontSize: isLarge ? 18 : 16
          }
        ]}>
          {interval.label}
        </Text>
        {isSelected && (
          <Check size={isLarge ? 24 : 20} color={colors.primary} />
        )}
      </Pressable>
    );
  };

  // Render update button based on platform
  const renderUpdateButton = () => {
    if (isTV) {
      return (
        <TVFocusable
          style={[
            styles.updateButton, 
            { 
              backgroundColor: colors.primary,
              padding: getSpacing(16)
            }
          ]}
          onPress={handleManualUpdate}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <RefreshCw size={24} color={colors.white} style={styles.buttonIcon} />
              <Text style={[
                styles.updateButtonText, 
                { 
                  color: colors.white,
                  fontSize: getFontSize(18)
                }
              ]}>
                Update Now
              </Text>
            </>
          )}
        </TVFocusable>
      );
    }

    return (
      <Pressable
        style={[
          styles.updateButton, 
          { 
            backgroundColor: colors.primary,
            padding: isLarge ? 16 : 12
          }
        ]}
        onPress={handleManualUpdate}
        disabled={updating}
      >
        {updating ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <>
            <RefreshCw size={isLarge ? 24 : 20} color={colors.white} style={styles.buttonIcon} />
            <Text style={[
              styles.updateButtonText, 
              { 
                color: colors.white,
                fontSize: isLarge ? 18 : 16
              }
            ]}>
              Update Now
            </Text>
          </>
        )}
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={(isTV || isLarge) ? "large" : "large"} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.background,
        padding: (isTV || isLarge) ? getSpacing(24) : 16
      }
    ]}>
      <ResponsiveLayout>
        <View style={[styles.section, (isTV || isLarge) && { marginBottom: getSpacing(32) }]}>
          <Text style={[
            styles.sectionTitle, 
            { 
              color: colors.text,
              fontSize: (isTV || isLarge) ? getFontSize(22) : 18,
              marginBottom: (isTV || isLarge) ? getSpacing(16) : 8
            }
          ]}>
            Update Frequency
          </Text>
          <Text style={[
            styles.sectionDescription, 
            { 
              color: colors.textSecondary,
              fontSize: (isTV || isLarge) ? getFontSize(16) : 14,
              marginBottom: (isTV || isLarge) ? getSpacing(16) : 16
            }
          ]}>
            Choose how often the app should check for playlist updates
          </Text>
          
          {UPDATE_INTERVALS.map((interval, index) => renderIntervalOption(interval, index))}
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle, 
            { 
              color: colors.text,
              fontSize: (isTV || isLarge) ? getFontSize(22) : 18,
              marginBottom: (isTV || isLarge) ? getSpacing(8) : 8
            }
          ]}>
            Manual Update
          </Text>
          <Text style={[
            styles.sectionDescription, 
            { 
              color: colors.textSecondary,
              fontSize: (isTV || isLarge) ? getFontSize(16) : 14,
              marginBottom: (isTV || isLarge) ? getSpacing(16) : 16
            }
          ]}>
            Last checked: {formatLastUpdateTime()}
          </Text>
          
          {renderUpdateButton()}
          
          {updateSuccess !== null && (
            <Text 
              style={[
                styles.updateStatus, 
                { 
                  color: updateSuccess ? colors.success : colors.error,
                  fontSize: (isTV || isLarge) ? getFontSize(16) : 14,
                  marginTop: (isTV || isLarge) ? getSpacing(16) : 16
                }
              ]}
            >
              {updateSuccess 
                ? "Playlists updated successfully!" 
                : "Failed to update playlists. Please try again."}
            </Text>
          )}
        </View>
        
        <Footer />
      </ResponsiveLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  intervalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  intervalLabel: {
    fontSize: 16,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  updateStatus: {
    marginTop: 16,
    fontSize: 14,
    textAlign: "center",
  },
});