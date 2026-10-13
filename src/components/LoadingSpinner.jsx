import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CircleFade } from 'react-native-animated-spinkit';
import { heightPixel } from '@/services/utilities/appFontSizes';

export default function LoadingSpinner({ isVisible }) {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <CircleFade size={48} color="#16A34A" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: heightPixel(40),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  }
});
