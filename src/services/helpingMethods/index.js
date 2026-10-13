// import { Linking, Alert, Platform } from "react-native";
// import { FlashAlert } from "../../components/flashMessage";
// import * as ImagePicker from "expo-image-picker";
// import * as Device from "expo-device";
// import * as Application from "expo-application";
// import * as Notifications from "expo-notifications";
// import Constants from "expo-constants";
// import { store } from "@/store/store";
// import {
//   deviceIdAndFCMToken,
//   setDeviceId,
// } from "@/store/reducers/userDataSlice";

// export const pickImageFromLibrary = async (
//   allowsMultipleSelection = true,
//   allowsEditing = false,
//   mediaTypes = ImagePicker.MediaTypeOptions.All,
//   aspect = [4, 3],
//   quality = 1
// ) => {
//   try {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       FlashAlert(
//         "E",
//         "Permission",
//         "Sorry, we need camera roll permissions to make this work!"
//       );
//       return null;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: mediaTypes,
//       allowsEditing: allowsEditing,
//       aspect: aspect,
//       quality: quality,
//       allowsMultipleSelection: allowsMultipleSelection,
//     });

//     if (result.canceled) {
//       return null;
//     }
//     console.log("results", result);
//     const images = result?.assets?.map((image) => image.uri);
//     console.log("results", images);
//     return images;
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// export const fromatDOB = (date) => {
//   const cleaned = date?.replace(/\D/g, "");
//   let formattedDate = cleaned?.slice(0, 2);

//   if (cleaned?.length > 2) {
//     formattedDate += "-" + cleaned.slice(2, 4);
//   }

//   if (cleaned?.length > 4) {
//     formattedDate += "-" + cleaned.slice(4, 8);
//   }

//   return formattedDate;
// };

// export function formatTime(time) {
//   let formattedTime = time?.replace(/[^0-9]/g, "");
//   if (formattedTime?.length > 2) {
//     formattedTime =
//       formattedTime?.slice(0, 2) + ":" + formattedTime?.slice(2, 4);
//   }
//   return formattedTime;
// }

// export function formatDate(date) {
//   let formattedDate = date?.replace(/[^0-9]/g, "");

//   if (formattedDate?.length > 2 && formattedDate?.length <= 4) {
//     formattedDate = formattedDate.slice(0, 2) + "/" + formattedDate.slice(2);
//   } else if (formattedDate?.length > 4) {
//     formattedDate =
//       formattedDate.slice(0, 2) +
//       "/" +
//       formattedDate.slice(2, 4) +
//       "/" +
//       formattedDate.slice(4, 8);
//   }

//   return formattedDate;
// }

// export function convertTimeToISO(inputTime) {
//   const [inputHours, inputMinutes] = inputTime.split(":").map(Number);

//   const hours = inputHours % 24;
//   const daysToAdd = Math.floor(inputHours / 24);

//   const now = new Date();

//   now.setHours(hours);
//   now.setMinutes(inputMinutes);
//   now.setSeconds(0);

//   now.setDate(now.getDate() + daysToAdd);

//   return now.toISOString();
// }

// export const getCoordinates = async (latitude, longitude, type) => {
//   await fetch(
//     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${"AIzaSyAKxDFZP8N395fl0cp57W_w5HdCGXEDVss"}`,
//     {
//       method: "GET",
//     }
//   )
//     .then((response) => response.json())
//     .then((result) => {
//       const address = result?.results[0].formatted_address;
//       console.log("address", address);
//     })
//     .catch((error) => {
//       console.log("error is", error);
//     });
// };

// export const formattedDate = (createdAt) => {
//   const dateObject = new Date(createdAt);
//   const options = { day: "2-digit", month: "2-digit", year: "numeric" };
//   const formattedDateString = dateObject.toLocaleDateString("en-GB", options);
//   return formattedDateString.replace(/\//g, "-");
// };

// export const formattedTime = (dateTime) => {
//   const options = { hour12: true, hour: "2-digit", minute: "2-digit" };
//   const formatted = new Date(dateTime);
//   return formatted.toLocaleTimeString("en-US", options);
// };

// export const openGmail = (email) => {
//   const mailtoURL = `mailto:${email}`;
//   Linking.canOpenURL(mailtoURL)
//     .then((supported) => {
//       if (supported) {
//         Linking.openURL(mailtoURL);
//       } else {
//         Alert.alert("Error", "Unable to open Gmail.");
//       }
//     })
//     .catch((err) => console.error("Error opening Gmail:", err));
// };

