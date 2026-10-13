import { memo } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native";
import { FontFamily } from "../../constants/Fonts";
import { appImages } from "../../services/utilities/appAssets/index";
import { fontPixel, hp, wp } from "../../services/utilities/appFontSizes";

const MainHeader = (props) => {
  const {
    title = "",
    backPress,
    drawer = false,
    containerStyle,
    backPressStyle,
  } = props;
  return (
    <SafeAreaView
      style={[
        styles.header,
        containerStyle,
        {
          justifyContent: backPress ? "space-between" : "center",
          paddingHorizontal: hp(3.5),
        },
      ]}
    >
      {backPress ? (
        <Pressable onPress={backPress}>
          <Image
            style={[
              { height: wp(6), width: wp(6), marginBottom: wp(0.8) },
              backPressStyle,
            ]}
            source={drawer ? appImages.drawer : appImages.backArrow}
          />
        </Pressable>
      ) : (
        <Text
          style={{
            color: "#232323",
            fontFamily: FontFamily.BalooRegular,
            fontSize: fontPixel(24),
          }}
        >
          {" "}
        </Text>
      )}
        <Text
          style={{
            color: "#232323",
            fontFamily: FontFamily.InterRegular,
            fontSize: fontPixel(24),
          }}
        >
          {title}
        </Text>
      {backPress && (
        <Text
          style={{
            color: "#232323",
            fontFamily: FontFamily.InterBold,
            fontSize: fontPixel(16.6),
          }}
        >
          {"     "}
        </Text>
      )}
      {/* {image && (
        <Text
          style={{
            color: "#232323",
            fontFamily: "Nunito-Bold",
            fontSize: fontPixel(16.6),
          }}
        >
          {"               "}
        </Text>
      )}
      {bell && (
        <View style={styles.bell}>
          <Pressable
            onPress={() => {
              // router.back();
            }}
            style={{}}
          >
            <Image
              style={styles.chevron}
              source={require("../../assets/images/partial-react-logo.png")}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              // router.back();
            }}
            style={{}}
          >
            <Image
              style={styles.chevron}
              source={require("../../assets/images/splashIcon.png")}
            />
          </Pressable>
        </View>
      )} */}
    </SafeAreaView>
  );
};

export default memo(MainHeader);

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFD539",
    height: hp(15),
    paddingTop: StatusBar.currentHeight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: wp(0.5),
    borderBottomLeftRadius: wp(12),
    borderBottomRightRadius: wp(12),
    paddingHorizontal: hp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10, // for Android
  },
  image: {
    height: wp(80),
    width: wp(80),
  },
  chevron: {
    height: wp(6),
    width: wp(6),
    marginTop: wp(5),
    tintColor: "#FFFFFF",
    marginRight: wp(3.5),
  },
  bell: {
    flexDirection: "row",
    alignItems: "center",
  },
});
