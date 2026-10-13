import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import CButton from '@/components/CButton';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel, hp, wp } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useChallengeById, useStartChallenge, useClaimChallengeReward } from '@/hooks/useChallenges';

export default function ChallengeDetailsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const params = useLocalSearchParams();

  // Destructure and parse params
  const { 
    id,
    title, 
    points, 
    xp, 
    description, 
    iconImg: iconImgRaw, 
    time, 
    proofs: proofsJson, 
    category, 
    difficulty 
  } = params;

  // React Query queries & mutations
  const { data: challengeData, isLoading } = useChallengeById(id);
  const startChallengeMutation = useStartChallenge();
  const claimRewardMutation = useClaimChallengeReward();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner isVisible={true} />
      </View>
    );
  }

  const challenge = challengeData?.data?.challenge;
  const userProgress = challengeData?.data?.userProgress || challenge?.userProgress;
  const status = userProgress?.status || userProgress?.userStatus;
  const rewardClaimed = userProgress?.rewardClaimed || userProgress?.isRewardClaimed;
  const attemptId = userProgress?.attemptId;

  // Dynamically resolve values, prioritizing backend data over route params
  const displayTitle = challenge?.title || title || '';
  const displayDescription = challenge?.description || description || '';
  const displayPoints = challenge?.points !== undefined ? challenge.points : (points || 0);
  const displayXp = challenge?.xp !== undefined ? challenge.xp : (xp || 0);
  const displayDifficulty = challenge?.difficulty || difficulty || 'Easy';
  const displayCategory = challenge?.category || category || 'Environmental';
  const getTimeLeft = (endTime) => {
    if (!endTime) return null;
    const end = new Date(endTime);
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}m left`;
  };

  const displayTime = challenge?.endTime ? getTimeLeft(challenge.endTime) : (time || 'Ongoing');

  // Resolve how to prove it list
  let proofs = [];
  if (challenge) {
    if (challenge.selfCheck) proofs.push('Self-check');
    if (challenge.isGPS) proofs.push('GPS');
    if (challenge.isImageUpload || (!challenge.selfCheck && !challenge.isGPS)) proofs.push('Photo');
  } else if (proofsJson) {
    try {
      proofs = JSON.parse(proofsJson);
    } catch (e) {
      proofs = [];
    }
  }

  // Resolve icon/image source
  const getIconSource = () => {
    if (challenge?.image) {
      return { uri: challenge.image };
    }
    if (iconImgRaw) {
      if (typeof iconImgRaw === 'number') return iconImgRaw;
      if (typeof iconImgRaw === 'string') {
        if (iconImgRaw.startsWith('http')) return { uri: iconImgRaw };
        const parsed = parseInt(iconImgRaw);
        if (!isNaN(parsed)) return parsed;
        return { uri: iconImgRaw };
      }
    }
    // Fallback based on category
    const cat = displayCategory.toLowerCase();
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
  const iconSource = getIconSource();

  // Dynamic bottom button action state
  let buttonTitle = "Start Challenge";
  let buttonDisabled = false;
  let buttonLoading = startChallengeMutation.isPending || claimRewardMutation.isPending;
  let buttonOnPress = () => {};
  let showButton = true;

  if (!status || status === 'not_started' || status === 'available') {
    buttonTitle = "Start Challenge";
    buttonOnPress = () => {
      startChallengeMutation.mutate(id, {
        onSuccess: (res) => {
          const newAttemptId = res.data?.attempt?._id;
          router.push({
            pathname: '/challenge/upload-proof',
            params: {
              attemptId: newAttemptId,
              challengeId: id,
              title: displayTitle,
              points: displayPoints,
              xp: displayXp,
              iconImg: challenge?.image || iconImgRaw,
              proofs: JSON.stringify(proofs)
            }
          });
        },
        onError: (err) => {
          console.error("Error starting challenge:", err);
          alert(err.message || "Failed to start challenge. Please try again.");
        }
      });
    };
  } else if (status === 'started' || status === 'continue') {
    buttonTitle = "Submit Proof";
    buttonOnPress = () => {
      router.push({
        pathname: '/challenge/upload-proof',
        params: {
          attemptId: attemptId,
          challengeId: id,
          title: displayTitle,
          points: displayPoints,
          xp: displayXp,
          iconImg: challenge?.image || iconImgRaw,
          proofs: JSON.stringify(proofs)
        }
      });
    };
  } else if (status === 'pending') {
    buttonTitle = "Verifying Proof...";
    buttonDisabled = true;
  } else if (status === 'completed') {
    if (rewardClaimed) {
      showButton = false;
    } else {
      buttonTitle = "Claim Reward";
      buttonOnPress = () => {
        claimRewardMutation.mutate(attemptId, {
          onSuccess: (res) => {
            router.replace('/(tabs)');
          },
          onError: (err) => {
            console.error("Error claiming reward:", err);
            alert(err.message || "Failed to claim reward. Please try again.");
          }
        });
      };
    }
  } else if (status === 'failed') {
    buttonTitle = "Try Again";
    buttonOnPress = () => {
      startChallengeMutation.mutate(id, {
        onSuccess: (res) => {
          const newAttemptId = res.data?.attempt?._id;
          router.push({
            pathname: '/challenge/upload-proof',
            params: {
              attemptId: newAttemptId,
              challengeId: id,
              title: displayTitle,
              points: displayPoints,
              xp: displayXp,
              iconImg: challenge?.image || iconImgRaw,
              proofs: JSON.stringify(proofs)
            }
          });
        },
        onError: (err) => {
          console.error("Error restarting challenge:", err);
          alert(err.message || "Failed to restart challenge. Please try again.");
        }
      });
    };
  }

  return (
    <ParentWrapper style={{ backgroundColor: colors.background }} disableTopPadding={true}>
      <LinearGradient
        colors={['#16A34A', '#15803D']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Image 
            source={appIcons.backArrow} 
            style={styles.backIcon} 
            resizeMode="contain" 
          />
        </TouchableOpacity>

        <View style={styles.horizontalContainer}>
          <View style={styles.mainIconContainer}>
            <Image source={iconSource} style={styles.mainIcon} resizeMode="contain" />
          </View>
          
          <View style={styles.titleInfo}>
            <View style={styles.tagRow}>
              <View style={styles.easyTag}>
                <Text style={styles.easyTagText}>{displayDifficulty}</Text>
              </View>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{displayCategory}</Text>
              </View>
            </View>

            <Text style={styles.mainTitle}>{displayTitle}</Text>
            
            <View style={styles.timerRow}>
              <Image 
                source={appIcons.watchOutline} 
                style={styles.timerIcon} 
                tintColor="#FFFFFFBF" 
              />
              <Text style={styles.timerText}>
                {displayTime}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: "#F0FDF4", borderColor: "#DCFCE7" }]}>
          <View style={styles.statItem}>
            <Image source={appIcons.star} style={styles.statIcon} />
            <Text style={[styles.statValue, { color: colors.primary }]}>{displayPoints}</Text>
            <Text style={[styles.statLabel, { color: "#6B7280" }]}>Points</Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: "#DCFCE7" }]} />
          
          <View style={styles.statItem}>
            <Image source={appIcons.purpleThunder} style={styles.statIcon} tintColor={colors.warning} />
            <Text style={[styles.statValue, { color: colors.primary }]}>{displayXp}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>XP Earned</Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: "#DCFCE7" }]} />
          
          <View style={styles.statItem}>
            <Image source={appIcons.star} style={styles.statIcon} tintColor={colors.warning} />
            <Text style={[styles.statValue, { color: colors.primary }]}>{displayDifficulty}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Difficulty</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: "#111827" }]}>About this Challenge</Text>
          <Text style={[styles.description, { color: "#4B5563" }]}>
            {displayDescription}
          </Text>
        </View>

        {/* How to Prove It */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>How to Prove It</Text>
          {proofs.map((proof, index) => {
            const isPhoto = proof === 'Photo';
            const isGps = proof === 'GPS';
            
            // Define colors based on proof type
            const proofColor = isPhoto ? '#2563EB' : isGps ? '#7C3AED' : '#16A34A';
            const proofBg = isPhoto ? '#2563EB10' : isGps ? '#7C3AED10' : '#F0FDF4';
            const proofBorder = isPhoto ? '#2563EB20' : isGps ? '#7C3AED20' : '#16A34A20';
            
            const proofIcon = isPhoto ? appIcons.camera : isGps ? appIcons.pin : appIcons.circleCheck;
            const proofSubtitle = isPhoto ? 'Take a picture of completion' : isGps ? 'Verify your location' : 'Mark as done yourself';

            return (
              <View key={index} style={[styles.proofCard, { backgroundColor: proofBg, borderColor: proofBorder, marginBottom: heightPixel(12) }]}>
                <View style={[styles.checkIconContainer, { backgroundColor: colors.background }]}>
                  <Image 
                    source={proofIcon} 
                    style={styles.checkIcon} 
                    tintColor={proofColor}
                  />
                </View>
                <View>
                  <Text style={[styles.proofTitle, { color: "#111827" }]}>{proof}</Text>
                  <Text style={[styles.proofSubtitle, { color: colors.textSecondary }]}>
                    {proofSubtitle}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: heightPixel(100) }} />
      </ScrollView>

      {showButton && (
        <CButton 
          title={buttonTitle} 
          onPress={buttonOnPress}
          disabled={buttonDisabled}
          loading={buttonLoading}
          style={styles.bottomButton}
        />
      )}
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: hp(6),
    paddingBottom: heightPixel(25),
    paddingHorizontal: widthPixel(20),
   
  },
  backButton: {
    width: widthPixel(44),
    height: widthPixel(44),
    borderRadius: widthPixel(22),
    backgroundColor: '#FFFFFF33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: fontPixel(24),
    color: '#FFFFFF',
    marginTop: -heightPixel(2),
  },
  backIcon:{
    height: widthPixel(25),
    width: widthPixel(25),
  
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: heightPixel(25),
    gap: widthPixel(16),
  },
  titleInfo: {
    flex: 1,
    justifyContent: 'center',
    
  },
  tagRow: {
    flexDirection: 'row',
    
    gap: widthPixel(8),
    marginBottom: heightPixel(8),
  },
  easyTag: {
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(100),
    backgroundColor: '#FFFFFF',
  },
  easyTagText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#16A34A',
  },
  categoryTag: {
    paddingHorizontal: widthPixel(14),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(100),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryTagText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(11),
    color: '#FFFFFFCC',
  },
  mainIconContainer: {
    width: widthPixel(80),
    height: widthPixel(80),
    borderRadius: widthPixel(24),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:"flex-start"
  },
  mainIcon: {
    width: widthPixel(48),
    height: widthPixel(48),
  },
  mainTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(20),
    color: '#FFFFFF',
    lineHeight: fontPixel(32),
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: heightPixel(2),
  },
  timerText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#FFFFFFBF',
    lineHeight: 18,
   
  },
  timerIcon: {
    width: widthPixel(12),
    height: widthPixel(12),
    marginRight: widthPixel(4),
  },
  scrollContent: {
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(24),
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: widthPixel(24),
    padding: widthPixel(20),
    borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap:heightPixel(5)
  },
  statIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
    marginBottom: heightPixel(8),
  },
  statValue: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(20),
  },
  statLabel: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    marginTop: heightPixel(2),
  },
  statDivider: {
    width: 1,
    height: heightPixel(40),
  },
  section: {
    marginTop: heightPixel(25),
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
    marginBottom: heightPixel(12),
  },
  description: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    lineHeight: fontPixel(24),
  },
  proofCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: widthPixel(20),
    padding: widthPixel(16),
    borderWidth: 1,
    gap: widthPixel(16),
  },
  checkIconContainer: {
    width: widthPixel(48),
    height: widthPixel(48),
    borderRadius: widthPixel(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
  },
  proofTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
  },
  proofSubtitle: {
    fontFamily: FontFamily.InterMedium,
    fontSize: fontPixel(12),
    marginTop: heightPixel(2),
  },
  bottomButton: {
    position: 'absolute',
    bottom: hp(4),
    left: 0,
    right: 0,
  },
});
