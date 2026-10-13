import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontFamily } from '@/constants/Fonts';
import { useAppTheme } from '@/context/ThemeContext';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';
import CButton from '@/components/CButton';

export default function EcoStayMapRedirectingScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* World Icon */}
        <View style={styles.worldIconContainer}>
          <View style={styles.worldIconBg}>
            <Image 
              source={appIcons.globe} 
              style={styles.worldIcon} 
           
            />
          </View>
        </View>

        {/* Text Section */}
        <Text style={styles.title}>You're Being Redirected!</Text>
        <Text style={styles.subtitle}>
          The official booking page has been opened in your browser.
        </Text>

        {/* Info Card */}
        <LinearGradient
          colors={['#F0FDF4', '#DCFCE7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.infoCard}
        >
          <View style={styles.infoTitleRow}>
            <Image source={appIcons.leave} style={styles.leafIcon} tintColor="#16A34A" />
            <Text style={styles.infoTitle}>Don't forget your EcoPoints!</Text>
          </View>
 
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNumber}>1</Text></View>
            <Text style={styles.stepText}>Complete your booking externally</Text>
          </View>
 
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNumber}>2</Text></View>
            <Text style={styles.stepText}>After check-in, come back here</Text>
          </View>
 
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNumber}>3</Text></View>
            <Text style={styles.stepText}>Upload your booking confirmation</Text>
          </View>
 
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNumber}>4</Text></View>
            <Text style={styles.stepText}>Get +180 EcoMiles, +200 XP & 🌱×3 trees!</Text>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <CButton 
            title="Upload Stay Proof Later"
            icon={appIcons.upload}
         
          
            onPress={() => router.replace('/(tabs)/')}
            style={{ paddingHorizontal: 0, borderRadius: widthPixel(10) }}
          />

          <CButton 
            variant="ghost"
            title="Back to Home"
            onPress={() => router.replace('/(tabs)/')}
            style={{ 
              paddingHorizontal: 0, 
              paddingVertical: 0,
              height: heightPixel(56),
              borderColor: "#E5E7EB", 
              borderWidth: 1, 
              borderRadius: widthPixel(10), 
              backgroundColor: "#F9FAFB",
            }}
            textStyle={{ color: '#374151' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: widthPixel(24),
    paddingTop: heightPixel(80),
  },
  worldIconContainer: {
    marginBottom: heightPixel(25),
  },
  worldIconBg: {
    width: widthPixel(100),
    height: widthPixel(100),
    borderRadius: widthPixel(50),
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#DCFCE7',
  },
  worldIcon: {
    width: widthPixel(50),
    height: widthPixel(50),
  },
  title: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(22),
    color: '#111827',
    textAlign: 'center',
    marginBottom: heightPixel(12),
  },
  subtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: heightPixel(22),
    paddingHorizontal: widthPixel(20),
    marginBottom: heightPixel(30),
  },
  infoCard: {
    width: '100%',
    borderRadius: widthPixel(20),
    padding: widthPixel(20),
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: heightPixel(30),
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
    marginBottom: heightPixel(20),
  },
  leafIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
  },
  infoTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(13),
    color: '#166534',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(12),
    marginBottom: heightPixel(16),
  },
  stepBadge: {
    width: widthPixel(24),
    height: widthPixel(24),
    borderRadius: widthPixel(12),
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(10),
    color: '#FFFFFF',
  },
  stepText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(12),
    color: '#166534',
  },
  buttonContainer: {
    width: '100%',
    gap: heightPixel(12),
  },
});
