import React, { useState, useRef } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Keyboard, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { showMessage } from 'react-native-flash-message';
import ParentWrapper from '@/components/ParentWrapper';
import ProfileHeader from '@/components/profile/ProfileHeader';
import InputField from '@/components/InputField';
import CButton from '@/components/CButton';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { appIcons, appImages } from '@/services/utilities/appAssets';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { useUpdateProfile } from '@/hooks/useAuth';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import PhoneInput from 'react-native-phone-number-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { userService } from '@/services/api/userService';
import { getUserLevelInfo } from '@/services/utilities/levels';
import * as Location from 'expo-location';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAP_API_KEY || '';

// Fetch place suggestions from Google Places Text Search API
async function fetchPlaceSuggestions(query) {
  if (!query || query.length < 4) return [];
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encoded}&key=AIzaSyBOq3EO_1wKdV4nnULrkPo6V-t-QkuT4P0&language=en`;
    const res = await fetch(url);
    const json = await res.json();
    console.log('PLACES API RESPONSE:', json);
    if (json.status === 'OK') return json.predictions;
    return [];
  } catch (error) {
    console.log('PLACES API ERROR:', error);
    return [];
  }
}
const editProfileSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name is too short')
    .required('Full name is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: Yup.string().nullable(),
  bio: Yup.string().max(150, 'Bio is too long').nullable(),
  location: Yup.string().nullable(),
  website: Yup.string().url('Invalid website URL').nullable(),
});

const SectionHeader = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const ReadOnlyStat = ({ icon, value, label }) => (
  <View style={styles.statCard}>
    <Image source={icon} style={styles.statIcon} resizeMode="contain" />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [profileImage, setProfileImage] = useState(null);
  const { user, updateUser } = useAuth();
  const { currentLevel } = getUserLevelInfo(user?.xp || 0);
  const phoneInput = useRef(null);
  // Google Places Autocomplete state
  const [locationQuery, setLocationQuery] = useState('');
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const getInitialValue = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object' && val !== null) {
      return val.address || val.description || '';
    }
    const str = String(val).trim();
    return str === 'null' ? '' : str;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const parsePhoneData = (rawPhone) => {
    if (rawPhone && typeof rawPhone === 'object') {
      return { 
        phoneStr: rawPhone.fullNumber || '', 
        countryCode: rawPhone.isoCode || 'US',
        localPhone: rawPhone.localNumber || ''
      };
    }

    let phoneStr = getInitialValue(rawPhone);
    let countryCode = 'US';
    
    if (phoneStr && /^[a-zA-Z]{2}\+/.test(phoneStr)) {
      countryCode = phoneStr.substring(0, 2).toUpperCase();
      phoneStr = phoneStr.substring(2);
    }
    return { phoneStr, countryCode, localPhone: '' };
  };

  const { phoneStr: initialPhone, countryCode: initialCountryCode, localPhone: initialLocalPhone } = parsePhoneData(user?.phone || user?.number);

  const { mutateAsync: updateProfile } = useUpdateProfile();

  const formik = useFormik({
    initialValues: {
      fullName: getInitialValue(user?.name),
      username: getInitialValue(user?.username),
      bio: getInitialValue(user?.about),
      email: getInitialValue(user?.email),
      phone: initialPhone,
      countryCode: initialCountryCode,
      localPhone: initialLocalPhone,
      location: getInitialValue(user?.location),
      website: getInitialValue(user?.website),
      latitude: user?.location?.coordinates?.[1] || null,
      longitude: user?.location?.coordinates?.[0] || null,
    },
    enableReinitialize: true,
    validationSchema: editProfileSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        let phoneObj = null;
        if (values.phone && phoneInput.current) {
          const dialCode = `+${phoneInput.current.getCallingCode()}`;
          // If the value is just the calling code, treat it as empty
          if (values.phone === dialCode) {
            phoneObj = null;
          } else if (!phoneInput.current.isValidNumber(values.phone)) {
            setFieldError('phone', 'Please enter a valid phone number');
            setSubmitting(false);
            return;
          } else {
            const isoCode = phoneInput.current.getCountryCode() || values.countryCode || 'US';
            const fullNumber = values.phone;
            const localNumber = values.localPhone || fullNumber.replace(dialCode, '');
            phoneObj = {
              isoCode,
              dialCode,
              localNumber,
              fullNumber
            };
          }
        }

        let uploadedImageUrl = null;
        if (profileImage) {
          try {
            uploadedImageUrl = await userService.uploadImage(profileImage);
          } catch (uploadError) {
            console.error('Image upload failed:', uploadError);
            showMessage({ message: 'Failed to upload profile image.', type: 'danger' });
            setSubmitting(false);
            return;
          }
        }

        let locationPayload = values.location;
        if (values.latitude !== null && values.longitude !== null) {
          locationPayload = {
            type: "Point",
            coordinates: [values.longitude, values.latitude],
            address: values.location
          };
        } else if (typeof user?.location === 'object' && user?.location?.coordinates) {
          locationPayload = {
            type: "Point",
            coordinates: user.location.coordinates,
            address: values.location
          };
        }

        const payload = {
          name: values.fullName,
          username: values.username,
          phone: phoneObj,
          about: values.bio,
          location: locationPayload,
          website: values.website,
          ...(uploadedImageUrl && { image: uploadedImageUrl }),
        };

        const response = await updateProfile(payload);
        if (response?.data?.user) {
          await updateUser(response.data.user);
        }
        showMessage({ message: 'Profile updated successfully!', type: 'success' });
        router.back();
      } catch (e) {
        const errorMessage = e?.response?.data?.message || 'Failed to update profile.';
        showMessage({ message: errorMessage, type: 'danger' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const inputColors = {
    inputBackground: colors.inputBackground,
    primary: colors.primary,
    darkGrey: colors.darkGrey,
    black: colors.black,
    text2: colors.text2,
  };

  const insets = useSafeAreaInsets();

  // Sync locationQuery with formik when user object loads
  React.useEffect(() => {
    setLocationQuery(getInitialValue(user?.location));
  }, [user?.location]);

  const handleLocationChange = (text) => {
    setLocationQuery(text);
    formik.setFieldValue('location', text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (text.length < 4) {
      setPlaceSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceTimer.current = setTimeout(async () => {
      const suggestions = await fetchPlaceSuggestions(text);
      setPlaceSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    }, 800);
  };

  const handleSelectPlace = (place) => {
    const desc = place.description || place.structured_formatting?.main_text || '';
    setLocationQuery(desc);
    formik.setFieldValue('location', desc);
    setPlaceSuggestions([]);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleGetCurrentLocation = async () => {
    try {
      setIsFetchingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showMessage({ message: 'Permission to access location was denied', type: 'danger' });
        setIsFetchingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (location && location.coords) {
        const { latitude, longitude } = location.coords;
        let reverseGeocoded = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverseGeocoded && reverseGeocoded.length > 0) {
          const place = reverseGeocoded[0];
          const addressParts = [];

          let streetAddress = '';
          if (place.streetNumber) streetAddress += place.streetNumber + ' ';
          if (place.street) streetAddress += place.street;
          streetAddress = streetAddress.trim();

          if (streetAddress) addressParts.push(streetAddress);

          // Avoid duplicating street info in name
          if (place.name && place.name !== place.street && place.name !== streetAddress) {
            addressParts.push(place.name);
          }
          if (place.city) addressParts.push(place.city);
          if (place.region) addressParts.push(place.region);
          if (place.country) addressParts.push(place.country);

          const fullAddress = addressParts.join(', ');
          setLocationQuery(fullAddress);
          formik.setFieldValue('location', fullAddress);
          formik.setFieldValue('latitude', latitude);
          formik.setFieldValue('longitude', longitude);
        }
      }
    } catch (error) {
      console.log('Error getting current location:', error);
      showMessage({ message: 'Could not fetch current location.', type: 'danger' });
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSave = () => {
    if (!formik.dirty && !profileImage) {
      showMessage({ message: 'No changes to save.', type: 'info' });
      router.back();
      return;
    }
    formik.handleSubmit();
  };

  return (
    <ParentWrapper disableTopPadding={true}>
      <ProfileHeader
        showBackButton={false}
        title="Edit Profile"
        gradientColors={['#16A34A', '#14532D']}
        rightElement={
          <TouchableOpacity onPress={handleSave} style={styles.saveHeaderBtn}>
            <Text style={styles.saveHeaderText}>Save</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image source={profileImage ? { uri: profileImage } : (user?.image && user.image !== 'null' ? { uri: user.image } : appImages.womenProfile)} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
              <Image source={appIcons.camera} style={styles.cameraIcon} tintColor="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
      </ProfileHeader>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formCard}>
          <SectionHeader title="BASIC INFO" />
          <InputField
            title="FULL NAME"
            colors={inputColors}
            placeholder="Full Name"
            leftIcon={appIcons.person}
            value={formik.values.fullName}
            onChangeText={formik.handleChange('fullName')}
            onBlur={formik.handleBlur('fullName')}
            errorText={formik.touched.fullName && formik.errors.fullName}
            changeMainContainer={styles.fieldMargin}
          />
          <InputField
            title="USERNAME"
            colors={inputColors}
            placeholder="Username"
            leftIcon={appIcons.at}
            value={formik.values.username}
            onChangeText={formik.handleChange('username')}
            onBlur={formik.handleBlur('username')}
            errorText={formik.touched.username && formik.errors.username}
            changeMainContainer={styles.fieldMargin}
            autoCapitalize="none"
          />
          <Text style={styles.inputLabel}>BIO</Text>
          <View style={[styles.bioContainer, formik.touched.bio && formik.errors.bio && { borderColor: '#DC2626' }]}>
            <Image source={appIcons.page} style={styles.bioIcon} tintColor="#11182780" />
            <TextInput
              style={styles.bioInput}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#11182780"
              multiline
              value={formik.values.bio}
              onChangeText={formik.handleChange('bio')}
              onBlur={formik.handleBlur('bio')}
              textAlignVertical="top"
            />
          </View>
          {formik.touched.bio && formik.errors.bio && (
            <Text style={styles.errorTextSmall}>{formik.errors.bio}</Text>
          )}
        </View>

        <View style={styles.formCard}>
          <SectionHeader title="CONTACT INFO" />
          <InputField
            title="EMAIL"
            colors={inputColors}
            placeholder="Email"
            leftIcon={appIcons.email}
            value={formik.values.email}
            onChangeText={(text) => formik.setFieldValue('email', text.trim().toLowerCase())}
            onBlur={formik.handleBlur('email')}
            errorText={formik.touched.email && formik.errors.email}
            changeMainContainer={styles.fieldMargin}
            keyboardType="email-address"
          />
          <Text style={styles.inputLabel}>PHONE NUMBER</Text>
          <View style={styles.phoneInputContainer}>
            <PhoneInput
              ref={phoneInput}
              defaultValue={formik.values.localPhone || formik.values.phone}
              defaultCode={formik.values.countryCode}
              layout="second"
              onChangeText={(text) => {
                formik.setFieldValue('localPhone', text);
              }}
              onChangeFormattedText={(text) => {
                formik.setFieldValue('phone', text);
              }}
              containerStyle={[styles.phoneInputBox, formik.touched.phone && formik.errors.phone && { borderColor: '#DC2626' }]}
              textContainerStyle={styles.phoneInputTextContainer}
              textInputStyle={styles.phoneInputText}
              codeTextStyle={styles.phoneInputCodeText}
              flagButtonStyle={styles.phoneInputFlagButton}
              countryPickerProps={{
                withFlag: true,
              }}
              textInputProps={{
                placeholderTextColor: '#11182780',
              }}
              placeholder="Phone Number"

            />
          </View>
          {formik.touched.phone && formik.errors.phone && (
            <Text style={styles.errorTextSmall}>{formik.errors.phone}</Text>
          )}
        </View>

        <View style={styles.formCard}>
          <SectionHeader title="LOCATION & LINKS" />
          {/* Google Places Autocomplete Location Field */}
          <Text style={styles.inputLabel}>LOCATION</Text>
          <View style={styles.locationWrapper}>
            <View
              style={[
                styles.locationInputBox,
                formik.touched.location && formik.errors.location && { borderColor: '#DC2626' },
              ]}
            >
              <TouchableOpacity onPress={handleGetCurrentLocation} disabled={isFetchingLocation}>
                {isFetchingLocation ? (
                  <ActivityIndicator size="small" color="#16A34A" style={styles.locationIcon} />
                ) : (
                  <Image source={appIcons.pinGrey} style={styles.locationIcon} />
                )}
              </TouchableOpacity>
              <TextInput
                style={styles.locationInput}
                placeholder="Search city or place..."
                placeholderTextColor="#11182780"
                value={locationQuery}
                onChangeText={handleLocationChange}
                onBlur={() => {
                  formik.handleBlur('location');
                  // Delay hide so tap on suggestion registers
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                onFocus={() => {
                  if (placeSuggestions.length > 0) setShowSuggestions(true);
                }}
                returnKeyType="search"
              />
              {locationQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setLocationQuery('');
                    formik.setFieldValue('location', '');
                    setPlaceSuggestions([]);
                    setShowSuggestions(false);
                  }}
                >
                  <Image source={appIcons.cross} style={styles.clearIcon} tintColor="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
            {formik.touched.location && formik.errors.location && (
              <Text style={styles.errorTextSmall}>{formik.errors.location}</Text>
            )}
            {/* Suggestions dropdown */}
            {showSuggestions && placeSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={placeSuggestions}
                  keyExtractor={(item) => item.place_id}
                  keyboardShouldPersistTaps="handled"
                  scrollEnabled={false}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={[
                        styles.suggestionItem,
                        index === placeSuggestions.length - 1 && { borderBottomWidth: 0 },
                      ]}
                      onPress={() => handleSelectPlace(item)}
                      activeOpacity={0.7}
                    >
                      <Image source={appIcons.pinGrey} style={styles.suggestionPin} />
                      <View style={styles.suggestionTexts}>
                        <Text style={styles.suggestionMain} numberOfLines={1}>
                          {item.structured_formatting?.main_text || item.description}
                        </Text>
                        <Text style={styles.suggestionSub} numberOfLines={1}>
                          {item.structured_formatting?.secondary_text || ''}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
          <InputField
            title="WEBSITE"
            colors={inputColors}
            placeholder="https://..."
            leftIcon={appIcons.page}
            value={formik.values.website}
            onChangeText={formik.handleChange('website')}
            onBlur={formik.handleBlur('website')}
            errorText={formik.touched.website && formik.errors.website}
            changeMainContainer={styles.fieldMargin}
          />
        </View>

        <LinearGradient
          colors={['#F0FDF4', '#DCFCE7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ecoStatsCard}
        >
          <Text style={[styles.sectionTitle, { color: '#16A34A' }]}>ECO STATS (READ ONLY)</Text>
          <View style={styles.statsRow}>
            <ReadOnlyStat icon={appIcons.leave} value={(user?.ecoScore ?? 0).toString()} label="EcoScore" />
            <ReadOnlyStat icon={appIcons.medal96} value={(currentLevel?.level ?? 1).toString()} label="Level" />
            <ReadOnlyStat icon={appIcons.fire96} value={`${user?.currentStreak ?? 0}d`} label="Streak" />
          </View>
        </LinearGradient>
        <View style={{ height: heightPixel(40) }} />
      </ScrollView>
      <CButton
        containerStyle={{ marginBottom: insets.bottom }}

        title="Save Changes ✓"
        onPress={handleSave}
        loading={formik.isSubmitting}
      />

    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: heightPixel(20),
    paddingHorizontal: widthPixel(16),
  },
  saveHeaderBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(8),
    borderRadius: widthPixel(12),
  },
  saveHeaderText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#FFFFFF',
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: heightPixel(18),
    marginBottom: heightPixel(8),
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: heightPixel(8),
  },
  avatar: {
    width: widthPixel(90),
    height: widthPixel(90),
    borderRadius: widthPixel(50),
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#16A34A',
    width: widthPixel(34),
    height: widthPixel(34),
    borderRadius: widthPixel(17),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cameraIcon: {
    width: widthPixel(16),
    height: widthPixel(16),
  },
  changePhotoText: {
    fontFamily: FontFamily.InterMedium,
    fontSize: fontPixel(13),
    color: '#FFFFFFCC',
    marginTop: heightPixel(4),
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(24),
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(16),
    marginTop: heightPixel(20),
    borderWidth: 1,
    borderColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    marginBottom: heightPixel(20),
    letterSpacing: 0.5,
  },
  inputLabel: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#6B7280',
    marginBottom: heightPixel(8),
  },
  fieldMargin: {
    marginBottom: heightPixel(16),
    marginHorizontal: 0,
    marginTop: 0,
  },
  // Location autocomplete styles
  locationWrapper: {
    marginBottom: heightPixel(16),
    zIndex: 999,
  },
  locationInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: widthPixel(16),
    paddingHorizontal: widthPixel(16),
    height: heightPixel(52),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locationIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
    marginRight: widthPixel(12),
  },
  locationInput: {
    flex: 1,
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    color: '#111827',
    padding: 0,
  },
  clearIcon: {
    width: widthPixel(16),
    height: widthPixel(16),
    marginLeft: widthPixel(8),
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: heightPixel(4),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: widthPixel(12),
  },
  suggestionPin: {
    width: widthPixel(16),
    height: widthPixel(16),
    opacity: 0.5,
  },
  suggestionTexts: {
    flex: 1,
  },
  suggestionMain: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(13),
    color: '#111827',
  },
  suggestionSub: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    marginTop: heightPixel(1),
  },
  bioContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: widthPixel(16),
    padding: widthPixel(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: heightPixel(100),
  },
  bioIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
    marginRight: widthPixel(12),
    marginTop: 2,
  },
  bioInput: {
    flex: 1,
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    color: '#111827',
    padding: 0,
  },
  errorTextSmall: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#DC2626',
    marginTop: heightPixel(4),
    marginLeft: widthPixel(4),
  },
  ecoStatsCard: {
    borderRadius: widthPixel(24),
    padding: widthPixel(20),
    marginBottom: heightPixel(24),
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: heightPixel(20)
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: widthPixel(8)
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingVertical: heightPixel(12),
    borderRadius: widthPixel(16),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statIcon: {
    width: widthPixel(25),
    height: widthPixel(25),
    marginBottom: heightPixel(2),
  },
  statValue: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(15),
    color: '#111827',
  },
  statLabel: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(10),
    color: '#9CA3AF',
    marginTop: heightPixel(1),
  },
  phoneInputContainer: {
    marginBottom: heightPixel(16),
  },
  phoneInputBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: widthPixel(16),
    height: heightPixel(52),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  phoneInputTextContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: widthPixel(16),
    paddingVertical: 0,
    height: heightPixel(50),
  },
  phoneInputText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    color: '#111827',
    height: heightPixel(52),
  },
  phoneInputCodeText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    color: '#111827',
  },
});
;
