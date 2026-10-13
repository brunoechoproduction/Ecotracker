import React from 'react';
import { Tabs, usePathname } from 'expo-router';
import { Image, StyleSheet, Text, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

const TabIcon = ({ focused, icon, activeIcon, label }) => {
  const { colors } = useAppTheme();
  
  return (
    <View style={styles.tabItem}>
      <Image
        source={focused ? activeIcon : icon}
        style={[
          styles.icon,
          { tintColor: focused ? '#16A34A' : '#94A3B8' }
        ]}
        resizeMode="contain"
      />
      <Text 
        numberOfLines={1}
        style={[
          styles.label,
          { color: focused ? '#16A34A' : '#94A3B8' }
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const showTabBar = ['/', '/challenges', '/map', '/profile'].includes(pathname) || pathname.startsWith('/eco-stays');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { height: heightPixel(60) + insets.bottom, paddingBottom: insets.bottom || heightPixel(10) },
          !showTabBar && { display: 'none' }
        ],
        tabBarShowLabel: false,

      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={require('../../../assets/icons/tab_home.png')}
              activeIcon={require('../../../assets/icons/tab_active_home.png')}
              label="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={require('../../../assets/icons/tab_thunder.png')}
              activeIcon={require('../../../assets/icons/tab_active_thunder.png')}
              label="Challenges"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={require('../../../assets/icons/tab_pin.png')}
              activeIcon={require('../../../assets/icons/tab_active_pin.png')}
              label="Map"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="eco-stays"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={require('../../../assets/icons/tab_profile.png')}
              activeIcon={require('../../../assets/icons/tab_active_profile.png')}
              label="Profile"
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Reset the stack to index when tab is pressed
            navigation.navigate('profile', { screen: 'index' });
          },
        })}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {

    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: heightPixel(12),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: heightPixel(4),
    width: widthPixel(85),
  },
  icon: {
    width: widthPixel(24),
    height: widthPixel(24),
  },
  label: {
    fontFamily: FontFamily.InterMedium,
    fontSize: fontPixel(11),
    textAlign: 'center',
    width: '100%',
  },
});
