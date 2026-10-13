import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AppColors } from '@/constants/AppColors';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

const CustomButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={AppColors.textWhite} size="small" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: AppColors.primary,
    height: heightPixel(56),
    borderRadius: widthPixel(16),
    marginHorizontal: widthPixel(20),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: AppColors.iconGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(16),
    color: AppColors.textWhite,
    letterSpacing: 0.5,
  },
});

export default CustomButton;
