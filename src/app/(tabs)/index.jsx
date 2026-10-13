import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import HomeHeader from '@/components/home/HomeHeader';
import DashboardCard from '@/components/home/DashboardCard';
import ChallengeCard from '@/components/home/ChallengeCard';
import QuickActionCard from '@/components/home/QuickActionCard';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';
import { useHomeDashboard, useUserStreak } from '@/hooks/useSystem';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { getUserLevelInfo } from '@/services/utilities/levels';
import BannerAd from '@/components/ads/BannerAd';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: dashboardData, isLoading, refetch } = useHomeDashboard();
  const { data: streakResponse, isLoading: isStreakLoading, refetch: refetchStreak } = useUserStreak();
  const stats = streakResponse?.data;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetch(), refetchStreak()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Derive top-level summary data based on the API responses
  const summaryData = {
    streak: user?.currentStreak ?? stats?.currentStreak ?? 0,
    treesPlanted: Math.floor((user?.xp ?? stats?.xp ?? 0) / 1000), // example metric
    co2Saved: ((user?.points ?? stats?.points ?? 0) * 0.5).toFixed(1), // example metric
  };

  const todaysChallenges = dashboardData?.data?.todaysChallenges || [];

  const { currentLevel } = getUserLevelInfo(user?.xp || stats?.xp || 0);

  const cardStats = {
    ecoScore: user?.ecoScore ?? stats?.ecoScore ?? user?.points ?? stats?.points ?? 0,
    points: user?.points ?? stats?.points ?? 0,
    xp: user?.xp ?? stats?.xp ?? 0,
    streak: user?.currentStreak ?? stats?.currentStreak ?? 0,
    level: currentLevel.level
  };

  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('food') || cat.includes('diet') || cat.includes('salad')) return appIcons.salad;
    if (cat.includes('waste') || cat.includes('recycle')) return appIcons.recycle;
    if (cat.includes('transport') || cat.includes('bike') || cat.includes('car')) return appIcons.bicycle;
    if (cat.includes('energy') || cat.includes('solar')) return appIcons.solar;
    if (cat.includes('nature') || cat.includes('tree')) return appIcons.tree;
    if (cat.includes('beach')) return appIcons.beach;
    if (cat.includes('heart')) return appIcons.greenHeart;
    if (cat.includes('resort')) return appIcons.greenResort;
    if (cat.includes('village')) return appIcons.village;
    return appIcons.doubleLeaf;
  };

  return (
    <ParentWrapper>
      <HomeHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#16A34A" />
        }
      >
        <DashboardCard stats={cardStats} />

        {/* Today's Challenges Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Challenges</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/challenges')}
            style={styles.seeAllContainer}
          >
            <Text style={styles.seeAll}>See all</Text>
            <Image
              source={appIcons.chevronRight}
              style={styles.seeAllChevron}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {isLoading && !isRefreshing && todaysChallenges.length === 0 ? (
          <LoadingSpinner isVisible={true} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.challengesScroll}
          >
            {todaysChallenges.map((item) => {
              const challenge = item.challenge;
              const attemptStatus = item.status || 'not_started';

              let buttonText = 'Start';
              let buttonColor = '#16A34A'; // default green

              if (attemptStatus === 'started' || attemptStatus === 'continue') {
                buttonText = 'Continue';
                buttonColor = '#2563EB'; // blue
              } else if (attemptStatus === 'completed') {
                buttonText = 'Completed';
                buttonColor = '#16A34A'; // green
              } else if (attemptStatus === 'pending') {
                buttonText = 'Pending';
                buttonColor = '#F59E0B'; // orange
              } else if (attemptStatus === 'failed') {
                buttonText = 'Try Again';
                buttonColor = '#EF4444'; // red
              }

              return (
                <ChallengeCard
                  key={challenge._id}
                  icon={challenge.image ? { uri: challenge.image } : getCategoryIcon(challenge.category)}
                  title={challenge.title}
                  points={`+${challenge.points}pts`}
                  timeLeft={challenge.endTime}
                  buttonText={buttonText}
                  buttonColor={buttonColor}
                  onPress={() => router.push({
                    pathname: '/challenge/details',
                    params: {
                      id: challenge._id,
                      title: challenge.title,
                      points: `+${challenge.points}pts`,
                      xp: `+${challenge.xp}XP`,
                      category: challenge.category || 'Environmental',
                      difficulty: challenge.difficulty || 'Easy',
                      proofs: JSON.stringify(challenge.selfCheck ? ['Self-check'] : challenge.isGPS ? ['GPS'] : ['Photo']),
                      description: challenge.description
                    }
                  })}
                />
              );
            })}
          </ScrollView>
        )}

        {/* Quick Actions Section */}
        <Text style={[styles.sectionTitle, styles.paddedTitle]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            icon={appIcons.purpleThunder}
            label="Challenges"
            bgColor="#EEF2FF"
            iconColor="#6366F1"
            onPress={() => router.push('/(tabs)/challenges')}
          />
          <QuickActionCard
            icon={appIcons.building}
            label="Eco Stays"
            bgColor="#FFF7ED"
            iconColor="#F59E0B"
            onPress={() => router.push('/eco-stays')}
          />
          <QuickActionCard
            icon={appIcons.pin}
            label="Eco Map"
            bgColor="#F0FDF4"
            iconColor="#16A34A"
            onPress={() => router.push('/(tabs)/map')}
          />
        </View>

        {/* Streak Banner */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.streakContainer}
          onPress={() => router.push('/(tabs)/profile/streak')}
        >
          <LinearGradient
            colors={['#FEF3C7', '#FDE68A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.streakBanner}
          >
            <View style={styles.streakLeft}>
              <Image source={appIcons.fire} style={styles.fireIcon} />
              <View>
                <Text style={styles.streakTitle}>{user?.currentStreak ?? stats?.currentStreak ?? 0} Day Streak!</Text>
                <Text style={styles.streakSubtitle}>Keep it going — keep the planet healthy</Text>
              </View>
            </View>
            <Image
              source={appIcons.chevronRight}
              style={styles.streakChevron}
              resizeMode="contain"
            />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: heightPixel(20) }} />
        <BannerAd />
        <View style={{ height: heightPixel(20) }} />
      </ScrollView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: heightPixel(40),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthPixel(20),
    marginTop: heightPixel(28),
    marginBottom: heightPixel(16),
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(16),
    color: '#111827',
  },
  seeAll: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(13),
    color: '#16A34A',
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(2),
  },
  seeAllChevron: {
    width: widthPixel(16),
    height: widthPixel(16),
    tintColor: '#16A34A',
  },
  challengesScroll: {
    paddingLeft: widthPixel(20),
    paddingRight: widthPixel(4),
  },
  paddedTitle: {
    paddingHorizontal: widthPixel(20),
    marginTop: heightPixel(28),
    marginBottom: heightPixel(16),
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: widthPixel(20),
    gap: widthPixel(12),
  },
  streakContainer: {
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(24),
  },
  streakBanner: {
    borderRadius: widthPixel(20),
    padding: widthPixel(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(12),
  },
  fireIcon: {
    width: widthPixel(32),
    height: widthPixel(32),
  },
  streakTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
    color: '#92400E',
  },
  streakSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#B45309',
    marginTop: heightPixel(2),
  },
  streakChevron: {
    width: widthPixel(16),
    height: widthPixel(16),
    tintColor: '#92400E',
  },
});
