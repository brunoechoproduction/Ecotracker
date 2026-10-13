import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';

const StatBox = ({ icon, value, label }) => (
  <View style={styles.statBox}>
    <View style={styles.statRow}>
      <Image source={icon} style={styles.statIcon} resizeMode="contain" />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

import Svg, { Circle } from 'react-native-svg';

const CircularProgress = ({ size, strokeWidth, progress, score }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.circularContainer}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFFFFF"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.scoreTextContainer}>
        <Text style={styles.scoreText}>{score}</Text>
        <Text style={styles.scoreSubtext}>EcoScore</Text>
      </View>
    </View>
  );
};

const DashboardCard = ({ stats }) => {
  const score = stats?.ecoScore ?? 0;
  const points = stats?.points ?? 0;
  const xp = stats?.xp ?? 0;
  const streak = stats?.streak ?? 0;
  const level = stats?.level ?? 0;

  // Assuming 1000 is the target score for 100%
  const progress = Math.min((score / 1000) * 100, 100);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreSection}>
        <CircularProgress
          size={widthPixel(90)}
          strokeWidth={widthPixel(8)}
          progress={progress}
          score={score}
        />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.row}>
          <StatBox
            icon={appIcons.earth}
            value={formatNumber(points)}
            label="EcoMiles"
          />
          <StatBox
            icon={appIcons.thunder64}
            value={formatNumber(xp)}
            label="XP"
          />
        </View>
        <View style={styles.row}>
          <StatBox
            icon={appIcons.fire}
            value={`${streak}d`}
            label="Streak"
          />
          <StatBox
            icon={appIcons.medal}
            value={level.toString()}
            label="Level"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#16A34A',
    marginHorizontal: widthPixel(20),
    borderRadius: widthPixel(28),
    padding: widthPixel(24),
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(20),
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  scoreSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularContainer: {
    width: widthPixel(100),
    height: widthPixel(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(20),
    color: '#FFFFFF',
    lineHeight: fontPixel(24),
  },
  scoreSubtext: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(10),
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: heightPixel(-2),
  },
  statsGrid: {
    flex: 1,
    gap: heightPixel(12),
  },
  row: {
    flexDirection: 'row',
    gap: widthPixel(12),
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: widthPixel(16),
    padding: widthPixel(12),
  },
  statIcon: {
    width: widthPixel(15),
    height: widthPixel(15),
    marginBottom: heightPixel(4),
  },
  statValue: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
    color: '#FFFFFF',
  },
  statLabel: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(10),
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default DashboardCard;
