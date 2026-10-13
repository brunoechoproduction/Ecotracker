import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import ParentWrapper from '@/components/ParentWrapper';
import CButton from '@/components/CButton';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, hp, widthPixel, wp } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';

import { useLocalSearchParams } from 'expo-router';

export default function UploadProofScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [image, setImage] = useState(null);
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  // Destructure and parse params
  const {
    attemptId,
    challengeId,
    title,
    points,
    xp,
    iconImg: iconImgRaw,
    proofs: proofsJson
  } = params;

  // Parse proofs from JSON string
  let proofs = [];
  if (proofsJson) {
    try {
      proofs = JSON.parse(proofsJson);
    } catch (e) {
      proofs = [];
    }
  }

  const requiresPhoto = proofs.includes('Photo');
  const requiresGPS = proofs.includes('GPS');
  const isSelfCheck = proofs.includes('Self-check') || proofs.includes('Self Check') || proofs.length === 0;

  // Resolve icon image
  const getIconSource = () => {
    if (iconImgRaw) {
      if (typeof iconImgRaw === 'number') return iconImgRaw;
      if (typeof iconImgRaw === 'string') {
        if (iconImgRaw.startsWith('http')) return { uri: iconImgRaw };
        const parsed = parseInt(iconImgRaw);
        if (!isNaN(parsed)) return parsed;
        return { uri: iconImgRaw };
      }
    }
    return appIcons.salad;
  };
  const iconSource = getIconSource();

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const buttonTitle = isSelfCheck ? "Confirm Completion" : "Submit for Verification";
  const buttonIcon = isSelfCheck ? appIcons.circleCheck : (requiresPhoto ? appIcons.camera : appIcons.gallery);
  const isSubmitDisabled = requiresPhoto && !image;

  return (
    <ParentWrapper style={{ backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.successBackground }]}
          onPress={() => router.back()}
        >
          <Image
            source={appIcons.backArrow}
            style={styles.backIcon}
            tintColor={colors.primary}
          />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { color: "#111827" }]}>Upload Proof</Text>
          <Text style={[styles.headerSubtitle, { color: "#6B7280" }]}>{title || 'Challenge'}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Upload Box */}
        <TouchableOpacity
          style={[
            styles.uploadBox,
            { backgroundColor: "#F0FDF4", borderColor: "#86EFAC" }
          ]}
          onPress={pickImage}
        >
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.selectedImage} />

              {/* Photo Ready Badge */}
              <View style={styles.photoReadyBadge}>
                <Image source={appIcons.circleCheck} style={styles.badgeIcon} tintColor={"#ffffff"} />
                <Text style={styles.badgeText}>Photo Ready</Text>
              </View>

              {/* Remove Button */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setImage(null)}
              >
                <Image source={appIcons.cross} style={styles.removeIcon} tintColor="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Image source={appIcons.imageUpload} style={styles.uploadIcon} />
              <Text style={[styles.uploadTitle, { color: "#111827" }]}>
                {requiresPhoto ? "Tap to Upload Photo" : "Tap to Upload Photo (Optional)"}
              </Text>
              <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>JPG, PNG or HEIC · Max 10MB</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.successBackground }]}
            onPress={pickImage}
          >
            <Image source={appIcons.gallery} style={styles.actionIcon} tintColor={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#EFF6FF' }]}
            onPress={takePhoto}
          >
            <Image source={appIcons.camera} style={styles.actionIcon} tintColor="#2563EB" />
            <Text style={[styles.actionText, { color: '#2563EB' }]}>Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Photo Tips */}
        <View style={[styles.tipsCard, { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }]}>
          <View style={styles.tipsHeader}>
            <Text style={[styles.tipsTitle, { color: colors.warningText }]}>📸 Photo Tips</Text>
          </View>
          <View style={styles.tipsList}>
            <Text style={[styles.tipItem, { color: colors.warningText }]}>• Ensure the photo is clear and well-lit</Text>
            <Text style={[styles.tipItem, { color: colors.warningText }]}>• Include context (location, activity, etc.)</Text>
            <Text style={[styles.tipItem, { color: colors.warningText }]}>• Our AI verifies authenticity automatically</Text>
          </View>
        </View>

        {/* Challenge Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: "#F9FAFB" }]}>
          <View style={[styles.summaryIconContainer, { backgroundColor: colors.background }]}>
            <Image source={iconSource} style={styles.summaryIcon} resizeMode="contain" />
          </View>
          <View>
            <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>{title || 'Challenge'}</Text>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>
              {points !== undefined ? `+${parseInt(points)} pts` : '0 pts'} • {xp !== undefined ? `+${parseInt(xp)} XP` : '0 XP'} on verification
            </Text>
          </View>
        </View>

        <View style={{ height: heightPixel(100) }} />
      </ScrollView>

      <CButton
        title={buttonTitle}
        icon={buttonIcon}
        disabled={isSubmitDisabled}
        onPress={() => {
          router.push({
            pathname: '/challenge/verifying',
            params: {
              attemptId,
              challengeId,
              image,
              requiresPhoto: requiresPhoto ? 'true' : 'false',
              requiresGPS: requiresGPS ? 'true' : 'false',
              isSelfCheck: isSelfCheck ? 'true' : 'false',
              title,
              points,
              xp
            }
          });
        }}
        style={styles.bottomButton}
      />
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(16),
    gap: widthPixel(16),
  },
  backButton: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: widthPixel(18),
    height: widthPixel(18),

  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(18),
  },
  headerSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    marginTop: heightPixel(2),
  },
  scrollContent: {
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(16),
  },
  uploadBox: {
    height: heightPixel(280),
    borderRadius: widthPixel(24),
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: widthPixel(20),
    overflow: 'hidden',
  },

  uploadIcon: {
    width: widthPixel(80),
    height: widthPixel(80),
    marginBottom: heightPixel(10),
  },
  uploadTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(16),
  },
  uploadSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    marginTop: heightPixel(6),
  },
  selectedImage: {
    width: wp(91),
    height: heightPixel(280),
    borderRadius: widthPixel(22),
    resizeMode: "cover",
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: heightPixel(0),
    left: widthPixel(0),
    width: widthPixel(32),
    height: widthPixel(32),
    borderRadius: widthPixel(16),
    backgroundColor: '#00000080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  photoReadyBadge: {
    position: 'absolute',
    top: heightPixel(0),
    right: 0,
    backgroundColor: '#00000080',
    flexDirection: 'row',
    alignItems: 'center',
    height: widthPixel(32),
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(20),
    gap: widthPixel(6),
  },
  badgeIcon: {
    width: widthPixel(16),
    height: widthPixel(16),
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(12),
  },
  actionRow: {
    flexDirection: 'row',
    gap: widthPixel(12),
    marginTop: heightPixel(20),
  },
  actionButton: {
    flex: 1,
    height: heightPixel(56),
    borderRadius: widthPixel(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: widthPixel(8),
  },
  actionIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
  },
  actionText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(14),
  },
  tipsCard: {
    borderRadius: widthPixel(20),
    padding: widthPixel(20),
    marginTop: heightPixel(24),
    borderWidth: 1,
  },
  tipsHeader: {
    marginBottom: heightPixel(12),
  },
  tipsTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
  },
  tipsList: {
    gap: heightPixel(6),
  },
  tipItem: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    lineHeight: fontPixel(20.4),
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: widthPixel(20),
    padding: widthPixel(16),
    marginTop: heightPixel(24),
    gap: widthPixel(16),
  },
  summaryIconContainer: {
    width: widthPixel(48),
    height: widthPixel(48),
    borderRadius: widthPixel(12),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  summaryIcon: {
    width: widthPixel(28),
    height: widthPixel(28),
  },
  summaryTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
  },
  summaryValue: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(12),
    marginTop: heightPixel(4),
  },
  bottomButton: {
    position: 'absolute',
    bottom: hp(4),
    left: 0,
    right: 0,
  },
});
