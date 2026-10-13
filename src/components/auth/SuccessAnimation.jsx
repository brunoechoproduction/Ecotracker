import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/AppColors';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

const SuccessAnimation = () => {
  return (
    <View style={styles.outer}>
      <View style={styles.circle}>
        <Ionicons name="checkmark" size={fontPixel(70)} color={AppColors.textWhite} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    marginTop: heightPixel(32),
  },
  circle: {
    width: widthPixel(140),
    height: widthPixel(140),
    borderRadius: widthPixel(70),
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
});

export default SuccessAnimation;
