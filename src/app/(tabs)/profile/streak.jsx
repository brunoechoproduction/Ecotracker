import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useRouter } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import { FontFamily } from '@/constants/Fonts';
import LoadingSpinner from '@/components/LoadingSpinner';
import { appIcons } from '@/services/utilities/appAssets';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DayItem = ({ day, status }) => {
  const isToday = status === 'today';
  const isDone = status === 'done';
  const isFuture = status === 'future';
  const isMissed = status === 'missed';

  return (
    <View style={styles.dayContainer}>
      <Text style={[styles.dayText, isToday && { color: '#D97706', fontFamily: FontFamily.InterBold }]}>{day}</Text>
      <View style={[
        styles.dayCircle,
        isToday && styles.todayCircle,
        isDone && styles.doneCircle,
        isFuture && styles.futureCircle,
        isMissed && styles.missedCircle
      ]}>
        {isDone ? (
          <Image source={appIcons.whiteTick} style={styles.checkIcon} tintColor="#0A0A0A" />
        ) : isToday ? (
          <Image source={appIcons.fire} style={styles.fireIcon} />
        ) : (isFuture || isMissed) ? (
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' }} />
        ) : null}
      </View>
    </View>
  );
};

const StatCard = ({ icon, value, label }) => (
  <View style={styles.statCard}>
    <Image source={icon} style={styles.statIcon} resizeMode="contain" />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const MilestoneItem = ({ icon, title, subtitle, status, isLast }) => {
  const isDone = status === 'done';
  const isNext = status === 'next';
  const isLocked = status === 'locked';

  return (
    <View style={styles.milestoneRow}>
      <View style={styles.timelineWrapper}>
        <View style={[styles.timelineIcon, isLocked && styles.lockedIconBg, isNext && styles.nextIconBg]}>
          <Image
            source={isLocked ? appIcons.lockSolid : icon}
            style={[styles.mIcon, isLocked && {}]}
            resizeMode="contain"
          />
        </View>
        {!isLast && <View style={[styles.timelineLine, isDone && styles.activeLine]} />}
      </View>

      <View style={[
        styles.milestoneCard,
        isDone && styles.doneCard,
        isNext && styles.nextCard
      ]}>
        <View style={styles.milestoneText}>
          <Text style={[styles.mTitle, isLocked && styles.lockedText]}>{title}</Text>
          <Text style={styles.mSubtitle}>{subtitle}</Text>
        </View>
        {isDone ? (
          <Image source={appIcons.circleCheck} style={styles.statusIcon} tintColor="#16A34A" />
        ) : isNext ? (
          <View style={styles.nextBadge}>
            <Text style={styles.nextText}>NEXT UP</Text>
            <Text style={styles.nextDays}>9d to go</Text>
          </View>
        ) : (
          <Text style={styles.lockDays}>{subtitle.split(' ')[0]}</Text>
        )}
      </View>
    </View>
  );
};

import { useUserStreak } from '@/hooks/useSystem';

export default function StreakTrackerScreen() {
  const insets = useSafeAreaInsets();
  const { data: streakResponse, isLoading } = useUserStreak();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFBEB' }}>
        <LoadingSpinner isVisible={true} />
      </View>
    );
  }

  const streakData = streakResponse?.data || {};

  const currentStreak = streakData.currentStreak || 0;
  const longestStreak = streakData.longestStreak || 0;
  const daysActive = streakData.daysActive || 0;
  const xpFromStreak = streakData.xpFromStreak || 0;
  const treesPlanted = streakData.treesPlanted || 0;
  const weeklyProgress = streakData.weeklyProgress || [];
  const isPersonalBest = streakData.isPersonalBest || false;
  const personalBestMessage = streakData.personalBestMessage || '';

  // Calculate CO2 impact roughly (e.g., 4kg per day streak)
  const co2Impact = currentStreak * 4;

  return (
    <ParentWrapper disableTopPadding={true}>
      <LinearGradient
        colors={['#FFFBEB', '#FEF3C7']}
        locations={[0.0849, 0.9151]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.35, y: 1 }}
        style={{ paddingBottom: heightPixel(24), borderBottomLeftRadius: widthPixel(0), borderBottomRightRadius: widthPixel(24) }}
      >
        <View style={{ ...styles.headerContainer, marginTop: heightPixel(10) + insets.top }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Image source={appIcons.backArrow} style={styles.backIcon} tintColor="#9A3412" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Streak Tracker</Text>
        </View>

        {/* Large Flame Display */}
        <View style={styles.streakDisplay}>
          <Image source={appIcons.fire} style={styles.largeFire} />
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>Day Streak</Text>
          {isPersonalBest && (
            <View style={styles.bestBadge}>
              <Text style={styles.bestText}>🌟 {personalBestMessage}</Text>
            </View>
          )}
        </View>

        {/* Weekly Calendar */}
        <View style={styles.calendarCard}>
          <View style={styles.daysRow}>
            {weeklyProgress.length > 0 ? (
              weeklyProgress.map((dayItem, index) => {
                let status = dayItem.status;
                if (status === 'current') status = 'today';
                if (status === 'completed') status = 'done';
                if (status === 'pending') status = 'future';

                return (
                  <DayItem key={index} day={dayItem.day.charAt(0)} status={status} />
                );
              })
            ) : (
              <>
                <DayItem day="M" status="future" />
                <DayItem day="T" status="future" />
                <DayItem day="W" status="future" />
                <DayItem day="T" status="future" />
                <DayItem day="F" status="future" />
                <DayItem day="S" status="future" />
                <DayItem day="S" status="future" />
              </>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatCard icon={appIcons.trophy} value={`${longestStreak}d`} label="Best Streak" />
          <StatCard icon={appIcons.calendar} value={daysActive.toString()} label="Days Active" />
          <StatCard icon={appIcons.thunder64} value={xpFromStreak.toLocaleString()} label="XP from Streak" />
        </View>

        {/* Milestones */}
        <Text style={styles.sectionTitle}>Milestones</Text>
        <View style={styles.milestonesContainer}>
          <MilestoneItem icon={appIcons.fire} title="First Flame" subtitle="3 day streak" status={currentStreak >= 3 ? "done" : (currentStreak < 3 && currentStreak >= 0 ? "next" : "locked")} />
          <MilestoneItem icon={appIcons.thunder64} title="Week Warrior" subtitle="7 day streak" status={currentStreak >= 7 ? "done" : (currentStreak < 7 && currentStreak >= 3 ? "next" : "locked")} />
          <MilestoneItem icon={appIcons.leaf} title="Eco Consistent" subtitle="12 day streak" status={currentStreak >= 12 ? "done" : (currentStreak < 12 && currentStreak >= 7 ? "next" : "locked")} />
          <MilestoneItem icon={appIcons.medal} title="3-Week Hero" subtitle="21 day streak" status={currentStreak >= 21 ? "done" : (currentStreak < 21 && currentStreak >= 12 ? "next" : "locked")} />
          <MilestoneItem icon={appIcons.calendar} title="Month Master" subtitle="30d" status={currentStreak >= 30 ? "done" : (currentStreak < 30 && currentStreak >= 21 ? "next" : "locked")} />
          <MilestoneItem icon={appIcons.calendar} title="Eco Legend" subtitle="60d" status={currentStreak >= 60 ? "done" : (currentStreak < 60 && currentStreak >= 30 ? "next" : "locked")} />
          <MilestoneItem icon={appIcons.calendar} title="Planet Guardian" subtitle="100d" status={currentStreak >= 100 ? "done" : (currentStreak < 100 && currentStreak >= 60 ? "next" : "locked")} isLast />
        </View>

        {/* Impact Box */}
        <View style={styles.impactBox}>
          <View style={styles.impactHeader}>
            <Text style={styles.impactTitle}>🌍 Your impact so far</Text>
          </View>
          <Text style={styles.impactText}>
            Your {currentStreak}-day streak has saved approximately <Text style={styles.boldImpact}>{co2Impact}kg CO₂</Text> and contributed to <Text style={styles.boldImpact}>{treesPlanted} trees</Text> being planted!
          </Text>
        </View>

        <View style={{ height: heightPixel(40) }} />
      </ScrollView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: heightPixel(40),
    paddingTop: heightPixel(24),
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthPixel(24),

    height: heightPixel(44),
  },
  backButton: {
    position: 'absolute',
    left: widthPixel(24),
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(22),
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
  },
  headerTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(18),
    color: '#92400E',
  },
  streakDisplay: {
    alignItems: 'center',
    marginTop: heightPixel(10),
    paddingBottom: heightPixel(20),
  },
  largeFire: {
    width: widthPixel(80),
    height: widthPixel(80),
  },
  streakNumber: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(60),
    color: '#D97706',

  },
  streakLabel: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(18),
    color: '#92400E',

  },
  bestBadge: {
    marginTop: heightPixel(6),
  },
  bestText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: '#B45309',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: widthPixel(20),
    borderRadius: widthPixel(24),
    padding: widthPixel(20),
    shadowColor: '#9A3412',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    alignItems: 'center',
    gap: heightPixel(8),
  },
  dayText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
  },
  dayCircle: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#D97706',
  },
  doneCircle: {
    backgroundColor: '#FDE68A',
  },
  futureCircle: {
    backgroundColor: '#0000000D',
  },
  missedCircle: {
    backgroundColor: '#0000000D',
  },
  checkIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  fireIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: widthPixel(20),
    gap: widthPixel(12),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(16),
    paddingVertical: heightPixel(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
    marginBottom: heightPixel(8),

  },
  statValue: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(18),
    color: '#111827',
  },
  statLabel: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(10),
    color: '#9CA3AF',
    marginTop: heightPixel(4),
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(16),
    color: '#111827',
    marginTop: heightPixel(24),
    marginBottom: heightPixel(18),
    paddingHorizontal: widthPixel(24),
  },
  milestonesContainer: {
    paddingHorizontal: widthPixel(24),
  },
  milestoneRow: {
    flexDirection: 'row',
    gap: widthPixel(16),
    marginBottom: heightPixel(4),
  },
  timelineWrapper: {
    alignItems: 'center',
    width: widthPixel(44),
  },
  timelineIcon: {
    width: widthPixel(46),
    height: widthPixel(46),
    borderRadius: widthPixel(23),
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#16A34A',
    zIndex: 1,
  },
  lockedIconBg: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  nextIconBg: {
    borderColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
  },
  mIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: heightPixel(-2),
  },
  activeLine: {
    backgroundColor: '#BBF7D0',
  },
  milestoneCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(16),
    padding: widthPixel(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: heightPixel(16),
  },
  doneCard: {
    borderColor: '#DCFCE7',
  },
  nextCard: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
  },
  mTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#111827',
  },
  mSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#9CA3AF',
    marginTop: heightPixel(2),
  },
  lockedText: {
    color: '#9CA3AF',
  },
  statusIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
  },
  nextBadge: {
    alignItems: 'flex-end',
  },
  nextText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(10),
    color: '#D97706',
  },
  nextDays: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#B45309',
    marginTop: heightPixel(2),
  },
  lockDays: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#CBD5E1',
  },
  impactBox: {
    backgroundColor: '#16A34A',
    marginHorizontal: widthPixel(24),
    marginTop: heightPixel(32),
    borderRadius: widthPixel(20),
    padding: widthPixel(16),
    paddingHorizontal: widthPixel(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  impactTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
    color: '#FFFFFF',
    marginBottom: heightPixel(8),
  },
  impactText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: fontPixel(20),
  },
  boldImpact: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#FFFFFF',
  },
});
