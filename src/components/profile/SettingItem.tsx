import React, { memo } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { FontFamily } from '@/constants/Fonts';
import { appIcons } from '@/services/utilities/appAssets';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

interface SettingItemProps {
  icon: ImageSourcePropType;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  iconColor?: string;
  titleColor?: string;
  isLast?: boolean;
}

export const SettingItem: React.FC<SettingItemProps> = memo(({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  iconColor = '#16A34A',
  titleColor,
  isLast = false,
}) => (
  <TouchableOpacity
    style={[styles.settingItem, isLast && styles.noBorder]}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.settingLeft}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={[styles.settingIcon, { tintColor: iconColor }]} resizeMode="contain" />
      </View>
      <View>
        <Text style={[styles.settingTitle, titleColor ? { color: titleColor } : null]}>{title}</Text>
        {subtitle ? <Text style={styles.settingSubtitle}>{subtitle}</Text> : null}
      </View>
    </View>
    {showChevron && (
      <Image
        source={appIcons.chevronRight}
        style={styles.chevron}
        tintColor="#CBD5E1"
      />
    )}
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: widthPixel(16),
    backgroundColor: '#F9FAFB',
  },
  settingIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
  },
  settingTitle: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(14),
    color: '#111827',
  },
  settingSubtitle: {
    fontFamily: FontFamily.InterMedium,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    marginTop: heightPixel(2),
  },
  chevron: {
    width: widthPixel(15),
    height: widthPixel(15),
  },
});
