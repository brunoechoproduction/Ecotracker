import { Dimensions, PixelRatio, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

const wp = (p) => width * (p / 100);
const hp = (p) => height * (p / 100);

const isTablet = width > 550;

const widthBaseScale = SCREEN_WIDTH / 430;
const heightBaseScale = SCREEN_HEIGHT / 932;

// On tablets, we want to scale less aggressively to prevent oversized UI
const scale = isTablet ? Math.min(widthBaseScale, heightBaseScale) * 0.8 : Math.min(widthBaseScale, heightBaseScale);

function normalize(size, based = "width") {
  const newSize =
    based === "height" ? size * heightBaseScale : size * widthBaseScale;
  
  // For tablets, we apply a dampening factor to height-based scaling
  const finalSize = isTablet && based === "height" ? newSize * 0.85 : newSize;
  
  return Math.round(PixelRatio.roundToNearestPixel(finalSize));
}

const widthPixel = (size) => {
  return normalize(size, "width");
};
const heightPixel = (size) => {
  return normalize(size, "height");
};

const responsiveFontSizeNew = (size) => {
  const newSize = size * scale;
  return newSize / PixelRatio.getFontScale();
};

const fontPixel = (size) => {
  // Use a slightly smaller font scale for tablets to maintain density
  const tabletScale = 0.85;
  return isTablet ? heightPixel(size * tabletScale) : heightPixel(size);
};

const heightOfStatusBar = StatusBar?.currentHeight;

export {
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  isTablet,
  wp,
  hp,
  widthPixel,
  heightPixel,
  fontPixel,
  responsiveFontSizeNew,
  heightOfStatusBar,
};
