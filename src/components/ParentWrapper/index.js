import { heightPixel, isTablet } from "@/services/utilities/appFontSizes";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/context/ThemeContext";
import { useSegments } from "expo-router";

const ParentWrapper = ({
  children,
  style,
  disableTopPadding = false,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const segments = useSegments();

  const isInTabs = segments && segments[0] === '(tabs)';

  return (
    <View
      style={[
        styles.mainView,
        {
          backgroundColor: colors.background,
          paddingTop: disableTopPadding ? 0 : insets.top,
          paddingBottom: isInTabs ? 0 : insets.bottom + 5,
        },
        style,
      ]}
    >
      <View style={[styles.contentContainer, isTablet && styles.tabletContent]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
  },
  tabletContent: {
    maxWidth: 550,
    alignSelf: "center",
  },
});

export default ParentWrapper;
