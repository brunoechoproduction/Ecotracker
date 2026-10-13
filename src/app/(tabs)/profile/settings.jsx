import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import ParentWrapper from '@/components/ParentWrapper';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { FontFamily } from '@/constants/Fonts';
import { appIcons } from '@/services/utilities/appAssets';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { SettingItem } from '@/components/profile/SettingItem';
import { ToggleItem } from '@/components/profile/ToggleItem';
import { useLogout, useUpdateProfile } from '@/hooks/useAuth';
import { useAuth } from '@/context/AuthContext';
import { getUserLevelInfo } from '@/services/utilities/levels';
import LogoutModal from '@/components/profile/LogoutModal';



export default function SettingsScreen() {
  const router = useRouter();
  const { clearAuth, user, updateUser } = useAuth();
  
  const [pushEnabled, setPushEnabled] = useState(user?.isNotification ?? true);
  const [remindersEnabled, setRemindersEnabled] = useState(user?.isChallengeReminder ?? true);
  const [locationEnabled, setLocationEnabled] = useState(user?.isLocationServices ?? true);
  const [emailEnabled, setEmailEnabled] = useState(user?.isEmailUpdates ?? false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const { mutateAsync: logoutApi } = useLogout();
  const { mutateAsync: updateProfileApi } = useUpdateProfile();

  const handleToggle = async (key, value, setter) => {
    // Optimistic UI update
    setter(value);
    
    try {
      // Call API
      await updateProfileApi({ [key]: value });
      
      // Update local context to persist state
      if (user) {
        updateUser({ ...user, [key]: value });
      }
    } catch (error) {
      console.log(`Failed to update ${key} preference:`, error);
      // Revert if failed
      setter(!value);
    }
  };

  const handlePushToggle = (value) => handleToggle('isNotification', value, setPushEnabled);
  const handleRemindersToggle = (value) => handleToggle('isChallengeReminder', value, setRemindersEnabled);
  const handleLocationToggle = (value) => handleToggle('isLocationServices', value, setLocationEnabled);
  const handleEmailToggle = (value) => handleToggle('isEmailUpdates', value, setEmailEnabled);

  const handleLogout = async () => {
    try {
      await logoutApi({});
    } catch (e) {}
    setLogoutModalVisible(false);
    await clearAuth();
  };



  const { currentLevel } = getUserLevelInfo(user?.xp || 0);

  return (
    <ParentWrapper disableTopPadding={true}>
      <ProfileHeader 
       showBackButton={false}
        title="Settings" 
        subtitle=""
        gradientColors={['#16A34A', '#15803D']}
      >
        {/* Profile Preview Row inside Header */}
        <View style={styles.profileRow}>
          <Image source={user?.image && user.image !== 'null' ? { uri: user.image } : appIcons.women} style={styles.avatar} />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{user?.name && user.name !== 'null' ? user.name : 'User'}</Text>
            <Text style={styles.profileMeta}>Level {currentLevel.level} {currentLevel.name} • Rank #3</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/(tabs)/profile/edit-profile')}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </ProfileHeader>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.settingsCard}>
          <SettingItem 
            icon={appIcons.person} 
            title="Edit Profile" 
            subtitle="Update your info & photo" 
            iconColor="#16A34A"
            onPress={() => router.push('/(tabs)/profile/edit-profile')}
          />
          <SettingItem 
            icon={appIcons.lock} 
            title="Change Password" 
            subtitle="Update your password" 
            iconColor="#3B82F6"
            onPress={() => router.push('/(tabs)/profile/change-password')}
            isLast
          />
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.settingsCard}>
          <ToggleItem 
            icon={appIcons.bell} 
            title="Push Notifications" 
            value={pushEnabled}
            onToggle={handlePushToggle}
            iconColor="#F59E0B"
          />
          <ToggleItem 
            icon={appIcons.bell} 
            title="Challenge Reminders" 
            value={remindersEnabled}
            onToggle={handleRemindersToggle}
            iconColor="#8B5CF6"
          />
          <ToggleItem 
            icon={appIcons.world} 
            title="Location Services" 
            value={locationEnabled}
            onToggle={handleLocationToggle}
            iconColor="#10B981"
          />
          <ToggleItem 
            icon={appIcons.information} 
            title="Email Updates" 
            value={emailEnabled}
            onToggle={handleEmailToggle}
            iconColor="#64748B"
            isLast
          />
        </View>

        {/* Legal & Privacy Section */}
        <Text style={styles.sectionTitle}>LEGAL & PRIVACY</Text>
        <View style={styles.settingsCard}>
          <SettingItem 
            icon={appIcons.shieldOutline} 
            title="Privacy Policy" 
            iconColor="#8B5CF6"
            onPress={() => router.push('/(tabs)/profile/privacy-policy')}
          />
          <SettingItem 
            icon={appIcons.page} 
            title="Terms & Conditions" 
            iconColor="#F59E0B"
            onPress={() => router.push('/(tabs)/profile/terms')}
            isLast
          />
        </View>

        {/* Support Section */}
        <Text style={styles.sectionTitle}>SUPPORT</Text>
        <View style={styles.settingsCard}>

          <SettingItem 
            icon={appIcons.chat} 
            title="Contact Us" 
            subtitle="We reply within 24h" 
            iconColor="#10B981"
            onPress={() => router.push('/(tabs)/profile/support')}
            isLast
          />
        </View>

        {/* Danger Zone Section */}
        <Text style={styles.sectionTitle}>DANGER ZONE</Text>
        <View style={styles.settingsCard}>
          <SettingItem 
            icon={appIcons.bin} 
            title="Delete Account" 
            subtitle="Permanently remove your data" 
            iconColor="#DC2626"
            titleColor="#DC2626"
            onPress={() => router.push('/(tabs)/profile/delete-account')}
            isLast
          />
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={() => setLogoutModalVisible(true)}>
          <Image source={appIcons.logout} style={styles.signOutIcon} tintColor="#DC2626" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>EcoTrackr v{Constants.expoConfig?.version || '1.0.0'} • © 2026</Text>
        
        <View style={{ height: heightPixel(40) }} />
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
 
    marginTop: heightPixel(16),
    padding: widthPixel(16),
    borderRadius: widthPixel(20),
  },
  avatar: {
    width: widthPixel(50),
    height: widthPixel(50),
    borderRadius: widthPixel(25),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  profileText: {
    flex: 1,
    marginLeft: widthPixel(16),
  },
  profileName: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
    color: '#FFFFFF',
  },
  profileMeta: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: heightPixel(2),
  },
  editBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(8),
  },
  editBtnText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(12),
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    marginTop: heightPixel(24),
    marginBottom: heightPixel(12),
    marginHorizontal: widthPixel(24),
    letterSpacing: 0.5,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: widthPixel(20),
    borderRadius: widthPixel(24),
    paddingVertical: heightPixel(4),
    borderWidth: 1,
    borderColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  signOutBtn: {
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(32),
    height: heightPixel(56),
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
    fontSize: fontPixel(15),
    color: '#DC2626',
  },
  versionText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#D1D5DB',
    textAlign: 'center',
    marginTop: heightPixel(24),
  },
});
