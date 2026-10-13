import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

const QuickActionCard = ({ icon, label, bgColor, iconColor,onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.iconWrapper}>
        <Image 
          source={icon} 
          style={[styles.icon, { tintColor: iconColor }]} 
          resizeMode="contain" 
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: heightPixel(105),
    borderRadius: widthPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
    gap: heightPixel(10),
    padding: widthPixel(12),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  iconWrapper: {
    width: widthPixel(46),
    height: widthPixel(46),
    borderRadius: widthPixel(23),
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  icon: {
    width: widthPixel(24),
    height: widthPixel(24),
  },
  label: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(12),
    color: '#374151',
    textAlign: 'center',
  },
});

export default QuickActionCard;
