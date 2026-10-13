import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontFamily } from '@/constants/Fonts';
import { appIcons } from '@/services/utilities/appAssets';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

const ProfileHeader = ({ 
  title, 
  subtitle, 
  showBackButton = true, 
  rightElement,
  bgColor = '#16A34A',
  textColor = '#FFFFFF',
  gradientColors,
  children,
  layout = 'default',
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const HeaderContainer = gradientColors ? LinearGradient : View;
  const containerStyle = [
    styles.container, 
    { paddingTop: insets.top + heightPixel(12) },
    !gradientColors && { backgroundColor: bgColor }
  ];

  return (
    <HeaderContainer 
      colors={gradientColors} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={containerStyle}
    >
      <View style={[styles.topRow, layout === 'stacked' && styles.topRowStacked]}>
        {showBackButton ? (
          <TouchableOpacity 
            style={[styles.backBtn, layout === 'stacked' && styles.backBtnStacked]} 
            onPress={() => router.back()}
          >
            <Image 
              source={appIcons.backArrow} 
              style={styles.backIcon} 
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.backBtn2, layout === 'stacked' && styles.backBtnStacked]} 
            onPress={() => router.back()}
          >
            <Image 
              source={appIcons.leftWhiteChevron} 
              style={[styles.backIcon,{ width: widthPixel(20),
    height: widthPixel(20),}]} 
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        <View style={layout === 'stacked' ? styles.stackedTitleContainer : styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }, layout === 'stacked' && styles.titleStacked]}>{title}</Text>
        </View>
        <View style={styles.rightContainer}>
          {rightElement}
        </View>
      </View>
      {subtitle && (
        <Text style={[styles.subtitle, { color: 'rgba(255, 255, 255, 0.8)' }, layout === 'stacked' && styles.subtitleStacked]}>
          {subtitle}
        </Text>
      )}
      {children}
    </HeaderContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: heightPixel(24),
    paddingHorizontal: widthPixel(20),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: heightPixel(44),
  },
  topRowStacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  backBtn: {
    width: widthPixel(36),
    height: widthPixel(36),
    borderRadius: widthPixel(18),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
   backBtn2: {
    width: widthPixel(36),
    height: widthPixel(36),
    borderRadius: widthPixel(10),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnStacked: {
    marginBottom: heightPixel(16),
  },
  backIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
  },
  titleContainer: {
    flex: 1,
    marginLeft: widthPixel(12),
  },
  stackedTitleContainer: {
    width: '100%',
  },
  title: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(22),
  },
  titleStacked: {
    fontSize: fontPixel(24),
  },
  subtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    marginTop: heightPixel(4),
  },
  subtitleStacked: {
    marginTop: heightPixel(8),
  },
  rightContainer: {
    alignItems: 'flex-end',
    minWidth: widthPixel(40),
  },
});

export default ProfileHeader;
