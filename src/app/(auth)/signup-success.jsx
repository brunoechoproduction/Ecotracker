import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import CButton from '@/components/CButton';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, hp, widthPixel, wp } from '@/services/utilities/appFontSizes';
import { showMessage } from 'react-native-flash-message';

const RewardItem = ({ emoji, title, subtitle, showDivider, colors }) => (
  <>
    <View style={rewardStyles.row}>
      <Text style={rewardStyles.emoji}>{emoji}</Text>
      <View style={rewardStyles.textCol}>
        <Text style={[rewardStyles.title, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[rewardStyles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
    </View>
    {showDivider && <View style={[rewardStyles.divider, { backgroundColor: colors.divider }]} />}
  </>
);

const rewardStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: widthPixel(12), paddingVertical: heightPixel(16) },
  emoji: { fontSize: fontPixel(24) },
  textCol: { flex: 1 },
  title: { fontFamily: FontFamily.InterBold, fontSize: fontPixel(14),color:"#111827" },
  subtitle: { fontFamily: FontFamily.InterRegular, fontSize: fontPixel(12), marginTop: heightPixel(2) ,color:"#9CA3AF"},
  divider: { height: 1, opacity: 0.5 },
});

export default function SignupSuccessScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <ParentWrapper style={{ backgroundColor: colors.successBackground }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../../assets/icons/circle_green_tick.png')}
          style={styles.successIcon}
          resizeMode="contain"
        />

        <Text style={[styles.heading, { color: colors.textPrimary }]}>Welcome to EcoTrackr! 🌱</Text>
        <Text style={[styles.subheading, { color: "#6B7280" }]}>
          Your account has been created. Start your eco journey and make a difference!
        </Text>

        <View style={[styles.card, { backgroundColor: colors.background,width:wp(90) }]}>
          <RewardItem emoji="🥇" title="100 Bonus XP" subtitle="Welcome reward unlocked!" showDivider colors={colors} />
          <RewardItem emoji="🔥" title="Streak Started" subtitle="Day 1 begins today" showDivider colors={colors} />
          <RewardItem emoji="🌿" title="Eco Score: 0" subtitle="Start completing challenges" showDivider={false} colors={colors} />
        </View>

        <View style={{ height: heightPixel(48) }} />
        <CButton  title="Start My Eco Journey 🚀" onPress={() => {
           router.replace('/(tabs)/')
            showMessage({ message: 'Logged in successfully!', type: 'success' });

          }} />
      </ScrollView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, alignItems: 'center', paddingBottom: heightPixel(48) },
  successIcon: {
    width: wp(40),
    height: wp(40),
    marginTop: hp(12),
  },
  heading: { fontFamily: FontFamily.InterExtraBold, fontSize: fontPixel(24), textAlign: 'center', marginTop: heightPixel(0), paddingHorizontal: widthPixel(20) },
  subheading: { fontFamily: FontFamily.InterRegular, fontSize: fontPixel(15), textAlign: 'center', lineHeight: 24, paddingHorizontal: widthPixel(40), marginTop: heightPixel(12) },
  card: {
    borderRadius: widthPixel(24), paddingHorizontal: widthPixel(20), paddingVertical: heightPixel(8),
    marginHorizontal: widthPixel(10), marginTop: heightPixel(32), width: widthPixel(335),
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05, shadowRadius: 20, elevation: 4,
  },
});
