import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import { appIcons } from '@/services/utilities/appAssets';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Accordion = ({ title, children, isOpen, onPress }) => {
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={[styles.header, isOpen && styles.headerActive]} 
        onPress={onPress} 
        activeOpacity={0.7}
      >
        <Text style={[styles.title, isOpen && styles.titleActive]}>{title}</Text>
        <Image 
          source={appIcons.chevronRight} 
          style={[styles.chevron, isOpen && styles.chevronActive]} 
          tintColor={isOpen ? '#111827' : '#111827'} 
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.content}>
          <Text style={styles.contentText}>{children}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(20),
    marginBottom: heightPixel(12),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: widthPixel(20),
  },
  headerActive: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#111827',
    flex: 1,
  },
  titleActive: {
    color: '#111827',
  },
  chevron: {
    width: widthPixel(16),
    height: widthPixel(16),
    transform: [{ rotate: '90deg' }],
  },
  chevronActive: {
    transform: [{ rotate: '-90deg' }],
  },
  content: {
    padding: widthPixel(20),
    backgroundColor: '#FFFFFF',
  },
  contentText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    lineHeight: fontPixel(22),
    color: '#4B5563',
  },
});

export default Accordion;
