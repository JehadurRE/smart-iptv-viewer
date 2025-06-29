import React from "react";
import { StyleSheet, View, Text, ScrollView, Linking, Pressable } from "react-native";
import { useTheme } from "@/context/theme-context";
import { Image } from "expo-image";
import Constants from "expo-constants";
import { Github, Globe } from "lucide-react-native";
import { Footer } from "@/components/Footer";
import { isTVDevice, isLargeScreen, getFontSize, getSpacing } from "@/utils/tv-utils";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";

export default function AboutScreen() {
  const { colors } = useTheme();
  const appVersion = Constants.expoConfig?.version || "1.0.0";
  const isTV = isTVDevice();
  const isLarge = isLargeScreen();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ResponsiveLayout>
        <View style={[
          styles.header,
          (isTV || isLarge) && { paddingVertical: getSpacing(32) }
        ]}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={[
              styles.logo,
              (isTV || isLarge) && { width: 120, height: 120, borderRadius: 30 }
            ]}
          />
          <Text style={[
            styles.appName, 
            { 
              color: colors.text,
              fontSize: (isTV || isLarge) ? 32 : 24
            }
          ]}>
            Smart IPTV Viewer
          </Text>
          <Text style={[
            styles.version, 
            { 
              color: colors.textSecondary,
              fontSize: (isTV || isLarge) ? 18 : 14
            }
          ]}>
            Version {appVersion}
          </Text>
        </View>

        <View style={[
          styles.developerCard, 
          { 
            backgroundColor: colors.card,
            padding: (isTV || isLarge) ? getSpacing(24) : 16
          }
        ]}>
          <Image
            source={{ uri: "https://avatars.githubusercontent.com/u/88510650?v=4" }}
            style={[
              styles.developerImage,
              (isTV || isLarge) && { width: 100, height: 100, borderRadius: 50 }
            ]}
          />
          
          <View style={styles.developerInfo}>
            <Text style={[
              styles.developerName, 
              { 
                color: colors.text,
                fontSize: (isTV || isLarge) ? 24 : 18
              }
            ]}>
              JehadurRE
            </Text>
            
            <Text style={[
              styles.developerCompany, 
              { 
                color: colors.textSecondary,
                fontSize: (isTV || isLarge) ? 18 : 14
              }
            ]}>
              CyArm
            </Text>
            
            <View style={styles.flagContainer}>
              <Text style={[
                styles.flag,
                (isTV || isLarge) && { fontSize: 28 }
              ]}>
                🇧🇩
              </Text>
              <Text style={[
                styles.flag,
                (isTV || isLarge) && { fontSize: 28 }
              ]}>
                🇵🇸
              </Text>
            </View>
            
            <View style={styles.developerLinks}>
              <Pressable 
                style={[
                  styles.linkButton, 
                  { 
                    backgroundColor: colors.primary,
                    paddingVertical: (isTV || isLarge) ? 10 : 6,
                    paddingHorizontal: (isTV || isLarge) ? 16 : 12
                  }
                ]}
                onPress={() => handleOpenLink("https://github.com/JehadurRE")}
              >
                <Github size={(isTV || isLarge) ? 20 : 16} color={colors.white} style={styles.linkIcon} />
                <Text style={[
                  styles.linkText, 
                  { 
                    color: colors.white,
                    fontSize: (isTV || isLarge) ? 16 : 12
                  }
                ]}>
                  GitHub
                </Text>
              </Pressable>
              
              <Pressable 
                style={[
                  styles.linkButton, 
                  { 
                    backgroundColor: colors.primary,
                    paddingVertical: (isTV || isLarge) ? 10 : 6,
                    paddingHorizontal: (isTV || isLarge) ? 16 : 12
                  }
                ]}
                onPress={() => handleOpenLink("https://www.jehadurre.me")}
              >
                <Globe size={(isTV || isLarge) ? 20 : 16} color={colors.white} style={styles.linkIcon} />
                <Text style={[
                  styles.linkText, 
                  { 
                    color: colors.white,
                    fontSize: (isTV || isLarge) ? 16 : 12
                  }
                ]}>
                  Website
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={[
          styles.section,
          (isTV || isLarge) && { padding: getSpacing(24) }
        ]}>
          <Text style={[
            styles.sectionTitle, 
            { 
              color: colors.text,
              fontSize: (isTV || isLarge) ? 24 : 18
            }
          ]}>
            About
          </Text>
          <Text style={[
            styles.sectionText, 
            { 
              color: colors.textSecondary,
              fontSize: (isTV || isLarge) ? 18 : 14,
              lineHeight: (isTV || isLarge) ? 28 : 22
            }
          ]}>
            Smart IPTV Viewer is a modern, user-friendly application for watching IPTV channels on your device. 
            It supports standard M3U playlists and provides a seamless viewing experience.
          </Text>
        </View>

        <View style={[
          styles.section,
          (isTV || isLarge) && { padding: getSpacing(24) }
        ]}>
          <Text style={[
            styles.sectionTitle, 
            { 
              color: colors.text,
              fontSize: (isTV || isLarge) ? 24 : 18
            }
          ]}>
            Features
          </Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
              <Text style={[
                styles.featureText, 
                { 
                  color: colors.textSecondary,
                  fontSize: (isTV || isLarge) ? 18 : 14,
                  lineHeight: (isTV || isLarge) ? 28 : 20
                }
              ]}>
                Support for M3U and M3U8 playlists
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
              <Text style={[
                styles.featureText, 
                { 
                  color: colors.textSecondary,
                  fontSize: (isTV || isLarge) ? 18 : 14,
                  lineHeight: (isTV || isLarge) ? 28 : 20
                }
              ]}>
                Categorized channel browsing
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
              <Text style={[
                styles.featureText, 
                { 
                  color: colors.textSecondary,
                  fontSize: (isTV || isLarge) ? 18 : 14,
                  lineHeight: (isTV || isLarge) ? 28 : 20
                }
              ]}>
                Favorites and recently watched
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
              <Text style={[
                styles.featureText, 
                { 
                  color: colors.textSecondary,
                  fontSize: (isTV || isLarge) ? 18 : 14,
                  lineHeight: (isTV || isLarge) ? 28 : 20
                }
              ]}>
                Dark mode support
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
              <Text style={[
                styles.featureText, 
                { 
                  color: colors.textSecondary,
                  fontSize: (isTV || isLarge) ? 18 : 14,
                  lineHeight: (isTV || isLarge) ? 28 : 20
                }
              ]}>
                Automatic playlist updates
              </Text>
            </View>
          </View>
        </View>

        <View style={[
          styles.section,
          (isTV || isLarge) && { padding: getSpacing(24) }
        ]}>
          <Text style={[
            styles.sectionTitle, 
            { 
              color: colors.text,
              fontSize: (isTV || isLarge) ? 24 : 18
            }
          ]}>
            Disclaimer
          </Text>
          <Text style={[
            styles.sectionText, 
            { 
              color: colors.textSecondary,
              fontSize: (isTV || isLarge) ? 18 : 14,
              lineHeight: (isTV || isLarge) ? 28 : 22
            }
          ]}>
            This app does not provide any IPTV content. It is a player for M3U playlists that you provide. 
            The developers are not responsible for the content accessed through this application.
            Please ensure you have the right to access any content you stream.
          </Text>
        </View>

        <View style={[
          styles.section,
          (isTV || isLarge) && { padding: getSpacing(24) }
        ]}>
          <Text style={[
            styles.sectionTitle, 
            { 
              color: colors.text,
              fontSize: (isTV || isLarge) ? 24 : 18
            }
          ]}>
            Privacy
          </Text>
          <Text style={[
            styles.sectionText, 
            { 
              color: colors.textSecondary,
              fontSize: (isTV || isLarge) ? 18 : 14,
              lineHeight: (isTV || isLarge) ? 28 : 22
            }
          ]}>
            Smart IPTV Viewer respects your privacy. We do not collect or store any personal data. 
            All your playlists and preferences are stored locally on your device.
          </Text>
        </View>

        <Footer />
      </ResponsiveLayout>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
  },
  developerCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  developerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  developerInfo: {
    flex: 1,
  },
  developerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  developerCompany: {
    fontSize: 14,
    marginBottom: 8,
  },
  flagContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  developerLinks: {
    flexDirection: "row",
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  linkIcon: {
    marginRight: 4,
  },
  linkText: {
    fontSize: 12,
    fontWeight: "500",
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
  },
});