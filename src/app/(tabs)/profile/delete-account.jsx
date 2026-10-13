import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import ProfileHeader from '@/components/profile/ProfileHeader';
import CButton from '@/components/CButton';
import InputField from '@/components/InputField';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { appIcons } from '@/services/utilities/appAssets';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { wp } from '../../../services/utilities/appFontSizes';
import { useDisableProfile } from '@/hooks/useUser';
import { useAuth } from '@/context/AuthContext';
import { showMessage } from 'react-native-flash-message';

const LossItem = ({ icon, title, subtitle }) => (
  <View style={styles.lossItem}>
    <View style={styles.lossIconBg}>
      <Image source={icon} style={styles.lossIcon} resizeMode="contain" />
    </View>
    <View style={styles.lossText}>
      <Text style={styles.lossTitle}>{title}</Text>
      <Text style={styles.lossSubtitle}>{subtitle}</Text>
    </View>
    <Image source={appIcons.cross} style={styles.xIcon} tintColor="#DC2626" />
  </View>
);

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [step, setStep] = useState(1); // 1: Warning, 2: Confirmation, 3: Success
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const scrollRef = React.useRef(null);
  
  const { mutateAsync: disableProfile } = useDisableProfile();
  const { clearAuth } = useAuth();

  React.useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [step]);

  const inputColors = {
    inputBackground: colors.inputBackground,
    primary: colors.primary,
    darkGrey: colors.darkGrey,
    black: colors.black,
    text2: colors.text2,
  };

  if (step === 3) {
    return (
      <ParentWrapper>
        <View style={styles.successContainer}>
          <View style={styles.successIconWrapper}>
            <Image source={appIcons.cross} style={styles.largeXIcon} tintColor="#DC2626" />
          </View>
          <Text style={styles.successTitle}>Account Deleted</Text>
          <Text style={styles.successDesc}>
            Your EcoTrackr account has been permanently deleted. We're sorry to see you go. 🌱
          </Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxText}>
              All your data, including EcoScore, challenges, badges, and rewards, has been permanently removed from our servers.
            </Text>
          </View>

          <CButton 
            title="Back to Home" 
            onPress={async () => {
              await clearAuth();
            }} 
            changeMainContainer={styles.successBtn}
          />
        </View>
      </ParentWrapper>
    );
  }

  return (
    <ParentWrapper disableTopPadding={true}>
      <ProfileHeader 
       showBackButton={false}
        title="Delete Account" 
        subtitle="This action is permanent and cannot be undone"
        gradientColors={['#DC2626', '#7F1D1D']}
        textColor="#FFFFFF"
      />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Danger Zone Warning */}
          <View style={styles.warningBox}>
            <View style={styles.warningHeader}>
              <Image source={appIcons.alertFill} style={styles.warningIcon} tintColor="#DC2626" />
              <Text style={styles.warningTitle}>Danger Zone</Text>
            </View>
            <Text style={styles.warningText}>
              Deleting your account is <Text style={styles.boldText}>permanent and irreversible</Text>. All your data will be wiped immediately. This cannot be undone.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>You will permanently lose:</Text>
          <View style={styles.lossCard}>
            <LossItem icon={appIcons.medal} title="Level 8 account" subtitle="All your progress will be gone" />
            <LossItem icon={appIcons.star} title="2,340 EcoMiles" subtitle="Points cannot be recovered" />
            <LossItem icon={appIcons.fire} title="12-day streak" subtitle="Your streak will be lost" />
            <LossItem icon={appIcons.doubleLeaf} title="EcoScore: 847" subtitle="Impact history deleted" />
            <LossItem icon={appIcons.trophy} title="All badges & rewards" subtitle="Cannot be restored" />
          </View>

          {step === 1 ? (
            <>
              <View style={styles.considerBox}>
                <View style={styles.considerHeader}>
                  {/* <Image source={appIcons.leaf} style={styles.considerIcon} tintColor="#16A34A" /> */}
                  <Text style={styles.considerTitle}>💡 Consider Instead</Text>
                </View>
                <Text style={styles.considerText}>
                  You can pause notifications, reset your challenges, or simply sign out. Your eco journey progress is worth keeping!
                </Text>
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.keepBtn} onPress={() => router.back()}>
                  <Text style={styles.keepBtnText}>Keep My Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.continueBtn} onPress={() => setStep(2)}>
                  <Text style={styles.continueBtnText}>Continue to Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.confirmSection}>
              <View style={styles.confirmCard}>
                <View style={[styles.inputGroup, { marginBottom: 0 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: heightPixel(12) }}>
                    <Text style={styles.inputLabel}>Type </Text>
                    <View style={styles.deleteBadge}><Text style={styles.deleteLabel}>DELETE</Text></View>
                    <Text style={styles.inputLabel}> to confirm:</Text>
                  </View>
                  <TextInput 
                    style={styles.confirmInput}
                    placeholder="Type DELETE here"
                    placeholderTextColor="#FCA5A5"
                    value={confirmText}
                    onChangeText={setConfirmText}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <View style={styles.confirmCard}>
                <View style={[styles.inputGroup, { marginBottom: 0 }]}>
                  <InputField
                    title="Enter your password:"
                    colors={inputColors}
                    placeholder="••••••••"
                    leftIcon={appIcons.lock}
                    hideValue={!showPassword}
                    rightEyeIcon={true}
                    onPressEyeIcon={() => setShowPassword(!showPassword)}
                    showPassword={showPassword}
                    value={password}
                    onChangeText={setPassword}
                    changeMainContainer={{ marginHorizontal: 0, marginTop: 0 }}
                  />
                </View>
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setStep(1)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.finalDeleteBtn, (confirmText !== 'DELETE' || !password) && styles.disabledBtn]} 
                  disabled={confirmText !== 'DELETE' || !password}
                  onPress={async () => {
                    try {
                      await disableProfile({ password, role: 'user' });
                      setStep(3);
                    } catch (e) {
                      const errorMessage = e?.response?.data?.message || 'Error deleting account';
                      showMessage({ message: errorMessage, type: 'danger' });
                    }
                  }}
                >
                  <Image source={appIcons.bin} style={styles.btnIcon} tintColor="#FFFFFF" />
                  <Text style={styles.finalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: heightPixel(40) }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: heightPixel(20),
    paddingHorizontal: widthPixel(20),
  },
  warningBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: widthPixel(20),
    padding: widthPixel(20),
    marginTop: heightPixel(20),
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
    marginBottom: heightPixel(8),
  },
  warningIcon: {
    width: widthPixel(16),
    height: widthPixel(16),
  },
  warningTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(15),
    color: '#DC2626',
  },
  warningText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: '#7F1D1D',
    lineHeight: fontPixel(20),
  },
  boldText: {
    fontFamily: FontFamily.InterBold,
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#374151',
    marginTop: heightPixel(24),
    marginBottom: heightPixel(12),
  },
  lossCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(24),
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(16),
    borderWidth: 1,
    borderColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  lossItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: heightPixel(12),
  },
  lossIconBg: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(12),
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lossIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
  },
  lossText: {
    flex: 1,
    marginLeft: widthPixel(16),
  },
  lossTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#111827',
  },
  lossSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    marginTop: heightPixel(2),
  },
  xIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  considerBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: widthPixel(16),
    padding: widthPixel(16),
    marginTop: heightPixel(24),
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  considerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
    marginBottom: heightPixel(8),
  },
  considerIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  considerTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#16A34A',
  },
  considerText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#166534',
    lineHeight: fontPixel(18),
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: heightPixel(32),
    gap: widthPixel(12),
  },
  keepBtn: {
    flex: 1,
    height: heightPixel(56),
    borderRadius: widthPixel(16),
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  keepBtnText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#16A34A',
  },
  continueBtn: {
    flex: 1,
    height: heightPixel(56),
    borderRadius: widthPixel(16),
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  continueBtnText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#DC2626',
  },
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(24),
    padding: widthPixel(20),
    marginBottom: heightPixel(16),
    borderWidth: 1,
    borderColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  confirmSection: {
    marginTop: heightPixel(24),
  },
  inputGroup: {
    marginBottom: heightPixel(20),
  
  },
  inputLabel: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#1E293B',
  },
  deleteBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(2),
    borderRadius: widthPixel(6),
    marginHorizontal: widthPixel(4),
    marginTop:heightPixel(-2)
  },
  deleteLabel: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#EF4444',
   
    
  },
  confirmInput: {
    height: heightPixel(56),
    backgroundColor: '#F9FAFB',
    borderRadius: widthPixel(16),
    paddingHorizontal: widthPixel(20),
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#DC2626',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    textAlign: 'left',
  },
  cancelBtn: {
    flex: 1,
    height: heightPixel(56),
    borderRadius: widthPixel(16),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelBtnText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#64748B',
  },
  finalDeleteBtn: {
    flex: 1,
    height: heightPixel(56),
    borderRadius: widthPixel(16),
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: widthPixel(8),
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
  },
  finalDeleteText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  successIconWrapper: {
    width: widthPixel(90),
    height: widthPixel(90),
    borderRadius: widthPixel(60),
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPixel(24),
    borderColor:"#FECACA",
    borderWidth: 3
  },
  largeXIcon: {
    width: widthPixel(60),
    height: widthPixel(60),
  },
  successTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(22),
    color: '#111827',
    marginBottom: heightPixel(10),
  },
  successDesc: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: fontPixel(22),
  },
  infoBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: widthPixel(20),
    padding: widthPixel(20),
    marginTop: heightPixel(32),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: heightPixel(32),
    marginHorizontal: wp(4),
  },
  infoBoxText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: fontPixel(20),

  },
  successBtn: {
    width: wp(90),
    
  },
});
