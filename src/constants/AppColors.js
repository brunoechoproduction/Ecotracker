// Light theme — current EcoTrackr colors
export const lightColors = {
  // Primary (same in both themes)
  primary: '#34A853',
  primaryDark: '#2D8E47',
  primaryLight: 'rgba(52, 168, 83, 0.1)',

  // Background
  background: '#FFFFFF',
  backgroundLight: '#F9FAFB',
  successBackground: '#F0FDF4',

  // Text
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textPlaceholder: '#9CA3AF',
  textWhite: '#FFFFFF',
  textWhiteAlpha: 'rgba(255, 255, 255, 0.85)',

  // Input
  inputBackground: '#F9FAFB',
  inputBorder: '#E5E7EB ',
  inputBorderFocused: '#34A853',

  // Status
  link: '#34A853',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#34A853',

  // UI Elements
  iconGray: '#6B7280',
  divider: '#E5E7EB',
  shadowColor: '#000000',

  // Password Strength
  strengthWeak: '#F59E0B',
  strengthMedium: '#F59E0B',
  strengthStrong: '#34A853',

  // Info Box / Warnings
  infoBackground: '#ECFDF5',
  infoText: '#065F46',
  warningBackground: '#FFFBEB',
  warningText: '#92400E',

  // InputField adapter keys (used by InputField component)
  text2: '#374151',
  darkGrey: '#9CA3AF',
  black: '#1F2937',
};

// Dark theme
export const darkColors = {
  // Primary (unchanged)
  primary: '#34A853',
  primaryDark: '#2D8E47',
  primaryLight: 'rgba(52, 168, 83, 0.15)',

  // Background
  background: '#0F172A',
  backgroundLight: '#1E293B',
  successBackground: '#052E16',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textPlaceholder: '#64748B',
  textWhite: '#FFFFFF',
  textWhiteAlpha: 'rgba(255, 255, 255, 0.85)',

  // Input
  inputBackground: '#1E293B',
  inputBorder: '#334155',
  inputBorderFocused: '#34A853',

  // Status
  link: '#4ADE80',
  error: '#F87171',
  warning: '#FBBF24',
  success: '#4ADE80',

  // UI Elements
  iconGray: '#94A3B8',
  divider: '#1E293B',
  shadowColor: '#000000',

  // Password Strength
  strengthWeak: '#FBBF24',
  strengthMedium: '#FBBF24',
  strengthStrong: '#4ADE80',

  // Info Box / Warnings
  infoBackground: '#064E3B',
  infoText: '#D1FAE5',
  warningBackground: '#451A03',
  warningText: '#FDE68A',

  // InputField adapter keys
  text2: '#CBD5E1',
  darkGrey: '#64748B',
  black: '#F1F5F9',
};

// Default export = light (for backward compat with direct imports)
export const AppColors = lightColors;
