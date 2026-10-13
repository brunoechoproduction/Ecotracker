import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import ParentWrapper from '@/components/ParentWrapper';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { FontFamily } from '@/constants/Fonts';
import { appIcons } from '@/services/utilities/appAssets';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { LEVEL_TIERS, getUserLevelInfo } from '@/services/utilities/levels';
import { useAuth } from '@/context/AuthContext';

const LevelItem = ({ level, name, xpRequired, status, icon }) => {
  const isDone = status === 'done';
  const isCurrent = status === 'current';
  const isLocked = status === 'locked';
  const isNext = status === 'next';
  
  return (
    <View style={[styles.levelItem, isCurrent && styles.currentItem]}>
      <View style={[styles.iconWrapper, (isLocked || isNext) && styles.lockedWrapper]}>
        <Image 
          source={(isLocked || isNext) ? appIcons.lock : icon} 
          style={[styles.levelIcon, (isLocked || isNext) && { opacity: 0.3 }]} 
          resizeMode="contain" 
        />
      </View>
      <View style={styles.levelInfo}>
        <View style={styles.levelHeader}>
          <View style={[styles.lvlTag, (isLocked || isNext) && styles.lockedTag]}>
            <Text style={[styles.lvlTagText, (isLocked || isNext) && styles.lockedTagText]}>LVL {level}</Text>
          </View>
          {isCurrent && (
            <View style={styles.currentTag}>
              <Text style={styles.currentTagText}>CURRENT</Text>
            </View>
          )}
        </View>
        <Text style={[styles.levelName, (isLocked || isNext) && styles.lockedText]}>{name}</Text>
        <Text style={styles.xpRequired}>{xpRequired} XP required</Text>
      </View>
      <View style={styles.statusContainer}>
        {isDone || isCurrent ? (
          <View style={styles.doneCircle}>
            <Image 
              source={appIcons.whiteTick} 
              style={styles.checkIcon} 
              tintColor="#16A34A"
            />
          </View>
        ) : isNext ? (
          <Text style={styles.nextText}>Next {'>'}</Text>
        ) : (
          <Image 
            source={appIcons.lock} 
            style={styles.lockIcon} 
            tintColor="#CBD5E1"
          />
        )}
      </View>
    </View>
  );
};

export default function LevelsScreen() {
  const { user } = useAuth();
  const { currentLevel, nextLevel, progressPercent, xpToNext, isMaxLevel } = getUserLevelInfo(user?.xp || 0);

  return (
    <ParentWrapper disableTopPadding={true}>
      <ProfileHeader 
        title="Eco Levels" 
        subtitle="Keep earning XP to level up your eco journey"
        gradientColors={['#16A34A', '#14532D']}
        layout="stacked"
      >
        <View style={styles.currentStatusCard}>
          <View style={styles.currentTop}>
            <Image source={currentLevel.icon} style={styles.currentIcon}  />
            <View style={styles.currentTextInfo}>
              <Text style={styles.currentLabel}>CURRENT LEVEL</Text>
              <Text style={styles.currentLevelName}>Level {currentLevel.level} — {currentLevel.name}</Text>
            </View>
            <View style={styles.xpDisplay}>
              <Text style={styles.xpLabel}>YOUR XP</Text>
              <Text style={styles.xpValue}>{(user?.xp || 0).toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.progressStats}>
            <Text style={styles.progressStatText}>{(user?.xp || 0).toLocaleString()} XP</Text>
            <Text style={styles.progressStatText}>{isMaxLevel ? 'MAX LEVEL' : `${nextLevel.xpRequired.toLocaleString()} XP for Level ${nextLevel.level}`}</Text>
          </View>
        </View>
      </ProfileHeader>

      <Text style={styles.sectionTitle}>All Levels</Text>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {LEVEL_TIERS.map((tier) => {
          let status = 'locked';
          if (tier.level < currentLevel.level) status = 'done';
          else if (tier.level === currentLevel.level) status = 'current';
          else if (tier.level === nextLevel.level && !isMaxLevel) status = 'next';

          return (
            <LevelItem 
              key={tier.level} 
              level={tier.level} 
              name={tier.name} 
              xpRequired={tier.xpRequired.toLocaleString()} 
              status={status} 
              icon={tier.icon} 
            />
          );
        })}
        
        <View style={{ height: heightPixel(40) }} />
      </ScrollView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: heightPixel(20),
    paddingHorizontal: widthPixel(20),
  },
  currentStatusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
 
    marginTop: heightPixel(20),
    borderRadius: widthPixel(24),
    padding: widthPixel(20),
  },
  currentTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentIcon: {
    width: widthPixel(44),
    height: widthPixel(44),
  },
  currentTextInfo: {
    flex: 1,
    marginLeft: widthPixel(16),
  },
  currentLabel: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
  currentLevelName: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(17),
    color: '#FFFFFF',
    marginTop: heightPixel(2),
  },
  xpDisplay: {
    alignItems: 'flex-end',
  },
  xpLabel: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: 'rgba(255, 255, 255, 0.7)',
  },
  xpValue: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(18),
    color: '#FFFFFF',
    marginTop: heightPixel(2),
  },
  progressBar: {
    height: heightPixel(10),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: heightPixel(5),
    marginTop: heightPixel(20),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: heightPixel(5),
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: heightPixel(12),
  },
  progressStatText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
    color: '#111827',
    marginTop: heightPixel(32),
    marginBottom: heightPixel(16),
    paddingHorizontal: widthPixel(24),
  },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: heightPixel(12),
    borderRadius: widthPixel(20),
    padding: widthPixel(16),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  currentItem: {
    borderColor: '#16A34A',
    borderWidth: 2,
    backgroundColor: '#F0FDF4',
  },
  iconWrapper: {
    width: widthPixel(56),
    height: widthPixel(56),
    borderRadius: widthPixel(16),
    backgroundColor: '#16A34A20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedWrapper: {
    backgroundColor: '#F8FAFC',
  },
  levelIcon: {
    width: widthPixel(32),
    height: widthPixel(32),
  },
  levelInfo: {
    flex: 1,
    marginLeft: widthPixel(16),
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
  },
  lvlTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(2),
    borderRadius: widthPixel(6),
  },
  lockedTag: {
    backgroundColor: '#16653415',
  },
  lvlTagText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#16A34A',
  },
  currentTag: {
    backgroundColor: '#16A34A',
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(2),
    borderRadius: widthPixel(6),
  },
  currentTagText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(10),
    color: '#FFFFFF',
  },
  levelName: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#111827',
    marginTop: heightPixel(6),
  },
  lockedText: {
    color: '#94A3B8',
  },
  xpRequired: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    marginTop: heightPixel(2),
  },
  statusContainer: {
    marginLeft: widthPixel(12),
  },
  doneCircle: {
    width: widthPixel(24),
    height: widthPixel(24),
    borderRadius: widthPixel(12),
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  checkIcon: {
    width: widthPixel(12),
    height: widthPixel(12),
  },
  nextText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#D97706',
  },
  lockedTagText: {
    color: '#94A3B8',
  },
  lockIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
  },
});
