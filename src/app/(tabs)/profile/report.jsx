import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import ParentWrapper from '@/components/ParentWrapper';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { FontFamily } from '@/constants/Fonts';
import { appIcons } from '@/services/utilities/appAssets';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { LinearGradient } from 'expo-linear-gradient';
import { userService } from '@/services/api/userService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StatCard = ({ icon, value, label, subLabel, iconColor = '#16A34A' }) => (
  <View style={styles.gridStatCard}>
    <View style={[styles.statIconCircle, {}]}>
      <Image source={icon} style={styles.smallStatIcon} resizeMode="contain" />
    </View>
    <Text style={styles.gridStatValue}>{value}</Text>
    <Text style={[styles.gridStatLabel, { color: iconColor }]}>{label}</Text>
    <Text style={styles.gridStatSub}>{subLabel}</Text>
  </View>
);

const CategoryRow = ({ icon, label, impact, percentage, color }) => (
  <View style={styles.categoryRow}>
    <View style={styles.categoryTop}>
      <View style={styles.categoryLeft}>
        <Image source={icon} style={styles.categoryIcon} tintColor={color} />
        <Text style={styles.categoryLabel}>{label}</Text>
      </View>
      <Text style={[styles.categoryImpact, { color }]}>{impact}</Text>
    </View>
    <View style={styles.categoryBarBg}>
      <LinearGradient
        colors={['#16A34A', '#22C55E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.categoryBarFill, { width: `${percentage}%` }]}
      />
    </View>
    <Text style={styles.categoryPercentage}>{percentage}% of total impact</Text>
  </View>
);

export default function EcoImpactReportScreen() {
  const [period, setPeriod] = useState('Week');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await userService.getImpactReport();
      if (response.success) {
        setReportData(response.data);
      } else {
        Alert.alert('Error', response.message || 'Failed to load report');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch impact report');
    } finally {
      setLoading(false);
    }
  };

  const currentData = reportData ? reportData[period.toLowerCase()] : null;

  return (
    <ParentWrapper disableTopPadding={true}>
      <ProfileHeader
        title="Report"
        showBackButton={false}
        gradientColors={['#16A34A', '#14532D']}
      >
        <View style={styles.headerBannerBox}>
          <View style={styles.headerIconWrapper}>
            <Image source={appIcons.leaf} style={styles.headerBannerIcon} tintColor="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.headerBannerTitle}>Eco Impact Report</Text>
            <Text style={styles.headerBannerSubtitle}>Your personal sustainability summary</Text>
          </View>
        </View>
      </ProfileHeader>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#16A34A" />
        </View>
      ) : !reportData ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: FontFamily.InterRegular, color: '#6B7280' }}>Failed to load report data</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Segmented Control */}
          <View style={styles.segmentedContainer}>
            {['This Week', 'This Month', 'This Year'].map((p) => {
              const label = p.split(' ')[1];
              const isActive = period === label;
              return (
                <TouchableOpacity
                  key={p}
                  style={[styles.segmentBtn, isActive && styles.activeSegment]}
                  onPress={() => setPeriod(label)}
                >
                  <Text style={[styles.segmentText, isActive && styles.activeSegmentText]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Primary CO2 Card */}
          <LinearGradient
            colors={['#16A34A', '#14532D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainImpactCard}
          >
            <Text style={styles.mainImpactLabel}>Total CO₂ Saved</Text>
            <View style={styles.mainImpactValueRow}>
              <Text style={styles.mainImpactValue}>{currentData.totalCO2Saved.value}</Text>
              <Text style={styles.mainImpactUnit}>{currentData.totalCO2Saved.unit} CO₂</Text>
            </View>
            <View style={styles.mainImpactFooter}>
              <View style={styles.trendBadge}>
                <Image source={appIcons.trend} style={styles.trendIcon} />
                <Text style={styles.trendText}>
                  {currentData.totalCO2Saved.percentChangeVsPrevious > 0 ? '+' : ''}
                  {currentData.totalCO2Saved.percentChangeVsPrevious}% {currentData.totalCO2Saved.comparisonLabel}
                </Text>
              </View>
              <View style={styles.challengesBadge}>
                <Text style={styles.challengesText}>🌍 {currentData.totalCO2Saved.challengesDone} challenges done</Text>
              </View>
            </View>
          </LinearGradient>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={{ zIndex: 1 }}
          >




            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <StatCard
                icon={appIcons.tree}
                value={`${currentData.stats.treesEquivalent.value} trees`}
                label="Trees Equivalent"
                subLabel={currentData.stats.treesEquivalent.subtitle}

              />
              <StatCard
                icon={appIcons.water}
                value={`${currentData.stats.waterSaved.value}${currentData.stats.waterSaved.unit || 'L'}`}
                label="Water Saved"
                subLabel={currentData.stats.waterSaved.subtitle}

              />
              <StatCard
                icon={appIcons.earth}
                value={`${currentData.stats.footprintReduction.value}${currentData.stats.footprintReduction.unit || '%'}`}
                label="Footprint Reduction"
                subLabel={currentData.stats.footprintReduction.subtitle}

              />
              <StatCard
                icon={appIcons.thunder64}
                value={`${currentData.stats.energySaved.value} ${currentData.stats.energySaved.unit || 'kWh'}`}
                label="Energy Saved"
                subLabel={currentData.stats.energySaved.subtitle}

              />
            </View>

            {/* Daily Chart */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Daily CO₂ Savings</Text>
                <Text style={styles.chartUnit}>kg CO₂</Text>
              </View>
              <View style={styles.barChartContainer}>
                {currentData.dailyCO2Chart.map((item, i) => {
                  const maxVal = Math.max(...currentData.dailyCO2Chart.map(d => d.value), 1);
                  const heightPercent = (item.value / maxVal) * 100;
                  return (
                    <View key={i} style={styles.barWrapper}>
                      <LinearGradient
                        colors={['#22C55E', '#16A34A']}
                        style={[styles.bar, { height: `${Math.max(heightPercent, 2)}%` }]}
                      />
                      <Text style={styles.barDay}>{item.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Impact by Category */}
            <View style={styles.categoriesCard}>
              <Text style={styles.chartTitle}>Impact by Category</Text>
              {currentData.impactByCategory.map((cat, i) => {
                let icon, color;
                switch (cat.key) {
                  case 'transport': icon = appIcons.bicycle; color = "#16A34A"; break;
                  case 'food': icon = appIcons.salad; color = "#15803D"; break;
                  case 'energy': icon = appIcons.thunder64; color = "#F59E0B"; break;
                  case 'waste': icon = appIcons.recycle; color = "#10B981"; break;
                  default: icon = appIcons.leaf; color = "#16A34A"; break;
                }
                return (
                  <CategoryRow
                    key={i}
                    icon={icon}
                    label={cat.label}
                    impact={`${cat.valueKg} kg`}
                    percentage={cat.percent}
                    color={color}
                  />
                );
              })}
            </View>

            {/* EcoScore Progress */}
            <View style={styles.progressCard}>
              <Text style={styles.chartTitle}>EcoScore Progress</Text>
              <View style={styles.progressTop}>
                <Text style={styles.progressSubLabel}>Current Score</Text>
                <Text style={styles.progressValue}>{reportData.ecoScore.current}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={['#16A34A', '#22C55E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: `${Math.min((reportData.ecoScore.current / reportData.ecoScore.goal) * 100, 100)}%` }]}
                />
              </View>
              <View style={styles.progressFooter}>
                <Text style={styles.progressTarget}>0</Text>
                <Text style={styles.progressTarget}>Goal: {reportData.ecoScore.goal}</Text>
              </View>
              <View style={styles.rankInfoBox}>
                <Text style={styles.rankInfoText}>
                  🏅 You're ranked <Text style={styles.boldText}>#{reportData.ecoScore.globalRank}</Text> globally — <Text style={styles.boldText}>{reportData.ecoScore.percentileLabel}</Text>
                </Text>
              </View>
            </View>

            {/* Eco Tip */}
            <LinearGradient
              colors={['#ECFDF5', '#D1FAE5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tipBox}
            >
              <View style={styles.tipHeader}>
                <Image source={appIcons.leaf} style={styles.tipIcon} tintColor="#15803D" />
                <Text style={styles.tipTitle}>Eco Tip of the Report</Text>
              </View>
              <Text style={styles.tipText}>
                {currentData.ecoTip}
              </Text>
            </LinearGradient>

            <View style={{ height: heightPixel(40) }} />
          </ScrollView>
        </View>
      )}
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: heightPixel(20),
    backgroundColor: '#F9FAFB',
  },
  headerBannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: heightPixel(16),
    gap: widthPixel(14),
    marginBottom: heightPixel(16)
  },
  headerIconWrapper: {
    width: widthPixel(48),
    height: widthPixel(48),
    borderRadius: widthPixel(12),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBannerIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
  },
  headerBannerTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(20),
    color: '#FFFFFF',
  },
  headerBannerSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: heightPixel(2),
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: widthPixel(20),
    marginTop: -heightPixel(15),
    padding: widthPixel(6),
    borderRadius: widthPixel(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 10,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: heightPixel(11),
    alignItems: 'center',
    borderRadius: widthPixel(10),
  },
  activeSegment: {
    backgroundColor: '#16A34A',
  },
  segmentText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#6B7280',
  },
  activeSegmentText: {
    color: '#FFFFFF',
  },
  mainImpactCard: {
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(24),
    borderRadius: widthPixel(24),
    padding: widthPixel(24),
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  mainImpactLabel: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: 'rgba(255, 255, 255, 0.7)',
  },
  mainImpactValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',

    gap: widthPixel(8),
  },
  mainImpactValue: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(40),
    color: '#FFFFFF',

  },
  mainImpactUnit: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(16),
    color: '#FFFFFFB2',
    marginBottom: heightPixel(12),
    lineHeight: 24

  },
  mainImpactFooter: {
    flexDirection: 'row',
    marginTop: heightPixel(8),
    gap: widthPixel(12),
  },
  trendBadge: {
    backgroundColor: '#FFFFFF33',
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(8),
    borderRadius: widthPixel(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(4),
  },
  trendIcon: {
    width: widthPixel(12),
    height: widthPixel(12),
    resizeMode: "contain",
  },
  trendText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#FFFFFF',
  },
  challengesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.9,
    paddingVertical: heightPixel(8),
  },
  challengesText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#FFFFFF99',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(24),
    justifyContent: 'space-between',
  },
  gridStatCard: {
    width: (SCREEN_WIDTH - widthPixel(56)) / 2,
    backgroundColor: '#FFFFFF',
    marginBottom: heightPixel(16),
    borderRadius: widthPixel(24),
    padding: widthPixel(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  statIconCircle: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPixel(10),
  },
  smallStatIcon: {
    width: widthPixel(22),
    height: widthPixel(22),
  },
  gridStatValue: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(18),
    color: '#111827',
  },
  gridStatLabel: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(11),
    marginTop: heightPixel(4),
  },
  gridStatSub: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(10),
    color: '#9CA3AF',
    marginTop: heightPixel(4),
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(16),
    borderRadius: widthPixel(24),
    padding: widthPixel(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPixel(30),
  },
  chartTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
    color: '#111827',
  },
  chartUnit: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: heightPixel(140),
    paddingBottom: heightPixel(20),
  },
  barWrapper: {
    alignItems: 'center',
    width: widthPixel(36),
  },
  bar: {
    width: widthPixel(32),
    backgroundColor: '#22C55E',
    borderRadius: widthPixel(8),
  },
  barDay: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(10),
    color: '#9CA3AF',
    marginTop: heightPixel(12),
  },
  categoriesCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(24),
    borderRadius: widthPixel(24),
    padding: widthPixel(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  categoryRow: {
    marginTop: heightPixel(24),
  },
  categoryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(12),
  },
  categoryIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
  },
  categoryLabel: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(13),
    color: '#374151',
  },
  categoryImpact: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
  },
  categoryBarBg: {
    height: heightPixel(8),
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginTop: heightPixel(14),
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryPercentage: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    marginTop: heightPixel(8),
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(24),
    borderRadius: widthPixel(24),
    padding: widthPixel(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: heightPixel(20),
  },
  progressSubLabel: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: '#6B7280',
  },
  progressValue: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(20),
    color: '#16A34A',
  },
  progressBarBg: {
    height: heightPixel(12),
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    marginTop: heightPixel(14),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 6,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: heightPixel(10),
  },
  progressTarget: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(10),
    color: '#9CA3AF',
  },
  rankInfoBox: {
    backgroundColor: '#F0FDF4',
    padding: widthPixel(14),
    borderRadius: widthPixel(16),
    marginTop: heightPixel(24),
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  rankInfoText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#15803D',
    textAlign: 'left',
  },
  boldText: {
    fontFamily: FontFamily.InterBold,
  },
  tipBox: {
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(24),
    padding: widthPixel(24),
    borderRadius: widthPixel(24),
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(10),
    marginBottom: heightPixel(12),
  },
  tipIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
  },
  tipTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#065F46',
  },
  tipText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#047857',
    lineHeight: fontPixel(22),
  },
});
