import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Image, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';

const LogoutModal = ({ isVisible, onClose, onLogout }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <Image 
                source={appIcons.logout} 
                style={styles.logoutIcon} 
                tintColor="#EF4444" 
              />
            </View>
            
            <Text style={styles.title}>Are you sure?</Text>
            <Text style={styles.description}>
              You are about to log out of your account. You'll need to enter your credentials to sign back in.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.logoutBtn} 
                onPress={onLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutBtnText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: widthPixel(32),
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(32),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  content: {
    padding: widthPixel(24),
    alignItems: 'center',
  },
  iconCircle: {
    width: widthPixel(64),
    height: widthPixel(64),
    borderRadius: widthPixel(32),
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPixel(16),
  },
  logoutIcon: {
    width: widthPixel(28),
    height: widthPixel(28),
    marginLeft: widthPixel(4), // Slight offset for visual balance of the logout icon
  },
  title: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(20),
    color: '#1E293B',
    marginBottom: heightPixel(12),
  },
  description: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    color: '#64748B',
    textAlign: 'center',
    lineHeight: fontPixel(22),
    marginBottom: heightPixel(24),
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: widthPixel(12),
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: heightPixel(52),
    borderRadius: widthPixel(16),
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(15),
    color: '#475569',
  },
  logoutBtn: {
    flex: 1,
    height: heightPixel(52),
    borderRadius: widthPixel(16),
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutBtnText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
    color: '#FFFFFF',
  },
});

export default LogoutModal;
