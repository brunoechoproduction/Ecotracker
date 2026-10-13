import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, hp, widthPixel, wp } from '@/services/utilities/appFontSizes';
import Spinner from '@/components/Spinner';

/**
 * CButton — Global button component for EcoTrackr
 *
 * Props:
 *  - title: string
 *  - onPress: function
 *  - disabled: boolean
 *  - loading: boolean
 *  - icon: ImageSource (optional)
 *  - iconStyle: ImageStyle (optional)
 *  - iconTintColor: string (optional)
 *  - variant: 'primary' | 'outline' | 'ghost'  (default: 'primary')
 *  - style: ViewStyle (outer wrapper override)
 *  - containerStyle: ViewStyle (inner touchable override)
 *  - textStyle: TextStyle
 *  - absolutePosition: boolean (pins to bottom of screen)
 */
const CButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  iconStyle,
  iconTintColor,
  variant = 'primary',
  style,
  containerStyle,
  textStyle,
  absolutePosition = false,
  colors: customColors,
}) => {
  const { colors } = useAppTheme();

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const gradientColors = customColors || (disabled ? ['#9CA3AF', '#9CA3AF'] : ['#16A34A', '#15803D']);

  const renderContent = () => {
    if (loading) {
      return (
        <Spinner
          color={isOutline || isGhost ? colors.primary : '#fff'}
          size={wp(10)}
          style={{ flex: 0 }}
        />
      );
    }

    const label = (
      <Text
        style={[
          styles.label,
          isOutline && { color: colors.primary },
          isGhost && { color: colors.primary },
          textStyle,
        ]}
      >
        {title}
      </Text>
    );

    if (icon) {
      return (
        <View style={styles.contentContainer}>
          <Image 
            source={icon} 
            style={[styles.icon, iconStyle]} 
            tintColor={iconTintColor || (isOutline || isGhost ? colors.primary : '#fff')} 
          />
          {label}
        </View>
      );
    }

    return label;
  };

  return (
    <View style={[styles.wrapper, absolutePosition && styles.absolute, style]}>
      {isPrimary ? (
        <TouchableOpacity
          activeOpacity={0.78}
          disabled={disabled || loading}
          onPress={onPress}
          style={[
            styles.container,
            {
              shadowColor: '#16A34A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 20,
              elevation: 8,
              backgroundColor: 'transparent',
            },
            containerStyle,
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {renderContent()}
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.78}
          disabled={disabled || loading}
          onPress={onPress}
          style={[
            styles.container,
            isOutline && {
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderColor: disabled ? '#9CA3AF' : colors.primary,
              shadowOpacity: 0,
              elevation: 0,
            },
            isGhost && { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
            containerStyle,
          ]}
        >
          {renderContent()}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(4),
  },
  absolute: {
    position: 'absolute',
    bottom: hp(5),
    left: 0,
    right: 0,
  },
  container: {
    width: '100%',
    height: heightPixel(56),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: widthPixel(16),
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: widthPixel(16),
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: widthPixel(18),
    height: widthPixel(18),
    marginRight: widthPixel(8),
  },
  label: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(16),
    color: '#FFFFFF',
    lineHeight: 24,
  },
});

export default CButton;
