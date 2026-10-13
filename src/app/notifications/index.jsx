import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import ParentWrapper from '@/components/ParentWrapper';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, hp, widthPixel, wp } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';
import { 
  useNotifications, 
  useUnreadNotificationCount, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead, 
  useDeleteNotification, 
  useDeleteAllNotifications 
} from '@/hooks/useNotifications';
import { showMessage } from 'react-native-flash-message';
import LoadingSpinner from '@/components/LoadingSpinner';

const FILTERS = [
  { id: 'all', label: 'All', icon: appIcons.notificationBell },
  { id: 'challenges', label: 'Challenges', icon: appIcons.notificationChallenge },
  { id: 'rewards', label: 'Rewards', icon: appIcons.notificationReward },
  { id: 'system', label: 'System', icon: appIcons.notificationSystem },
];

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + "y ago";
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + "mo ago";
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + "d ago";
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + "h ago";
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + "m ago";
  
  if (seconds < 10) return "Just now";
  return Math.floor(seconds) + "s ago";
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: fetchedNotificationsData, isLoading, refetch } = useNotifications({ type: activeFilter });
  const { data: unreadData } = useUnreadNotificationCount();
  const { mutateAsync: markAsRead } = useMarkNotificationAsRead();
  const { mutateAsync: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutateAsync: deleteNotification } = useDeleteNotification();
  const { mutateAsync: deleteAllNotifications } = useDeleteAllNotifications();

  const globalUnreadCount = unreadData?.data?.unread ?? 0;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refetch) await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Determine if we should use API data or fallback to dummy data if empty/loading for now
  const backendNotifications = fetchedNotificationsData?.data?.notifications || fetchedNotificationsData?.notifications || [];
  
  const getNotificationStyles = (type, category) => {
    if (type === 'new_daily_challenges' || category === 'challenge') {
      return { icon: appIcons.notificationChallenge, color: '#16A34A', bgColor: '#F0FDF4' };
    } else if (category === 'streak') {
      return { icon: appIcons.fire, color: '#EA580C', bgColor: '#FFF7ED' };
    } else if (category === 'reward') {
      return { icon: appIcons.notificationReward, color: '#F59E0B', bgColor: '#FFFBEB' };
    }
    return { icon: appIcons.notificationSystem, color: '#3B82F6', bgColor: '#EFF6FF' };
  };

  const mappedNotifications = backendNotifications.map((notif) => {
    const styles = getNotificationStyles(notif.notifyType, notif.category);
    return {
      id: notif._id || notif.id || Math.random().toString(),
      type: notif.category || notif.type || 'system',
      title: notif.title || 'Notification',
      message: notif.desc || notif.message || notif.body || '',
      time: notif.createdAt ? formatTimeAgo(notif.createdAt) : 'Just now',
      createdAt: notif.createdAt ? new Date(notif.createdAt) : new Date(),
      unread: notif.isRead !== undefined ? !notif.isRead : (notif.isSeen ? notif.isSeen.length === 0 : true),
      action: notif.data?.actionLabel || notif.action || 'View',
      icon: styles.icon,
      color: styles.color,
      bgColor: styles.bgColor,
    };
  });

  const [notifications, setNotifications] = useState(mappedNotifications);

  // Update local state when API data changes
  React.useEffect(() => {
    setNotifications(mappedNotifications);
  }, [fetchedNotificationsData]);

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    try {
      return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
    } catch (e) {
      return false;
    }
  };

  const newNotifications = notifications.filter(n => {
    const date = n.createdAt instanceof Date ? n.createdAt : new Date();
    return isSameDay(date, new Date());
  });
  const earlierNotifications = notifications.filter(n => {
    const date = n.createdAt instanceof Date ? n.createdAt : new Date();
    return !isSameDay(date, new Date());
  });

  const handleClearAll = async () => {
    try {
      await deleteAllNotifications();
      showMessage({ message: 'Notifications cleared', type: 'success' });
    } catch (e) {
      showMessage({ message: 'Failed to clear notifications', type: 'danger' });
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (e) {
      showMessage({ message: 'Failed to mark as read', type: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
    } catch (e) {
      showMessage({ message: 'Failed to delete notification', type: 'danger' });
    }
  };

  const renderNotification = ({ item }) => (
    <View style={[styles.card, { backgroundColor: item.bgColor }]}>
      {/* Left Accent Bar */}
      <View style={[styles.leftBar, { backgroundColor: item.color }]} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { borderColor: item.color + '40', backgroundColor: item.color + '15' }]}>
            <Image source={item.icon} style={styles.cardIcon} />
          </View>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={[styles.cardTitle, { color: "#111827" }]}>{item.title}</Text>
              <View style={styles.headerRight}>
                {item.unread && <View style={[styles.unreadDot, { backgroundColor: item.color }]} />}
                <Text style={[styles.timeText, { color: "#9CA3AF" }]}>{item.time}</Text>
              </View>
            </View>
            <Text style={[styles.message, { color: "#6B7280" }]}>{item.message}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <View style={styles.actionsLeft}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: item.color }]}
              onPress={() => {
                if (
                  item.action?.toLowerCase().includes('challenge') || 
                  item.type?.toLowerCase().includes('challenge')
                ) {
                  router.push('/(tabs)/challenges');
                }
              }}
            >
              <Text style={styles.actionButtonText}>{item.action} →</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleMarkRead(item.id)} style={styles.markReadButton}>
              <Text style={[styles.markReadText, { color: "#9CA3AF" }]}>Mark read</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
            <Image source={appIcons.bin} style={styles.deleteIcon} tintColor={colors.textPlaceholder} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const unreadCount = globalUnreadCount;

  return (
    <ParentWrapper style={{ backgroundColor: colors.background }} disableTopPadding={true}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#16A34A', '#14532D']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Image 
              source={appIcons.chevronRight} 
              style={styles.backIcon} 
              tintColor={"#FFFFFF"}
            />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.unreadCount}>{unreadCount} unread</Text>
          </View>
          <TouchableOpacity style={styles.markAllButton} onPress={handleClearAll}>
            <Text style={styles.markAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryBar}>
          <View style={styles.yellowDot} />
          <Text style={styles.summaryText}>You have {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#16A34A" />
        }
      >
        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterContainer}
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            const filterCount = fetchedNotificationsData?.data?.summary?.[filter.id] ?? 0;
            return (
              <TouchableOpacity 
                key={filter.id}
                style={[
                  styles.filterChip, 
                  { backgroundColor: isActive ? '#16A34A' : "#F3F4F6" }
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Image 
                  source={filter.icon} 
                  style={styles.filterIcon} 
                />
                <Text style={[styles.filterLabel, { color: isActive ? '#FFFFFF' : "#6B7280" }]}>
                  {filter.label}
                </Text>
                <View style={[styles.countBadge, { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : "#E5E7EB" }]}>
                  <Text style={[styles.countText, { color: isActive ? '#FFFFFF' : "#9CA3AF" }]}>
                    {filterCount}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: "#9CA3AF" }]}>NEW</Text>
          {isLoading && !isRefreshing ? (
            <LoadingSpinner isVisible={true} />
          ) : (
            <FlatList
              data={newNotifications}
              renderItem={renderNotification}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListEmptyComponent={<Text style={{ color: colors.textPlaceholder, textAlign: 'center', marginTop: 20 }}>No new notifications</Text>}
            />
          )}

          {earlierNotifications.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.textPlaceholder, marginTop: heightPixel(24) }]}>EARLIER</Text>
              <FlatList
                data={earlierNotifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          )}
        </View>
        <View style={{ height: heightPixel(40) }} />
      </ScrollView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: hp(6),
    paddingBottom: heightPixel(24),
    paddingHorizontal: widthPixel(20),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(10),
    backgroundColor: '#FFFFFF26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: widthPixel(22),
    height: widthPixel(22),
    transform: [{ rotate: '180deg' }],

  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: widthPixel(16),
  },
  headerTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(20),
    color: '#FFFFFF',
  },
  unreadCount: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#FFFFFFB2',
  },
  markAllButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(8),
    borderRadius: widthPixel(8),
  },
  markAllText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(12),
    color: '#FFFFFF',
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginTop: heightPixel(24),
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(16),
    borderRadius: widthPixel(8),
  },
  yellowDot: {
    width: widthPixel(8),
    height: widthPixel(8),
    borderRadius: widthPixel(4),
    backgroundColor: '#FCD34D',
    marginRight: widthPixel(10),
  },
  summaryText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(13),
    color: '#FFFFFF',
  },
  filterContainer: {
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(20),
    gap: widthPixel(12),
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(8),
    borderRadius: widthPixel(100),
    gap: widthPixel(8),
    overflow: 'hidden',
  },
  filterChipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(8),
    gap: widthPixel(8),
  },
  filterIcon: {
    width: widthPixel(16),
    height: widthPixel(16),
  },
  filterLabel: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
  },
  countBadge: {
    paddingHorizontal: widthPixel(6),
    paddingVertical: heightPixel(2),
    borderRadius: widthPixel(8),
  },
  countText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
  },
  content: {
    paddingHorizontal: widthPixel(20),
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    letterSpacing: 1,
    marginBottom: heightPixel(16),
  },
  card: {
    borderRadius: widthPixel(24),
    marginBottom: heightPixel(16),
    overflow: 'hidden',
    flexDirection: 'row',
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  leftBar: {
    width: widthPixel(6),
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: widthPixel(16),
  },
  cardHeader: {
    flexDirection: 'row',
    gap: widthPixel(12),
  },
  iconBox: {
    width: widthPixel(56),
    height: widthPixel(56),
    borderRadius: widthPixel(18),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    width: widthPixel(28),
    height: widthPixel(28),
  },
  titleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: heightPixel(4),
  },
  cardTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(13),
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: widthPixel(7),
    height: widthPixel(7),
    borderRadius: widthPixel(4),
    marginRight: widthPixel(8),
  },
  timeText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(10),
  },
  message: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    lineHeight: fontPixel(20),
    marginTop: heightPixel(2),
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: heightPixel(16),
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(16),
  },
  actionButton: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(10),
    borderRadius: widthPixel(14),
  },
  actionButtonText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#FFFFFF',
  },
  markReadButton: {
    paddingVertical: heightPixel(8),
  },
  markReadText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(11),
  },
  deleteButton: {
    padding: widthPixel(4),
  },
  deleteIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
  },
});
