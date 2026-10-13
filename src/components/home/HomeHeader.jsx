import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { useAuth } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';

const HomeHeader = () => {
  const router = useRouter();
  const { user } = useAuth();
  const name = user?.name || 'User';
  
  // Consume the global unread notification state
  const { hasUnread, setHasUnread } = useNotificationContext();

  const handleNotificationPress = () => {
    // Clear the unread badge when clicked
    setHasUnread(false);
    router.push('/notifications');
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>Good morning </Text>
          <Image source={require('../../../assets/icons/double_leaf.png')} style={styles.leafIcon} />
        </View>
        <Text style={styles.nameText}>{name}</Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity 
          style={styles.notificationBtn}
          onPress={handleNotificationPress}
        >
          <Image source={require('../../../assets/icons/bell.png')} style={styles.bellIcon} />
          {hasUnread && <View style={styles.badge} />}
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={user?.image ? { uri: user.image } : require('../../../assets/icons/women.png')} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(12),
    paddingBottom: heightPixel(20),
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: '#6B7280',
  },
  leafIcon: {
    width: widthPixel(16),
    height: widthPixel(16),
    tintColor: '#16A34A',
  },
  nameText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(20),
    color: '#111827',
    marginTop: heightPixel(2),
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(12),
  },
  notificationBtn: {
    width: widthPixel(44),
    height: widthPixel(44),
    borderRadius: widthPixel(20),
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    tintColor: '#16A34A',
  },
  badge: {
    position: 'absolute',
    top: heightPixel(10),
    right: widthPixel(10),
    width: widthPixel(10),
    height: widthPixel(10),
    borderRadius: widthPixel(5),
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatar: {
    width: widthPixel(44),
    height: widthPixel(44),
    borderRadius: widthPixel(22),
  },
});

export default HomeHeader;
