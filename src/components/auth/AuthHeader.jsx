import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

const AuthHeader = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <LinearGradient
      colors={['#16A34A', '#15803D']}
      locations={[0.0849, 0.9151]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[
        styles.container,
        { paddingTop: insets.top + heightPixel(16) },
        style,
      ]}
    >
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.7}>
          <Image
            source={require('../../../assets/icons/left_white_chevron.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}

      {/* Logo */}
      <View style={[styles.logoContainer, { backgroundColor: colors.background }]}>
        <Image
          source={require('../../../assets/icons/leaf.png')}
          style={styles.logoIcon}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthPixel(20),
    paddingBottom: heightPixel(32),
    alignItems: 'center',
    borderBottomLeftRadius: widthPixel(32),
    borderBottomRightRadius: widthPixel(32),
  },
  backButton: {
    position: 'absolute',
    top: heightPixel(56),
    left: widthPixel(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(4),
  },
  backIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    tintColor: '#FFFFFF',
  },
  backText: {
    fontFamily: FontFamily.InterMedium,
    fontSize: fontPixel(14),
    color: '#FFFFFFCC',
  },
  logoContainer: {
    width: widthPixel(70),
    height: widthPixel(70),
    borderRadius: widthPixel(20),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: heightPixel(20),
    marginTop: heightPixel(30)
  },
  logoIcon: {
    width: widthPixel(35),
    height: widthPixel(35),
  },
  title: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(24),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: heightPixel(6),
  },
  subtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: '#FFFFFFBF',
    textAlign: 'center',
  },
});

export default AuthHeader;
