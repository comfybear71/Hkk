export const COLORS = {
  // Primary greens
  primary: '#4CAF50',
  primaryLight: '#81C784',
  primaryDark: '#388E3C',
  primarySoft: '#E8F5E9',

  // Warm accents
  accent: '#FF8A65',
  accentLight: '#FFAB91',
  accentDark: '#E64A19',
  accentSoft: '#FBE9E7',

  // Soft pastels
  pink: '#F48FB1',
  pinkLight: '#FCE4EC',
  purple: '#CE93D8',
  purpleLight: '#F3E5F5',
  peach: '#FFCCBC',
  lavender: '#E1BEE7',
  mint: '#B2DFDB',
  skyBlue: '#B3E5FC',
  sunflower: '#FFF9C4',
  coral: '#FF8A80',

  // Backgrounds
  background: '#FAFFFE',
  cardBg: '#FFFFFF',
  surface: '#F1F8F2',

  // Text
  textPrimary: '#1B5E20',
  textSecondary: '#4E7D50',
  textMuted: '#8DA88F',
  textDark: '#263238',
  textLight: '#FFFFFF',

  // Status
  success: '#66BB6A',
  warning: '#FFB74D',
  warningDark: '#F57C00',
  danger: '#EF5350',
  info: '#42A5F5',

  // Misc
  border: '#C8E6C9',
  shadow: '#00000015',
  overlay: '#00000040',
  white: '#FFFFFF',
  grey: '#E0E0E0',
  greyDark: '#9E9E9E',
};

export const GRADIENTS = {
  primary: ['#66BB6A', '#43A047'],
  warm: ['#FF8A65', '#FF7043'],
  sunset: ['#FFB74D', '#FF8A65'],
  fresh: ['#81C784', '#4CAF50'],
  glow: ['#FFF9C4', '#FFECB3'],
  sky: ['#B3E5FC', '#81D4FA'],
  pink: ['#F48FB1', '#EC407A'],
  card: ['#FFFFFF', '#F1F8F2'],
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: {
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const FONTS = {
  h1: { fontSize: 28, fontWeight: '700', color: COLORS.textPrimary },
  h2: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary },
  h3: { fontSize: 20, fontWeight: '600', color: COLORS.textPrimary },
  body: { fontSize: 17, fontWeight: '400', color: COLORS.textDark, lineHeight: 24 },
  bodyLarge: { fontSize: 19, fontWeight: '400', color: COLORS.textDark, lineHeight: 28 },
  caption: { fontSize: 15, fontWeight: '400', color: COLORS.textSecondary },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 0.5 },
  button: { fontSize: 17, fontWeight: '600', color: COLORS.white },
};
