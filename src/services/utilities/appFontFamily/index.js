// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
// import { appImages } from "../appAssets";
// import { Asset } from "expo-asset";
// import FlashMessage from "react-native-flash-message";
// import { LogBox } from "react-native";
// import { router } from "expo-router";

// const FontUpToDate = createContext();

// const FontProvider = ({ children }) => {
//   LogBox.ignoreAllLogs();
//   SplashScreen.preventAutoHideAsync();
//   // const [imagesLoaded, setImagesLoaded] = useState(false);

//   const [fontsLoaded] = useFonts({
//     appRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
//     appBlack: require("../../../assets/fonts/Poppins-Black.ttf"),
//     appBlackItalic: require("../../../assets/fonts/Poppins-BlackItalic.ttf"),
//     appBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
//     appBoldItalic: require("../../../assets/fonts/Poppins-BoldItalic.ttf"),
//     appExtraBold: require("../../../assets/fonts/Poppins-ExtraBold.ttf"),
//     appExtraBoldItalic: require("../../../assets/fonts/Poppins-ExtraBoldItalic.ttf"),
//     appItalic: require("../../../assets/fonts/Poppins-Italic.ttf"),
//     appLightItalic: require("../../../assets/fonts/Poppins-LightItalic.ttf"),
//     appExtraLightItalic: require("../../../assets/fonts/Poppins-ExtraLightItalic.ttf"),
//     appLight: require("../../../assets/fonts/Poppins-Light.ttf"),
//     appExtraLight: require("../../../assets/fonts/Poppins-ExtraLight.ttf"),
//     appMedium: require("../../../assets/fonts/Poppins-Medium.ttf"),
//     appMediumItalic: require("../../../assets/fonts/Poppins-MediumItalic.ttf"),
//     appSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
//     appSemiBoldItalic: require("../../../assets/fonts/Poppins-SemiBoldItalic.ttf"),
//   });

//   useEffect(() => {
//     if (fontsLoaded) {
//       SplashScreen.hideAsync();
//       router.replace("/onBoarding");
//       // router.replace("/AppFlow/invitedRoleUser/");
//       // router.replace("/AuthFlow/mapForLocation/");
//       // router.navigate("/AppFlow/(barberDrawer)/(barberTabs)/");
//       // router.navigate("/AppFlow/(userDrawer)/(userTabs)/");
//       // router.navigate("/AppFlow/(ownerDrawer)/(ownerTabs)/");
//     }
//   }, [fontsLoaded]);

//   return (
//     <FontUpToDate.Provider value={{ fontsLoaded }}>
//       {fontsLoaded ? children : null}
//       <FlashMessage position="top" />
//     </FontUpToDate.Provider>
//   );
// };

// const useLoadedFont = () => useContext(FontUpToDate);

// export { FontProvider, useLoadedFont };
