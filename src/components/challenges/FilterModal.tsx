import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  Animated,
  ScrollView,
} from 'react-native';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel, hp } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';
import CButton from '@/components/CButton';

const CButtonAny = CButton as any;

interface FilterModalProps {
  isVisible: boolean;
  colors: any;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  selectedDifficulty: string | null;
  setSelectedDifficulty: (val: string | null) => void;
  selectedStatus: string | null;
  setSelectedStatus: (val: string | null) => void;
  selectedProofType: string | null;
  setSelectedProofType: (val: string | null) => void;
  selectedSortBy: string;
  setSelectedSortBy: (val: string) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = memo(({
  isVisible,
  colors,
  fadeAnim,
  slideAnim,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedStatus,
  setSelectedStatus,
  selectedProofType,
  setSelectedProofType,
  selectedSortBy,
  setSelectedSortBy,
  onApply,
  onReset,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <View style={styles.absoluteOverlay}>
      <Animated.View
        style={[
          styles.modalOverlay,
          { opacity: fadeAnim }
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.modalContent,
          {
            backgroundColor: colors.background,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.dragIndicatorContainer}>
          <View style={styles.dragIndicator} />
        </View>
        <View style={styles.modalHeader}>
          <View style={styles.modalTitleRow}>
            <Image source={appIcons.tunning} style={styles.modalTitleIcon} />
            <Text style={[styles.modalTitle, { color: "#111827" }]}>Filter Challenges</Text>
          </View>
          <View style={styles.modalHeaderActions}>
            <TouchableOpacity
              onPress={onReset}
              style={[styles.resetButton, { backgroundColor: '#FEF2F2', flexDirection: 'row', alignItems: 'center', gap: widthPixel(4) }]}
            >
              <Image source={appIcons.reset} style={{ width: widthPixel(14), height: widthPixel(14) }} tintColor={'#EF4444'} />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.crossButton, { backgroundColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', gap: widthPixel(4) }]} onPress={onClose}>
              <Image source={appIcons.modalCross} style={styles.closeIcon} tintColor={colors.textPlaceholder} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.filterGroupTitle}>DIFFICULTY</Text>
          <View style={styles.filterOptions}>
            {[
              { label: 'Easy', icon: '🌱' },
              { label: 'Medium', icon: '⚡' },
              { label: 'Hard', icon: '🔥' }
            ].map((diff) => {
              const isSelected = selectedDifficulty === diff.label;
              return (
                <TouchableOpacity
                  key={diff.label}
                  onPress={() => setSelectedDifficulty(isSelected ? null : diff.label)}
                  style={[styles.optionChip, { backgroundColor: isSelected ? colors.primary : "#F3F4F6" }]}
                >
                  <Text style={[styles.optionText, { color: isSelected ? '#FFFFFF' : "#6B7280" }]}>{diff.icon} {diff.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.filterGroupTitle}>STATUS</Text>
          <View style={styles.filterOptions}>
            {[
              { label: 'Available', icon: '✅' },
              { label: 'In Progress', icon: '🚀' },
              { label: 'Pending', icon: '⌛' },
              { label: 'Verified', icon: '✔️' }
            ].map((st) => {
              const isSelected = selectedStatus === st.label;
              return (
                <TouchableOpacity
                  key={st.label}
                  onPress={() => setSelectedStatus(isSelected ? null : st.label)}
                  style={[styles.optionChip, { backgroundColor: isSelected ? colors.primary : "#F3F4F6" }]}
                >
                  <Text style={[styles.optionText, { color: isSelected ? '#FFFFFF' : "#6B7280" }]}>{st.icon} {st.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.filterGroupTitle}>PROOF TYPE</Text>
          <View style={styles.filterOptions}>
            {[
              { label: 'Self-Check', icon: '✔️' },
              { label: 'Photo', icon: '📷' },
              { label: 'GPS', icon: '📍' }
            ].map((pt) => {
              const isSelected = selectedProofType === pt.label;
              return (
                <TouchableOpacity
                  key={pt.label}
                  onPress={() => setSelectedProofType(isSelected ? null : pt.label)}
                  style={[styles.optionChip, { backgroundColor: isSelected ? colors.primary : "#F3F4F6" }]}
                >
                  <Text style={[styles.optionText, { color: isSelected ? '#FFFFFF' : "#6B7280" }]}>{pt.icon} {pt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.filterGroupTitle}>SORT BY</Text>
          <View style={styles.sortContainer}>
            {[
              { label: 'Default',       imgSrc: appIcons.default },
              { label: 'Most Points',   imgSrc: appIcons.star },
              { label: 'Fewest Points', imgSrc: appIcons.pointsDown },
              { label: 'Most XP',       imgSrc: appIcons.purpleThunder },
              { label: 'Easiest First', imgSrc: appIcons.doubleLeaf },
              { label: 'Hardest First', imgSrc: appIcons.fire },
            ].map((sort) => {
              const isSelected = selectedSortBy === sort.label;
              return (
                <TouchableOpacity
                  key={sort.label}
                  onPress={() => setSelectedSortBy(sort.label)}
                  style={styles.sortItem}
                >
                  <View style={styles.sortItemLeft}>
                    <Image
                      source={sort.imgSrc}
                      style={styles.sortIcon}
                    />
                    <Text style={styles.sortText}>{sort.label}</Text>
                  </View>
                  {isSelected && <Image source={appIcons.greenTick} style={styles.checkIcon} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <CButtonAny
          title="Apply Filters"
          onPress={onApply}
          style={styles.applyButton}
        />
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  absoluteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dragIndicatorContainer: {
    alignItems: 'center',
    paddingBottom: heightPixel(12),
  },
  dragIndicator: {
    width: widthPixel(40),
    height: heightPixel(4),
    backgroundColor: '#E5E7EB',
    borderRadius: widthPixel(2),
  },
  modalContent: {
    borderTopLeftRadius: widthPixel(32),
    borderTopRightRadius: widthPixel(32),
    paddingTop: heightPixel(12),
    paddingHorizontal: widthPixel(24),
    paddingBottom: hp(4),
    height: '90%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: heightPixel(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(12),
  },
  modalTitleIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
  },
  modalTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(17)
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(10),
  },
  resetButton: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(8),
    borderRadius: widthPixel(10),
  },
  crossButton: {
    paddingHorizontal: widthPixel(6),
    paddingVertical: heightPixel(4),
    borderRadius: widthPixel(8),
  },
  resetText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#DC2626',
  },
  closeIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
  },
  modalScroll: {
    marginTop: heightPixel(24),
  },
  filterGroupTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: heightPixel(16),
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: widthPixel(12),
    marginBottom: heightPixel(32),
  },
  optionChip: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(10),
    borderRadius: widthPixel(22),
  },
  optionText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(13),
  },
  sortContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: widthPixel(20),
    padding: widthPixel(2),
    marginBottom: heightPixel(32),
    borderColor: "#E5E7EB",
    borderWidth: 0.8
  },
  sortItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: widthPixel(16),
    borderRadius: widthPixel(16),
    borderColor: "#F3F4F6",
    borderWidth: 1
  },
  sortItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(12),
  },
  sortIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
  },
  sortText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(14),
    color: '#111827',
  },
  checkIcon: {
    width: widthPixel(22),
    height: widthPixel(22),
  },
  applyButton: {
    marginTop: heightPixel(12),
  },
});
