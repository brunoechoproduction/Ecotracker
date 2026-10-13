import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import moment from 'moment';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

const ChallengeCard = ({ icon, title, points, timeLeft, buttonText, buttonColor = '#16A34A', onPress }) => {
  const formatTimeLeft = (time) => {
    if (!time) return '';

    // Check if it's already a formatted duration (e.g. ends with d, h, m, s)
    if (/^\d+[dhms]$/.test(String(time))) {
      return time;
    }

    const date = moment(time);
    if (!date.isValid()) {
      return time; // Fallback to raw string
    }

    const now = moment();
    const duration = moment.duration(date.diff(now));

    if (duration.asMilliseconds() <= 0) {
      return '0s';
    }

    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours()) % 24;
    const minutes = Math.floor(duration.asMinutes()) % 60;
    const seconds = Math.floor(duration.asSeconds()) % 60;

    if (days > 0) {
      return `${days}d`;
    }
    if (hours > 0) {
      return `${hours}h`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return `${seconds}s`;
  };

  const formattedTimeLeft = formatTimeLeft(timeLeft);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} contentFit="contain" />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.points}>{points}</Text>
      </View>

      <View style={styles.timeRow}>
        <Text style={styles.timeText}>
          <Text style={styles.timerEmoji}>⏱</Text> {formattedTimeLeft} left
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonColor }]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: widthPixel(170),
    backgroundColor: '#F0FDF4',
    borderRadius: widthPixel(24),
    padding: widthPixel(16),
    marginRight: widthPixel(16),
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  iconContainer: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(12),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPixel(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  icon: {
    width: widthPixel(24),
    height: widthPixel(24),
  },
  titleContainer: {

  },
  title: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#111827',
  },
  points: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(11),
    color: '#16A34A',
    marginTop: heightPixel(2),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: heightPixel(12),
    gap: widthPixel(4),
  },
  timeText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(10),
    color: '#6B7280',
  },
  timerEmoji: {
    fontSize: fontPixel(14),
  },
  button: {
    height: heightPixel(36),
    borderRadius: widthPixel(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightPixel(12),
  },
  buttonText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#FFFFFF',
  },
});

export default ChallengeCard;
