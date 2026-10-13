import { StyleSheet, Text, View } from 'react-native';
import { AppColors } from '@/constants/AppColors';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

const getStrength = (password) => {
  if (!password) return { level: 0, label: 'Enter a password', color: '#E5E7EB' };
  if (password.length < 6) return { level: 1, label: 'Too short', color: '#F59E0B' };
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (score < 2) return { level: 2, label: 'Too short', color: '#F59E0B' };
  if (score === 2) return { level: 3, label: 'Fair', color: '#16A34A' };
  return { level: 4, label: 'Strong ✓', color: '#16A34A' };
};

const PasswordStrengthIndicator = ({ password }) => {
  const { level, label } = getStrength(password);

  return (
    <View style={styles.container}>
      <Text style={styles.labelTitle}>Password strength:</Text>
      
      <View style={styles.barsRow}>
        {[1, 2, 3, 4].map((bar) => (
          <View
            key={bar}
            style={[
              styles.bar,
              { 
                backgroundColor: bar <= level 
                  ? (bar <= 2 ? '#F59E0B' : '#16A34A') 
                  : '#E5E7EB' 
              },
            ]}
          />
        ))}
      </View>
      
      <Text style={[
        styles.labelStatus, 
        { color: level === 0 ? '#9CA3AF' : (level <= 2 ? '#F59E0B' : '#16A34A') }
      ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(16),
    gap: heightPixel(6),
  },
  labelTitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: '#6B7280',
    lineHeight: 19,
  },
  barsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: widthPixel(6),
    marginTop: heightPixel(4),
  },
  bar: {
    flex: 1,
    height: heightPixel(4),
    borderRadius: widthPixel(2),
  },
  labelStatus: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    marginTop: heightPixel(2),
  },
});

export default PasswordStrengthIndicator;
