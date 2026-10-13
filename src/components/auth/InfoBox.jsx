import { Image, StyleSheet, Text, View } from 'react-native';
import { AppColors } from '@/constants/AppColors';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { hp } from '../../services/utilities/appFontSizes';

// Map icon names to local assets — fallback to emoji label if no asset
const ICON_MAP = {
  'time-outline': require('../../../assets/icons/recycle.png'),   // closest available
  'lock-closed-outline': require('../../../assets/icons/lock.png'),
  'bell': require('../../../assets/icons/bell.png'),
};

const InfoBox = ({ icon = 'time-outline', text, emoji, variant = 'info' }) => {
  const localIcon = ICON_MAP[icon];
  
  const isWarning = variant === 'warning';
  const bgColor = isWarning ? AppColors.warningBackground : "#F0FDF4";
  const textColor = isWarning ? AppColors.warningText : '#16A34A';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {emoji ? (
        <Text style={styles.emoji}>{emoji}</Text>
      ) : localIcon ? (
        <Image source={localIcon} style={[styles.icon, { tintColor: textColor }]} resizeMode="contain" />
      ) : null}
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: widthPixel(8),
    borderRadius: widthPixel(12),
    padding: heightPixel(12),
    height:hp(8),
    marginHorizontal: widthPixel(20),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  icon: {
    width: widthPixel(16),
    height: widthPixel(16),
    marginTop: heightPixel(2),
  },
  emoji: {
    fontSize: fontPixel(13),
  },
  text: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    flex: 1,
    lineHeight:18,
  },
});

export default InfoBox;