// export const dialPhoneNumber = (phoneNumber) => {
//   const telURL = `tel:${phoneNumber}`;
//   Linking.canOpenURL(telURL)
//     .then((supported) => {
//       if (supported) {
//         Linking.openURL(telURL);
//       } else {
//         Alert.alert("Error", "Unable to open dialer.");
//       }
//     })
//     .catch((err) => console.error("Error opening dialer:", err));
// };

// export const openWebsite = (websiteURL) => {
//   Linking.canOpenURL(websiteURL)
//     .then((supported) => {
//       if (supported) {
//         Linking.openURL(websiteURL);
//       } else {
//         Alert.alert("Error", "Unable to open browser.");
//       }
//     })
//     .catch((err) => console.error("Error opening website:", err));
// };

// export const getDeviceId = async () => {
//   try {
//     const deviceId = await Application.applicationId;
//     console.log("Device ID:", deviceId);

//     if (deviceId) {
//       store.dispatch(setDeviceId(deviceId)); // Dispatch the device ID to Redux
//       return deviceId;
//     } else {
//       console.error("Device ID could not be fetched");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching device ID:", error);
//     return null;
//   }
// };

// // Request notification permissions

// export const registerForPushNotificationsAsync = async () => {
//   console.log("Starting push notification setup...");

//   // Ensure the device is physical
//   if (!Device.isDevice) {
//     console.log("Push notifications are not supported on an emulator.");
//     return;
//   }

//   try {
//     let finalStatus = "undetermined";

//     if (Platform.OS === "android") {
//       // Check if the app is running on Android 13+ (API level 33+)
//       if (Device.osVersion && parseInt(Device.osVersion.split(".")[0]) >= 13) {
//         const { status } = await Notifications.getPermissionsAsync();
//         console.log("Existing notification permission status:", status);
//         if (status !== "granted") {
//           const { status: newStatus } =
//             await Notifications.requestPermissionsAsync();
//           finalStatus = newStatus;
//           console.log("Requested notification permission status:", finalStatus);
//         } else {
//           finalStatus = status;
//         }
//       } else {
//         console.log(
//           "Android version is below 13. No explicit POST_NOTIFICATIONS permission required."
//         );
//         // FlashAlert("E",
//         //   "Android version is below 13. No explicit POST_NOTIFICATIONS permission required."
//         // );
//         finalStatus = "granted";
//       }
//     } else {
//       // Handle iOS permissions
//       const { status: existingStatus } =
//         await Notifications.getPermissionsAsync();
//       console.log("Existing notification permission status:", existingStatus);

//       if (existingStatus !== "granted") {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//         console.log("Requested notification permission status:", finalStatus);
//       } else {
//         finalStatus = existingStatus;
//       }
//     }

//     if (finalStatus !== "granted") {
//       Alert.alert(
//         "Permission Required",
//         "Push notifications require permission to keep you updated.",
//         [
//           {
//             text: "Cancel",
//             style: "cancel",
//           },
//           {
//             text: "OK",
//             onPress: () => {
//               console.log("OK Pressed");
//               Linking.openSettings(); // ✅ Opens the app's notification settings
//             },
//           },
//         ]
//       );
//       return;
//     }
//     // if (Platform.OS === "android") {
//     //     const token = (await Notifications.getExpoPushTokenAsync()).data;
//     //     await AsyncStorage.setItem("deviceToken", token);
//     //     console.log("Push Token saved to AsyncStorage.", token);
//     // } else {
//     const { data } = await Notifications.getExpoPushTokenAsync({
//       projectId: Constants.expoConfig?.extra?.eas?.projectId,
//     });

//     if (data) {
//       console.log("Push Token retrieved:", data);
//       store.dispatch(deviceIdAndFCMToken(data));
//       console.log("Push Token saved to AsyncStorage.");
//     } else {
//       console.error("Failed to retrieve push token.");
//       store.dispatch(
//         deviceIdAndFCMToken("ExponentPushToken[fU04jdAClXMmeUhSt1JbIz]")
//       );
//     }
//     // }
//   } catch (error) {
//     console.error("Error during push notification setup:", error);
//   }
// };
