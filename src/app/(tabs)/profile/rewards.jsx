import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { FontFamily } from '@/constants/Fonts';
import { appIcons } from '@/services/utilities/appAssets';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserRewards } from '@/hooks/useSystem';
import LoadingSpinner from '@/components/LoadingSpinner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PodiumItem = ({ rank, name, score, avatar, isUser = false }) => {
  const isFirst = rank === 1;
  const avatarSize = isFirst ? widthPixel(64) : widthPixel(56);

  return (
    <View style={[styles.podiumItem, isFirst && styles.firstPodiumItem]}>
      <View style={styles.avatarContainer}>
        {isFirst && (
          <Image source={appIcons.crown} style={styles.crownIcon} />
        )}
        <View style={[styles.medalCircle, { backgroundColor: rank == 1 ? "#FEF3C7" : rank == 2 ? "#E5E7EB" : rank == 3 ? "#FED7AA" : "#ffffff" }]}>
          <Image source={rank == 1 ? appIcons.goldMedal : rank == 2 ? appIcons.silverMedal : appIcons.bronzeMedal} style={styles.medalIconSmall} />
          <Text style={styles.medalRankText}>{rank}</Text>
        </View>
        <Text style={[styles.podiumName, { color: rank == 3 ? "#16A34A" : "#374151" }]}>{name}</Text>
      </View>

      <LinearGradient
        colors={
          rank === 1 ? ['#F59E0B', '#D97706'] :
            rank === 2 ? ['#C0C0C0', '#94A3B8'] :
              ['#CD7F32', '#A0522D']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.podiumBase,
          rank === 1 ? styles.baseFirst : rank === 2 ? styles.baseSecond : styles.baseThird
        ]}
      >
        <Text style={styles.baseRankText}>#{rank}</Text>
        <Text style={styles.baseScoreText}>{score}</Text>
      </LinearGradient>

    </View>
  );
};

const LeaderboardRow = ({ rank, name, score, flag, trend, isUser = false }) => (
  <View style={[styles.leaderboardRow, isUser && styles.userRow]}>
    <View style={styles.rowLeft}>
      <View style={[styles.rankBadgeSmall, rank === 1 ? styles.rank1 : rank === 2 ? styles.rank2 : rank === 3 ? styles.rank3 : null]}>
        <Text style={[
          styles.rankTextSmall,
          rank === 1 ? { color: '#D97706' } :
            rank === 2 ? { color: '#374151' } :
              rank === 3 ? { color: '#92400E' } : null
        ]}>{rank}</Text>
      </View>
      {/* <View style={styles.flagPlaceholder}>
        <Text style={{ fontSize: 14 }}>{flag || '🌍'}</Text>
      </View> */}
      <View style={styles.nameContainer}>
        <Text style={[styles.rowName, isUser && styles.userNameText]}>{name}{isUser && ' 👤'}</Text>
        <Text style={styles.rowScore}>{score} EcoScore</Text>
      </View>
    </View>
    <View style={styles.rowRight}>
      {trend === 'up' && <Image source={appIcons.trend} style={[styles.trendIcon, { tintColor: '#16A34A' }]} />}
      {trend === 'down' && <Image source={appIcons.trend} style={[styles.trendIcon, { tintColor: '#EF4444', transform: [{ scaleY: -1 }] }]} />}
      {trend === 'flat' && <Text style={styles.flatTrend}>—</Text>}
    </View>
  </View>
);

const RewardCard = ({ icon, title, description, cost, locked = false, onPress, isLoading = false }) => (
  <View style={[styles.rewardCard, !locked && styles.activeRewardCard]}>
    <View style={styles.rewardIconWrapper}>
      <View style={[styles.rewardIconBg, locked && styles.lockedIconBg]}>
        <Image source={icon} style={[styles.rewardIcon, locked && { opacity: 0.5 }]} resizeMode="contain" />
      </View>
    </View>

    <View style={styles.rewardDetails}>
      <Text style={[styles.rewardTitle, locked && styles.lockedText]}>{title}</Text>
      <Text style={[styles.rewardDesc, locked && styles.lockedText]}>{description}</Text>
      <View style={styles.costRow}>
        <Image source={appIcons.star} style={styles.starIcon} />
        <Text style={[styles.costText, locked && styles.lockedText, !locked && { color: '#16A34A' }]}>{cost} pts</Text>
      </View>
    </View>

    <TouchableOpacity
      style={[styles.redeemBtn, locked && styles.lockedBtn]}
      disabled={locked || isLoading}
      onPress={onPress}
    >
      <Image
        source={appIcons.gift}
        style={styles.btnIcon}
        tintColor={locked ? "#9CA3AF" : "#FFFFFF"}
      />
      <Text style={[styles.redeemBtnText, locked && styles.lockedBtnText]}>
        {locked ? 'Locked' : isLoading ? '...' : 'Redeem'}
      </Text>
    </TouchableOpacity>
  </View>
);

