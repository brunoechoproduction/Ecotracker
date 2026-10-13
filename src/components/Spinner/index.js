import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  Plane,
  Bounce,
  Wave,
  Fold,
  Swing,
  Chase,
  Flow,
  Circle,
  Grid,
  CircleFade,
  Pulse,
  Wander,
} from "react-native-animated-spinkit";
import { wp } from "../../services/utilities/appFontSizes/index";
const Spinner = ({ color = "#FF979A", style, size = wp(10) }) => {
  return (
    <View style={[styles.container, style]}>
      <Flow color={color} size={size} animating={true} />
    </View>
  );
};

export default Spinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
