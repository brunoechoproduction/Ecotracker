import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import ParentWrapper from '@/components/ParentWrapper';
import CButton from '@/components/CButton';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel, hp, wp } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';

import { useLocalSearchParams } from 'expo-router';
import { useUserStreak } from '@/hooks/useSystem';
import { useInterstitialAd } from '@/components/ads/useInterstitialAd';
import { useClaimChallengeReward } from '@/hooks/useChallenges';
import { useAuth } from '@/context/AuthContext';

export default function ChallengeCompletedScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { points, xp, attemptId } = params;
  const { user, updateUser } = useAuth();
  const claimRewardMutation = useClaimChallengeReward();

  const { data: streakResponse } = useUserStreak();
  const currentStreak = streakResponse?.data?.stats?.currentStreak;

  const { showAd } = useInterstitialAd();

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);
  return (
    <ParentWrapper style={{ backgroundColor: colors.successBackground }}>
      <View style={styles.container}>
       
          <Image source={appIcons.challengeComplete} style={styles.completeIcon} />
     

        <Text style={[styles.title, { color: "#14532D" }]}>Challenge Completed! 🥳</Text>
        <Text style={[styles.subtitle, { color: "#166534" }]}>
          Your proof has been verified by our AI. Amazing work on making a difference!
        </Text>

        <View style={[styles.statsCard, { backgroundColor: colors.background }]}>
          <View style={styles.statItem}>
            <Image source={appIcons.star} style={styles.statIcon} />
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {points !== undefined ? `+${points}` : '+50'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Points</Text>
          </View>
          
          <View style={styles.statItem}>
            <Image source={appIcons.purpleThunder} style={styles.statIcon} tintColor={colors.warning} />
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {xp !== undefined ? `+${xp}` : '+120'}
            </Text>
            <Text style={[styles.statLabel, { color: "#6B7280" }]}>XP</Text>
          </View>
          
          <View style={styles.statItem}>
            <Image source={appIcons.fire} style={styles.statIcon} />
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {currentStreak !== undefined ? `${currentStreak}d` : '12d'}
            </Text>
            <Text style={[styles.statLabel, { color: "#6B7280" }]}>Streak</Text>
          </View>
        </View>

        <View style={{ height: heightPixel(20) }} />
        
        <CButton 
          title="Collect Reward" 
          icon={appIcons.gift}
          loading={claimRewardMutation.isPending}
          disabled={claimRewardMutation.isPending}
          onPress={() => {
            if (attemptId) {
              claimRewardMutation.mutate(attemptId, {
                onSuccess: (res) => {
                  if (res?.data?.user && user) {
                    updateUser({
                      ...user,
                      points: res.data.user.points,
                      xp: res.data.user.xp,
                      currentStreak: res.data.user.currentStreak,
                      longestStreak: res.data.user.longestStreak,
                    });
                  }
                  showAd(() => router.replace('/(tabs)'));
                },
                onError: (err) => {
                  console.error("Error claiming reward:", err);
                  alert(err.message || "Failed to claim reward.");
                  showAd(() => router.replace('/(tabs)'));
                }
              });
            } else {
              showAd(() => router.replace('/(tabs)'));
            }
          }}
          containerStyle={[styles.collectButton, { backgroundColor: colors.primary }]}
          textStyle={styles.collectButtonText}
        />

        <TouchableOpacity 
          style={styles.backLink}
          onPress={() => {
            showAd(() => router.replace('/(tabs)'));
          }}
        >
          <Text style={[styles.backText, { color: "#16A34A" }]}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthPixel(20),
  },
  iconCircle: {
    
   
   
  },
  completeIcon: {
    width: widthPixel(180),
    height: widthPixel(180),
    
  },
  title: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(26),
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    marginTop: heightPixel(5),
    textAlign: 'center',
    lineHeight: fontPixel(24),
   
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: widthPixel(24),
    padding: widthPixel(24),
    marginTop: heightPixel(20),
    width: '100%',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
    marginBottom: heightPixel(8),
  },
  statValue: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(18),
  },
  statLabel: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    marginTop: heightPixel(4),
  },
  collectButton: {
    height: heightPixel(60),
    borderRadius: widthPixel(16),
  width:wp(90),
  alignSelf:'center'
  },
  collectButtonText: {
    fontSize: fontPixel(18),
  },
  backLink: {
    marginTop: heightPixel(20),
  },
  backText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(14),
  },
});
