import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ParentWrapper from '@/components/ParentWrapper';
import { FontFamily } from '@/constants/Fonts';
import { appIcons,appImages } from '@/services/utilities/appAssets';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import * as ImagePicker from 'expo-image-picker';
import LogoutModal from '@/components/profile/LogoutModal';
import { useLogout } from '@/hooks/useAuth';
import { useAuth } from '@/context/AuthContext';
import { useUserStreak } from '@/hooks/useSystem';
import { useMyAttempts } from '@/hooks/useChallenges';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getUserLevelInfo } from '@/services/utilities/levels';
import { userService } from '@/services/api/userService';

const StatItem = ({ icon, value, label }) => (
  <View style={styles.statItem}>
    <Image source={icon} style={styles.statIcon} resizeMode="contain" />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const BadgeItem = ({ icon, label, locked = false }) => (
  <View style={styles.badgeItem}>
    <View style={[styles.badgeIconBg, locked && styles.lockedBadge]}>
      <Image 
        source={icon} 
        style={[styles.badgeIcon, locked && { opacity: 0.3 }]} 
        resizeMode="contain" 
      />
    </View>
    <Text style={[styles.badgeLabel, locked && styles.lockedLabel]}>{label}</Text>
  </View>
);

const MenuItem = ({ icon, title, onPress, isLast = false }) => (
  <TouchableOpacity 
    style={[styles.menuItem, isLast && styles.noBorder]} 
    onPress={onPress}
  >
    <View style={styles.menuLeft}>
      <Image source={icon} style={styles.menuIcon} resizeMode="contain" />
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    <Image 
      source={appIcons.chevronRight} 
      style={styles.chevron} 
      tintColor="#9CA3AF"
     
    />
  </TouchableOpacity>
);

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

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [profileImage, setProfileImage] = React.useState(null);
  const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);
  const [badgesData, setBadgesData] = React.useState(null);
  const { clearAuth, user } = useAuth();
  const { mutateAsync: logoutApi } = useLogout();

  React.useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await userService.getBadges();
        if (response.success) {
          setBadgesData(response.data.badges);
        }
      } catch (error) {
        console.log('Error fetching badges', error);
      }
    };
    fetchBadges();
  }, []);

  // API query hooks
  const { data: streakResponse, isLoading: isStreakLoading, refetch: refetchStreak } = useUserStreak();
  const { data: attemptsResponse, isLoading: isAttemptsLoading, refetch: refetchAttempts } = useMyAttempts();

  const stats = streakResponse?.data;
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
      await Promise.all([refetchStreak(), refetchAttempts()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const isLoading = isStreakLoading || isAttemptsLoading;

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

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi({});
    } catch (e) {}
    setLogoutModalVisible(false);
    await clearAuth();
  };

  // Dynamic level computation
  const { currentLevel, nextLevel, progressPercent, isMaxLevel } = getUserLevelInfo(user?.xp || 0);

  return (
    <ParentWrapper disableTopPadding={true}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#FFFFFF" />
        }
      >
        {/* Header Section */}
        <LinearGradient 
          colors={['#16A34A', '#14532D']}
          locations={[0.0849, 0.9151]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.greenHeader, { paddingTop: insets.top + heightPixel(12) }]}
        >
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity 
              style={styles.settingsBtn}
               onPress={() => router.push('/(tabs)/profile/settings')}
            >
              <Image 
                source={appIcons.circleGear} 
                style={styles.settingsIcon} 
                tintColor="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image source={profileImage ? { uri: profileImage } : (user?.image && user.image !== 'null' ? { uri: user.image } : appImages.womenProfile)} style={styles.avatar} />
              
              {/* Level Badge */}
              <TouchableOpacity 
                style={styles.cameraBtn}
              >
                 <Text style={styles.userNumber}>{currentLevel.level}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.name && user.name !== 'null' ? user.name : 'User'}</Text>
            <Text style={styles.userRank}>{currentLevel.name} • Rank #{stats?.globalRank ?? '-'} Globally 🌍</Text>
          </View>
        </LinearGradient>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <StatItem icon={appIcons.leave} value={user?.ecoScore ?? stats?.ecoScore ?? 0} label="EcoScore" />
            <StatItem icon={appIcons.star} value={formatNumber(user?.points || stats?.points || 0)} label="Points" />
            <StatItem icon={appIcons.thunder64} value={formatNumber(user?.xp || stats?.xp || 0)} label="XP" />
          </View>
          <View style={styles.statsRow}>
            <StatItem icon={appIcons.medal96} value={currentLevel.level} label="Level" />
            <StatItem icon={appIcons.fire96} value={`${user?.currentStreak ?? stats?.currentStreak ?? 0}d`} label="Streak" />
            <StatItem icon={appIcons.shield} value={`${user?.trustScore ?? stats?.trustScore ?? 94}%`} label="Trust Score" />
          </View>
        </View>

        {/* Progress Card */}
        <TouchableOpacity style={styles.progressCard} /* onPress={() => router.push('/(tabs)/profile/levels')} */>
          <View style={styles.progressTop}>
            <View style={styles.progressLabelRow}>
              <Image source={currentLevel.icon} style={styles.smallIcon} />
              <Text style={styles.progressLabel}>{currentLevel.name} — Level {currentLevel.level}</Text>
            </View>
            <Image 
              source={appIcons.chevronRight} 
              style={styles.progressChevron} 
              tintColor="#CBD5E1"
            />
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient 
              colors={['#16A34A', '#22C55E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]} 
            />
          </View>
          <Text style={styles.xpText}>
            {isMaxLevel ? 'Maximum level reached!' : `${formatNumber(user?.xp || 0)} / ${formatNumber(nextLevel.xpRequired)} XP to next level`}
          </Text>
        </TouchableOpacity>

        {/* Badges Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Badges ({badgesData ? Object.values(badgesData).filter(Boolean).length : 0}/{badgesData ? Object.keys(badgesData).length : 0})
          </Text>
          <TouchableOpacity style={styles.seeAllContainer}>
            <Text style={styles.seeAll}>See all</Text>
            <Image source={appIcons.chevronRight} style={styles.seeAllChevron} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
          <BadgeItem icon={appIcons.shoes} label="First Step" locked={!(badgesData?.firstStep)} />
          <BadgeItem icon={appIcons.fire} label="Streak Master" locked={!(badgesData?.streakMaster)} />
          <BadgeItem icon={appIcons.salad} label="Food Hero" locked={!(badgesData?.foodHero)} />
          <BadgeItem icon={appIcons.tree} label="Tree Hugger" locked={!(badgesData?.treeHugger)} />
          <BadgeItem icon={appIcons.recycle} label="Zero Waste" locked={!(badgesData?.zeroWaste)} />
          <BadgeItem icon={appIcons.bicycle} label="Echo Traveler" locked={!(badgesData?.echoTraveler)} />
          <BadgeItem icon={appIcons.world} label="Planet Protector" locked={!(badgesData?.planetProtector)} />
          <BadgeItem icon={appIcons.medal} label="Verified Echo Traveler" locked={!(badgesData?.verifiedEchoTraveler)} />
        </ScrollView>

        {/* Completed Challenges Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Completed Challenges ({completedAttempts.length})</Text>
          {completedAttempts.length > 3 && (
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile/completed-challenges')} style={styles.seeAllContainer}>
              <Text style={styles.seeAll}>See all</Text>
              <Image source={appIcons.chevronRight} style={styles.seeAllChevron} resizeMode="contain" />
            </TouchableOpacity>
          )}
        </View>
        
        {isAttemptsLoading && !isRefreshing && completedAttempts.length === 0 ? (
          <LoadingSpinner isVisible={true} />
        ) : completedAttempts.length === 0 ? (
          <View style={{ paddingVertical: heightPixel(20), alignItems: 'center' }}>
            <Text style={{ fontFamily: FontFamily.InterMedium, color: '#9CA3AF', fontSize: fontPixel(12) }}>
              No completed challenges yet
            </Text>
          </View>
        ) : (
          <View style={styles.completedContainer}>
            {completedAttempts.slice(0, 3).map((attempt) => {
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

        {/* Menu List */}
        <View style={styles.menuCard}>
          <MenuItem 
            icon={appIcons.trophy} 
            title="Rewards & Leaderboard" 
             onPress={() => router.push('/(tabs)/profile/rewards')}
          />
          <MenuItem 
            icon={appIcons.levels} 
            title="My Levels" 
             onPress={() => router.push('/(tabs)/profile/levels')}
          />
          <MenuItem 
            icon={appIcons.fire} 
            title="Streak Tracker" 
             onPress={() => router.push('/(tabs)/profile/streak')}
          />
          <MenuItem 
            icon={appIcons.doubleLeaf} 
            title="Eco Impact Report" 
             onPress={() => router.push('/(tabs)/profile/report')}
          />
          <MenuItem 
            icon={appIcons.gear} 
            title="Settings" 
             onPress={() => router.push('/(tabs)/profile/settings')}
            isLast 
          />
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={() => setLogoutModalVisible(true)}>
          <Image source={appIcons.logout} style={styles.signOutIcon} tintColor="#DC2626" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: heightPixel(20) }} />
      </ScrollView>

      <LogoutModal 
        isVisible={logoutModalVisible} 
        onClose={() => setLogoutModalVisible(false)} 
        onLogout={handleLogout} 
      />
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: heightPixel(20),
  },
  greenHeader: {
    paddingTop: heightPixel(12),
    paddingBottom: heightPixel(60),
    paddingHorizontal: widthPixel(20),
   
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(20),
    color: '#FFFFFF',
  },
  settingsBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    width: widthPixel(40),
    height: widthPixel(40),
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: heightPixel(24),
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: widthPixel(90),
    height: widthPixel(90),
    borderRadius: widthPixel(50),
   
  },
  levelBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F59E0B',
    borderRadius: widthPixel(12),
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(4),
    borderWidth: 2,
    borderColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(4),
    zIndex: 10,
  },
  levelBadgeIcon: {
    width: widthPixel(12),
    height: widthPixel(12),
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#F59E0B',
    width: widthPixel(32),
    height: widthPixel(32),
    borderRadius: widthPixel(18),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  userName: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(20),
    color: '#FFFFFF',
    marginTop: heightPixel(12),
  },
    userNumber: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: '#0A0A0A',

  },
  userRank: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: '#FFFFFFB2',
    marginTop: heightPixel(4),
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(-40),
    borderRadius: widthPixel(24),
    padding: widthPixel(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: heightPixel(20),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: widthPixel(26),
    height: widthPixel(26),
    marginBottom: heightPixel(8),
  },
  statValue: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(16),
    color: '#111827',
  },
  statLabel: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(10),
    color: '#9CA3AF',
    marginTop: heightPixel(2),
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(16),
    borderRadius: widthPixel(20),
    padding: widthPixel(16),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
  },
  smallIcon: {
    width: widthPixel(16),
    height: widthPixel(16),
 
  },
  progressLabel: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#111827',
  },
  progressChevron: {
    width: widthPixel(14),
    height: widthPixel(14),
    transform: [{ rotate: '-90deg' }],
  },
  progressBarBg: {
    height: heightPixel(8),
    backgroundColor: '#F3F4F6',
    borderRadius: heightPixel(4),
    marginTop: heightPixel(12),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: heightPixel(4),
  },
  xpText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    marginTop: heightPixel(8),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthPixel(24),
    marginTop: heightPixel(24),
    marginBottom: heightPixel(15),
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
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
  badgesScroll: {
    paddingLeft: widthPixel(20),
    paddingRight: widthPixel(4),
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: widthPixel(16),
    width: widthPixel(70),
  },
  badgeIconBg: {
    width: widthPixel(56),
    height: widthPixel(56),
    borderRadius: widthPixel(16),
    backgroundColor: '#F0FDF4',
    borderColor:"#DCFCE7",
    borderWidth:2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPixel(8),
  },
  lockedBadge: {
    backgroundColor: '#F8FAFC',
  },
  badgeIcon: {
    width: widthPixel(32),
    height: widthPixel(32),
    marginBottom: heightPixel(8),
  },
  badgeLabel: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(9),
    color: '#16A34A',
    textAlign: 'center',
  },
  lockedLabel: {
    color: '#9CA3AF',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(24),
    borderRadius: widthPixel(24),
    paddingVertical: heightPixel(12),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: heightPixel(16),
    paddingHorizontal: widthPixel(20),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(16),
  },
  menuIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
  },
  menuTitle: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(14),
    color: '#374151',
  },
  chevron: {
    width: widthPixel(14),
    height: widthPixel(14),
    
  },
  signOutBtn: {
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(24),
    height: heightPixel(54),
    borderRadius: widthPixel(16),
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: widthPixel(10),
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  signOutIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
  },
  signOutText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#DC2626',
  },
  completedContainer: {
    marginHorizontal: widthPixel(16),
    gap: heightPixel(12),
  },
  completedItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(16),
    padding: widthPixel(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  completedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(12),
  },
  completedIconBg: {
    width: widthPixel(42),
    height: widthPixel(42),
    borderRadius: widthPixel(10),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
  },
  completedInfo: {
    gap: heightPixel(2),
  },
  completedTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#111827',
  },
  completedRewards: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(11),
    color: '#16A34A',
  },
  statusBadge: {
    paddingHorizontal: widthPixel(10),
    paddingVertical: heightPixel(4),
    borderRadius: widthPixel(100),
  },
  statusText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
  },
});
