import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { FontFamily } from '@/constants/Fonts';
import { appIcons } from '@/services/utilities/appAssets';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { useMyAttempts } from '@/hooks/useChallenges';
import LoadingSpinner from '@/components/LoadingSpinner';

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

const CompletedChallengeItem = ({ icon, title, rewards, status, statusColor, statusBg, onPress }) => (
  <TouchableOpacity style={styles.completedItem} onPress={onPress}>
    <View style={styles.completedLeft}>
      <View style={styles.completedIconBg}>
        <Image source={icon} style={styles.completedIcon} resizeMode="contain" />
      </View>
      <View style={styles.completedInfo}>
        <Text style={styles.completedTitle}>{title}</Text>
        <Text style={styles.completedRewards}>{rewards}</Text>
      </View>
    </View>
    <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
      <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
    </View>
  </TouchableOpacity>
);

export default function CompletedChallengesScreen() {
  const router = useRouter();

  const { data: attemptsResponse, isLoading: isAttemptsLoading, refetch: refetchAttempts } = useMyAttempts();
  const attempts = attemptsResponse?.data?.attempts || [];

  const completedAttempts = React.useMemo(() => {
    return attempts.filter(
      (attempt) => attempt.status === 'completed' || attempt.status === 'pending'
    );
  }, [attempts]);

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchAttempts();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <ParentWrapper disableTopPadding={true}>
      <ProfileHeader title="Completed Challenges" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#16A34A" />
        }
      >
        <View style={styles.content}>
          {isAttemptsLoading && !isRefreshing && completedAttempts.length === 0 ? (
            <LoadingSpinner isVisible={true} />
          ) : completedAttempts.length === 0 ? (
            <View style={{ paddingVertical: heightPixel(40), alignItems: 'center' }}>
              <Text style={{ fontFamily: FontFamily.InterMedium, color: '#9CA3AF', fontSize: fontPixel(14) }}>
                No completed challenges yet
              </Text>
            </View>
          ) : (
            <View style={styles.completedContainer}>
              {completedAttempts.map((attempt) => {
                const challenge = attempt.challenge || (typeof attempt.challengeId === 'object' ? attempt.challengeId : {});
                const title = challenge.title || 'Challenge';
                const points = attempt.status === 'completed' ? (attempt.pointsEarned ?? challenge.points ?? 0) : (challenge.points ?? 0);
                const xp = attempt.status === 'completed' ? (attempt.xpEarned ?? challenge.xp ?? 0) : (challenge.xp ?? 0);
                const isPending = attempt.status === 'pending';
                const isFailed = attempt.status === 'failed';

                return (
                  <CompletedChallengeItem
                    key={attempt._id}
                    icon={challenge.image ? { uri: challenge.image } : getCategoryIcon(challenge.category)}
                    title={title}
                    rewards={`+${points}pts +${xp}XP`}
                    status={isFailed ? "❌ Failed" : isPending ? "⌛ Pending" : "✓ Done"}
                    statusColor={isFailed ? "#EF4444" : isPending ? "#D97706" : "#16A34A"}
                    statusBg={isFailed ? "#FEE2E2" : isPending ? "#FEF3C7" : "#DCFCE7"}
                    onPress={() => router.push({
                      pathname: '/challenge/details',
                      params: {
                        id: challenge._id,
                        title: title,
                        points: `+${points}pts`,
                        xp: `+${xp}XP`,
                        category: challenge.category || 'Environmental',
                        difficulty: challenge.difficulty || 'Easy',
                        proofs: JSON.stringify(challenge.selfCheck ? ['Self-check'] : challenge.isGPS ? ['GPS'] : ['Photo']),
                        description: challenge.description
                      }
                    })}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: heightPixel(40),
  },
  content: {
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(24),
  },
  completedContainer: {
    gap: heightPixel(12),
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: widthPixel(12),
    borderRadius: widthPixel(16),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  completedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  completedIconBg: {
    width: widthPixel(48),
    height: widthPixel(48),
    borderRadius: widthPixel(12),
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: widthPixel(12),
  },
  completedIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
  },
  completedInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  completedTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#111827',
    marginBottom: heightPixel(4),
  },
  completedRewards: {
    fontFamily: FontFamily.InterMedium,
    fontSize: fontPixel(12),
    color: '#16A34A',
  },
  statusBadge: {
    paddingHorizontal: widthPixel(10),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(8),
    marginLeft: widthPixel(8),
  },
  statusText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
  },
});
