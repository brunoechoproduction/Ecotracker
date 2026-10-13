import React, { memo } from 'react';
import { Image, StyleSheet, Text, View, Switch, ImageSourcePropType } from 'react-native';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

interface ToggleItemProps {
  icon: ImageSourcePropType;
  title: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  iconColor?: string;
  isLast?: boolean;
}

export const ToggleItem: React.FC<ToggleItemProps> = memo(({
  icon,
  title,
  value,
  onToggle,
  iconColor = '#16A34A',
  isLast = false,
}) => (
  <View style={[styles.settingItem, isLast && styles.noBorder]}>
    <View style={styles.settingLeft}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={[styles.settingIcon, { tintColor: iconColor }]} resizeMode="contain" />
      </View>
      <Text style={styles.settingTitle}>{title}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#E2E8F0', true: '#16A34A' }}
      thumbColor="#FFFFFF"
      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
    />
  </View>
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
});
