import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AppColors } from '@/constants/AppColors';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { hp, wp } from '../../services/utilities/appFontSizes';

const StepIndicator = ({ currentStep = 1, totalSteps = 3 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <View key={stepNum} style={styles.stepWrapper}>
            <View
              style={[
                styles.circle,
                isCompleted && styles.circleCompleted,
                isActive && styles.circleActive,
                !isCompleted && !isActive && styles.circleInactive,
              ]}
            >
              {isCompleted ? (
                <Image
                  source={require('../../../assets/icons/white_tick.png')}
                  style={{ width: widthPixel(20), height: widthPixel(20), tintColor: '#16A34A' }}
                  resizeMode="contain"
                />
              ) : (
                <Text
                  style={[
                    styles.stepText,
                    (isActive || isCompleted) ? styles.stepTextActive : styles.stepTextInactive,
                  ]}
                >
                  {stepNum}
                </Text>
              )}
            </View>
            {index < totalSteps - 1 && (
              <View style={[styles.connector, stepNum < currentStep && styles.connectorCompleted]} />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: heightPixel(24),
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCompleted: {
    backgroundColor: '#DCFCE7',
    borderWidth: widthPixel(2),
    borderColor: '#16A34A',
  },
  circleActive: {
    backgroundColor: '#16A34A',
  },
  circleInactive: {
    backgroundColor: 'transparent',
    borderWidth: widthPixel(2),
    borderColor: '#E5E7EB',
  },
  stepText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
  },
  stepTextActive: {
    color: '#FFFFFF',
  },
  stepTextInactive: {
    color: '#9CA3AF',
  },
  connector: {
    width: widthPixel(40),
    height: hp(0.3),
    backgroundColor: '#E5E7EB',
    marginHorizontal: widthPixel(10),
    borderRadius: widthPixel(2),
  },
  connectorCompleted: {
    backgroundColor: '#16A34A',
  },
});

export default StepIndicator;