import { useSystemInfo, useUserStreak } from '@/hooks/useSystem';
import { useAuth } from '@/context/AuthContext';
import { useRedeemRewards, useRedeemReward } from '@/hooks/useRewards';
import { showMessage } from 'react-native-flash-message';


export default function RewardsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: systemInfoResponse, isLoading } = useSystemInfo();
  const { data: streakResponse } = useUserStreak();

  const { data: rewardsResponse, isLoading: isRewardsLoading } = useRedeemRewards();
  const { mutateAsync: redeemReward } = useRedeemReward();
  const [redeemingId, setRedeemingId] = React.useState(null);

  if (isLoading || isRewardsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <LoadingSpinner isVisible={true} />
      </View>
    );
  }

  const handleRedeem = async (reward) => {
    try {
      setRedeemingId(reward._id || reward.id);
      const res = await redeemReward(reward._id || reward.id);
      const successMessage = res?.data?.message || res?.message || 'Reward redeemed successfully!';
      showMessage({ message: successMessage, type: 'success' });
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to redeem reward. Do you have enough points?';
      showMessage({ message: msg, type: 'danger' });
    } finally {
      setRedeemingId(null);
    }
  };

  const topUsers = systemInfoResponse?.data?.topUsers || [];
  const currentPoints = streakResponse?.data?.points ?? 0;

  // Create podium (top 3)
  const podiumUsers = topUsers.slice(0, 3);
  // Reorder for podium display: Rank 2, Rank 1, Rank 3
  const displayPodium = [
    podiumUsers.find(u => u.rank === 2),
    podiumUsers.find(u => u.rank === 1),
    podiumUsers.find(u => u.rank === 3)
  ].filter(Boolean);

  return (
    <ParentWrapper disableTopPadding={true}>
      <ProfileHeader
        title="Rewards & Leaderboard"
        subtitle={`Your current balance: ${currentPoints.toLocaleString()} pts`}
        gradientColors={['#16A34A', '#14532D']}
        layout="stacked"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏆 Global Leaderboard</Text>
        </View>

        <View style={styles.podiumContainer}>
          {displayPodium.map(u => (
            <PodiumItem
              key={u.id}
              rank={u.rank}
              name={user?.id === u.id ? 'You ✨' : u.name.split(' ')[0]}
              score={u.points.toString()}
              isUser={user?.id === u.id}
            />
          ))}
        </View>

        <View style={styles.listContainer}>
          {topUsers.map(u => (
            <LeaderboardRow
              key={u.id}
              rank={u.rank}
              name={u.name}
              score={u.points.toLocaleString()}
              flag="🌍"
              trend="flat"
              isUser={user?.id === u.id}
            />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🎁 Redeem Rewards</Text>
        </View>
        <View style={styles.rewardsList}>
          {(rewardsResponse?.data?.rewards || rewardsResponse?.rewards || []).map((reward, index) => {
            let defaultIcon = appIcons.gift;
            const titleLower = reward.title.toLowerCase();
            if (titleLower.includes('stay')) defaultIcon = appIcons.hospital;
            else if (titleLower.includes('tree')) defaultIcon = appIcons.tree;
            else if (titleLower.includes('bag')) defaultIcon = appIcons.purse;

            return (
              <RewardCard
                key={reward._id || reward.id || index}
                icon={reward.image ? { uri: reward.image } : defaultIcon}
                title={reward.title}
                description={reward.description}
                cost={reward.points.toLocaleString()}
                locked={reward.isLocked}
                onPress={() => handleRedeem(reward)}
                isLoading={redeemingId === (reward._id || reward.id)}
              />
            );
          })}
        </View>

        <View style={{ height: heightPixel(40) }} />
      </ScrollView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: heightPixel(40),
    backgroundColor: '#F9FAFB',
  },
  sectionHeader: {
    paddingHorizontal: widthPixel(20),
    marginTop: heightPixel(24),
    marginBottom: heightPixel(16),
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(16),
    color: '#111827',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: heightPixel(20),
    marginBottom: heightPixel(30),
    paddingHorizontal: widthPixel(20),
  },
  podiumItem: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - widthPixel(80)) / 3,
    marginHorizontal: widthPixel(5),
  },
  firstPodiumItem: {
    zIndex: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: heightPixel(12),
    position: 'relative',
  },
  crownIcon: {
    width: widthPixel(28),
    height: widthPixel(28),
    position: 'absolute',
    top: -heightPixel(30),
    zIndex: 1,
  },
  medalCircle: {
    width: widthPixel(56),
    height: widthPixel(56),
    borderRadius: widthPixel(28),
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: heightPixel(8),
  },
  medalIconSmall: {
    width: widthPixel(24),
    height: widthPixel(24),
  },
  medalRankText: {
    position: 'absolute',
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(10),
    color: '#FFFFFF',
    bottom: heightPixel(8),
  },
  podiumName: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#374151',
  },
  podiumBase: {
    width: '90%',
    borderRadius: widthPixel(12),
    paddingVertical: heightPixel(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseFirst: {
    height: heightPixel(130),
  },
  baseSecond: {
    height: heightPixel(100),
  },
  baseThird: {
    height: heightPixel(80),
  },
  baseRankText: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(14),
    color: '#FFFFFF',
  },
  baseScoreText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(10),
    color: '#FFFFFFD9',
    marginTop: heightPixel(2),
  },
  youIndicator: {
    position: 'absolute',
    top: heightPixel(30),
    right: -widthPixel(10),
  },
  youText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#16A34A',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: widthPixel(20),
    borderRadius: widthPixel(24),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: heightPixel(16),
    paddingHorizontal: widthPixel(20),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userRow: {
    backgroundColor: '#F0FDF4',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(12),
  },
  rankBadgeSmall: {
    width: widthPixel(28),
    height: widthPixel(28),
    borderRadius: widthPixel(14),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rank1: { backgroundColor: '#FEF3C7' },
  rank2: { backgroundColor: '#F1F5F9' },
  rank3: { backgroundColor: '#FFEDD5' },
  rankTextSmall: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#6B7280',
  },
  rankTextActive: {
    color: '#92400E',
  },
  flagPlaceholder: {
    width: widthPixel(24),
    height: widthPixel(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    marginLeft: widthPixel(4),
  },
  rowName: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(14),
    color: '#111827',
  },
  userNameText: {
    color: '#16A34A',
    fontFamily: FontFamily.InterExtraBold,
  },
  rowScore: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    marginTop: heightPixel(2),
  },
  rowRight: {
    alignItems: 'center',
    width: widthPixel(30),
  },
  trendIcon: {
    width: widthPixel(16),
    height: widthPixel(16),
    resizeMode: 'contain',

  },
  flatTrend: {
    fontSize: fontPixel(16),
    color: '#9CA3AF',
  },
  rewardsList: {
    paddingHorizontal: widthPixel(20),
    gap: heightPixel(16),
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(24),
    padding: widthPixel(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  activeRewardCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCFCE7',
  },
  rewardIconWrapper: {
    marginRight: widthPixel(16),
  },
  rewardIconBg: {
    width: widthPixel(60),
    height: widthPixel(60),
    borderRadius: widthPixel(18),
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedIconBg: {
    backgroundColor: '#F9FAFB',
  },
  rewardIcon: {
    width: widthPixel(36),
    height: widthPixel(36),
  },
  rewardDetails: {
    flex: 1,
  },
  rewardTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#111827',
  },
  rewardDesc: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#6B7280',
    marginTop: heightPixel(4),
    lineHeight: heightPixel(18),
  },
  lockedText: {
    color: '#9CA3AF',
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(4),
    marginTop: heightPixel(8),
  },
  starIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  costText: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(12),
  },
  redeemBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(10),
    borderRadius: widthPixel(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(6),
  },
  lockedBtn: {
    backgroundColor: '#F3F4F6',
  },
  btnIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  redeemBtnText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#FFFFFF',
  },
  lockedBtnText: {
    color: '#9CA3AF',
  },
});
