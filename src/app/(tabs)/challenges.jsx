import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Animated, Dimensions, BackHandler, RefreshControl } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';
import { useListChallenges } from '@/hooks/useChallenges';
import { useHomeDashboard } from '@/hooks/useSystem';
import LoadingSpinner from '@/components/LoadingSpinner';
import BannerAd from '@/components/ads/BannerAd';
import { FilterModal } from '@/components/challenges/FilterModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'destination', label: 'Destination' },
  { id: 'rare', label: 'Rare ✨' },
];

export default function ChallengesScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [filterVisible, setFilterVisible] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (category) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Filter States (UI)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedProofType, setSelectedProofType] = useState(null);
  const [selectedSortBy, setSelectedSortBy] = useState('Default');

  // Applied States (API)
  const [appliedDifficulty, setAppliedDifficulty] = useState(null);
  const [appliedStatus, setAppliedStatus] = useState(null);
  const [appliedProofType, setAppliedProofType] = useState(null);
  const [appliedSortBy, setAppliedSortBy] = useState('Default');

  const mapDifficulty = (diff) => {
    if (!diff) return undefined;
    return diff.toLowerCase();
  };

  const mapStatus = (status) => {
    if (!status) return undefined;
    if (status === 'Available') return 'available';
    if (status === 'In Progress') return 'continue';
    if (status === 'Pending') return 'pending';
    if (status === 'Verified') return 'completed';
    return undefined;
  };

  const mapProofType = (proof) => {
    if (!proof) return undefined;
    if (proof === 'Self-Check') return 'self_check';
    if (proof === 'Photo') return 'photo';
    if (proof === 'GPS') return 'gps';
    return undefined;
  };

  const mapSortBy = (sort) => {
    if (!sort || sort === 'Default') return undefined;
    if (sort === 'Most Points') return 'most_points';
    if (sort === 'Fewest Points') return 'fewest_points';
    if (sort === 'Most XP') return 'most_xp';
    if (sort === 'Easiest First') return 'easiest';
    if (sort === 'Hardest First') return 'hardest';
    return undefined;
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  // React Query calls
  const { data: challengesData, isLoading, refetch } = useListChallenges({
    type: activeCategory === 'all' ? undefined : (activeCategory === 'rare' ? 'rare' : activeCategory),
    difficulty: mapDifficulty(appliedDifficulty),
    status: mapStatus(appliedStatus),
    proofType: mapProofType(appliedProofType),
    sortBy: mapSortBy(appliedSortBy),
  });

  const { data: dashboardData } = useHomeDashboard();
  const stats = dashboardData?.data?.stats;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getCategoryEmoji = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('food') || cat.includes('diet') || cat.includes('salad')) return '🥗';
    if (cat.includes('waste') || cat.includes('recycle')) return '♻️';
    if (cat.includes('transport') || cat.includes('bike') || cat.includes('car')) return '🚲';
    if (cat.includes('energy') || cat.includes('solar')) return '⚡';
    if (cat.includes('nature') || cat.includes('tree')) return '🌱';
    if (cat.includes('travel') || cat.includes('resort') || cat.includes('village')) return '🛫';
    return '💚';
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

  const groupedSections = React.useMemo(() => {
    const rawChallenges = challengesData?.data?.challenges || [];
    const categoriesMap = {};

    rawChallenges.forEach((challenge) => {
      const category = challenge.category || 'General';

      if (!categoriesMap[category]) {
        categoriesMap[category] = {
          category: category,
          icon: getCategoryEmoji(category),
          items: []
        };
      }

      const attemptStatus = challenge.userProgress?.status || 'not_started';

      let statusText = 'Start';
      if (attemptStatus === 'started' || attemptStatus === 'continue') {
        statusText = 'Continue';
      } else if (attemptStatus === 'completed') {
        statusText = 'Completed';
      } else if (attemptStatus === 'pending') {
        statusText = 'Pending ⌛';
      } else if (attemptStatus === 'failed') {
        statusText = 'Try Again';
      }

      let computedProofs = [];
      if (challenge.selfCheck) computedProofs.push('Self-check');
      if (challenge.isGPS) computedProofs.push('GPS');
      if (challenge.isImageUpload || (!challenge.selfCheck && !challenge.isGPS)) computedProofs.push('Photo');

      categoriesMap[category].items.push({
        id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        points: `+${challenge.points}pts`,
        xp: `+${challenge.xp}XP`,
        time: challenge.endTime ? "Active" : null,
        proofs: computedProofs,
        status: statusText,
        iconImg: challenge.image ? { uri: challenge.image } : getCategoryIcon(category),
        category: category,
        difficulty: challenge.difficulty
      });
    });

    return Object.values(categoriesMap);
  }, [challengesData]);

  const handleReset = () => {
    setSelectedDifficulty(null);
    setSelectedStatus(null);
    setSelectedProofType(null);
    setSelectedSortBy('Default');

    setAppliedDifficulty(null);
    setAppliedStatus(null);
    setAppliedProofType(null);
    setAppliedSortBy('Default');
  };

  const handleApplyFilters = () => {
    // const mappedParams = {
    //   type: activeCategory === 'all' ? undefined : activeCategory,
    //   difficulty: mapDifficulty(selectedDifficulty),
    //   status: mapStatus(selectedStatus),
    //   proofType: mapProofType(selectedProofType),
    //   sortBy: mapSortBy(selectedSortBy),
    // };

    // console.log('🎛️ ──── FILTER APPLIED ────');
    // console.log('📌 UI Selections:', {
    //   difficulty: selectedDifficulty,
    //   status: selectedStatus,
    //   proofType: selectedProofType,
    //   sortBy: selectedSortBy,
    // });
    // console.log('📤 API Params Sent to Backend:', JSON.stringify(mappedParams, null, 2));
    // console.log('─────────────────────────────');

    setAppliedDifficulty(selectedDifficulty);
    setAppliedStatus(selectedStatus);
    setAppliedProofType(selectedProofType);
    setAppliedSortBy(selectedSortBy);
    toggleFilter(false);
  };

  // Animation refs
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleFilter = (show) => {
    if (show) {
      setSelectedDifficulty(appliedDifficulty);
      setSelectedStatus(appliedStatus);
      setSelectedProofType(appliedProofType);
      setSelectedSortBy(appliedSortBy);

      setFilterVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700, // Slow open
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 600, // Slow close
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => setFilterVisible(false));
    }
  };

  const navigation = useNavigation();

  const filterHasBeenOpened = useRef(false);

  useEffect(() => {
    if (filterVisible) {
      filterHasBeenOpened.current = true;
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    } else if (filterHasBeenOpened.current) {
      navigation.getParent()?.setOptions({ tabBarStyle: undefined });
    }
    // Note: Do NOT call setOptions when filterVisible is false on initial mount.
    // That causes the tab bar to re-render and jump.
  }, [filterVisible]);

  useEffect(() => {
    const backAction = () => {
      if (filterVisible) {
        toggleFilter(false);
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [filterVisible]);

  const renderStatsCard = () => (
    <View style={[styles.statsCard, { backgroundColor: "#F0FDF4" }]}>
      <View style={styles.statItem}>
        <Image source={appIcons.star} style={styles.statIcon} />
        <Text style={[styles.statValue, { color: "#111827" }]}>
          {stats?.points ? stats.points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0"}
        </Text>
        <Text style={[styles.statLabel, { color: "#6B7280" }]}>Points</Text>
      </View>
      <View style={styles.statItem}>
        <Image source={appIcons.purpleThunder} style={styles.statIcon} tintColor={colors.warning} />
        <Text style={[styles.statValue, { color: "#111827" }]}>
          {stats?.xp ? stats.xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0"}
        </Text>
        <Text style={[styles.statLabel, { color: "#6B7280" }]}>XP</Text>
      </View>
      <View style={styles.statItem}>
        <Image source={appIcons.fire} style={styles.statIcon} />
        <Text style={[styles.statValue, { color: "#111827" }]}>{stats?.currentStreak ?? 0}d</Text>
        <Text style={[styles.statLabel, { color: "#6B7280" }]}>Streak</Text>
      </View>
    </View>
  );

  const renderChallengeItem = (item) => (
    <View key={item.id} style={[styles.challengeCard, { backgroundColor: colors.background }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: colors.successBackground }]}>
          <Image source={item.iconImg} style={styles.cardIcon} />
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.titleRow}>
            <Text style={[styles.cardTitle, { color: "#111827" }]}>{item.title}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push({
                pathname: '/challenge/details',
                params: {
                  id: item.id,
                  title: item.title,
                  points: item.points,
                  xp: item.xp,
                  description: item.description,
                  iconImg: typeof item.iconImg === 'number' ? item.iconImg : undefined,
                  imageUri: typeof item.iconImg === 'object' ? item.iconImg.uri : undefined,
                  time: item.time,
                  proofs: JSON.stringify(item.proofs),
                  category: item.category || 'Environmental',
                  difficulty: item.difficulty || 'Easy'
                }
              })}
              style={[
                styles.statusButton,
                {
                  backgroundColor: item.status.includes('Pending') ? '#FEF3C7' :
                    item.status === 'Try Again' ? '#EF4444' :
                      item.status === 'Continue' ? '#2563EB' : colors.primary
                }
              ]}
            >
              <Text style={[
                styles.statusButtonText,
                { color: item.status.includes('Pending') ? '#92400E' : '#FFFFFF' }
              ]}>
                {item.status}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.cardDesc, { color: "#6B7280" }]} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.pointsRow}>
            <Text style={[styles.pointsText, { color: "#16A34A" }]}>{item.points}</Text>
            <Text style={[styles.xpText, { color: "#9CA3AF" }]}>{item.xp}</Text>
            {item.time && (
              <View style={styles.timeRow}>
                <Image source={require("../../../assets/icons/clock.png")} style={styles.clockIcon} tintColor={colors.textPlaceholder} />
                <Text style={[styles.timeText, { color: colors.textPlaceholder }]}>{item.time}</Text>
              </View>
            )}
          </View>
          <View style={styles.tagRow}>
            {item.proofs.map((proof, index) => {
              const tagColor = proof === 'Photo' ? '#2563EB' : proof === 'GPS' ? '#7C3AED' : '#16A34A';
              const tagBg = proof === 'Photo' ? '#2563EB15' : proof === 'GPS' ? '#7C3AED15' : '#16A34A15';
              return (
                <View key={index} style={[styles.tag, { backgroundColor: tagBg }]}>
                  <Image
                    source={proof === 'Photo' ? appIcons.camera : proof === 'GPS' ? appIcons.pin : appIcons.circleCheck}
                    style={styles.tagIcon}
                    tintColor={tagColor}
                  />
                  <Text style={[styles.tagText, { color: tagColor }]}>{proof}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <View style={[styles.dotIndicator, { backgroundColor: item.status === 'Try Again' ? '#EF4444' : item.status === 'Continue' ? '#2563EB' : item.status.includes('Pending') ? '#F59E0B' : '#94A3B8' }]} />
    </View>
  );

  return (
    <ParentWrapper style={{ backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: "#111827" }]}>Eco Challenges</Text>
        <TouchableOpacity onPress={() => toggleFilter(true)}>
          <Image source={require("../../../assets/icons/circle_filter.png")} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#16A34A" />
        }
      >
        {renderStatsCard()}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                { backgroundColor: activeCategory === cat.id ? colors.primary : "#F3F4F6" }
              ]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text style={[
                styles.categoryLabel,
                { color: activeCategory === cat.id ? '#FFFFFF' : colors.textSecondary },
                { fontFamily: activeCategory === cat.id ? FontFamily.InterBold : FontFamily.InterMedium },

              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.challengesContainer}>
          {isLoading && !isRefreshing && groupedSections.length === 0 ? (
            <LoadingSpinner isVisible={true} />
          ) : groupedSections.length === 0 ? (
            <View style={{ paddingVertical: heightPixel(40), alignItems: 'center' }}>
              <Text style={{ fontFamily: FontFamily.InterMedium, color: '#6B7280', fontSize: fontPixel(14) }}>
                No challenges found
              </Text>
            </View>
          ) : (
            groupedSections.map((section, idx) => {
              const isCollapsed = !!collapsedSections[section.category];
              return (
                <View key={idx} style={styles.section}>
                  <TouchableOpacity
                    style={styles.sectionHeader}
                    activeOpacity={0.7}
                    onPress={() => toggleSection(section.category)}
                  >
                    <View style={styles.sectionLeft}>
                      <Text style={styles.sectionEmoji}>{section.icon}</Text>
                      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{section.category}</Text>
                    </View>
                    <View style={styles.sectionRight}>
                      <View style={[styles.countBadge, { backgroundColor: "#DCFCE7" }]}>
                        <Text style={[styles.countText, { color: colors.primary }]}>{section.items.length}</Text>
                      </View>
                      <Image
                        source={appIcons.chevronRight}
                        style={[
                          styles.chevronIcon,
                          { transform: [{ rotate: isCollapsed ? '0deg' : '90deg' }] }
                        ]}
                        tintColor={colors.textPlaceholder}
                      />
                    </View>
                  </TouchableOpacity>
                  {!isCollapsed && section.items.map(renderChallengeItem)}
                </View>
              );
            })
          )}
        </View>
        <View style={{ height: heightPixel(20) }} />
        {/* <BannerAd /> */}
        <View style={{ height: heightPixel(20) }} />
      </ScrollView>

      <FilterModal
        isVisible={filterVisible}
        colors={colors}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedProofType={selectedProofType}
        setSelectedProofType={setSelectedProofType}
        selectedSortBy={selectedSortBy}
        setSelectedSortBy={setSelectedSortBy}
        onApply={handleApplyFilters}
        onReset={handleReset}
        onClose={() => toggleFilter(false)}
      />
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(16),
  },
  headerTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(22),
  },
  filterButton: {

  },
  filterIcon: {
    width: widthPixel(44),
    height: widthPixel(44),
  },
  scrollContent: {
    paddingHorizontal: widthPixel(20),
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: widthPixel(24),
    padding: widthPixel(20),
    justifyContent: 'space-between',
    marginBottom: heightPixel(24),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    marginBottom: heightPixel(8),
  },
  statValue: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(15),
  },
  statLabel: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(10),
    marginTop: heightPixel(2),
  },
  categoryContainer: {
    gap: widthPixel(12),
    marginBottom: heightPixel(24),

  },
  categoryChip: {
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(10),
    borderRadius: widthPixel(100),
    alignItems: "center",
    justifyContent: "center",

  },
  categoryLabel: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
  },
  challengesContainer: {
    gap: heightPixel(24),
  },
  section: {
    gap: heightPixel(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: "#F3F4F6",
    borderWidth: 1,
    paddingVertical: heightPixel(15),
    paddingHorizontal: widthPixel(15),
    borderRadius: widthPixel(14),
    backgroundColor: "#F9FAFB"


  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
  },
  sectionEmoji: {
    fontSize: fontPixel(18),
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
  },
  countBadge: {
    height: widthPixel(24),
    width: widthPixel(24),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: widthPixel(12),
  },
  countText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(12),
  },
  chevronIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    transform: [{ rotate: '90deg' }],
  },
  challengeCard: {
    borderRadius: widthPixel(24),
    padding: widthPixel(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: widthPixel(16),
  },
  iconBox: {
    width: widthPixel(64),
    height: widthPixel(64),
    borderRadius: widthPixel(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    width: widthPixel(32),
    height: widthPixel(32),
  },
  cardInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPixel(4),
  },
  cardTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    flex: 1,
  },
  statusButton: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(8),
    borderRadius: widthPixel(10),
  },
  statusButtonText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#FFFFFF',
  },
  cardDesc: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    marginBottom: heightPixel(12),
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(12),
    marginBottom: heightPixel(12),
  },
  pointsText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
  },
  xpText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(4),
  },
  clockIcon: {
    width: widthPixel(10),
    height: widthPixel(10),
  },
  timeText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: widthPixel(8),
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPixel(10),
    paddingVertical: heightPixel(4),
    borderRadius: widthPixel(8),
    gap: widthPixel(6),
  },
  tagIcon: {
    width: widthPixel(12),
    height: widthPixel(12),
  },
  tagText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(10),
  },
  dotIndicator: {
    position: 'absolute',
    right: widthPixel(16),
    bottom: heightPixel(16),
    width: widthPixel(8),
    height: widthPixel(8),
    borderRadius: widthPixel(4),
    backgroundColor: '#94A3B8',
  },

});
