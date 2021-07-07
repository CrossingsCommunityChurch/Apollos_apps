// import styleOverrides from './styleOverrides';
// import propOverrides from './propOverrides';''
import fonts from './fonts';
import { UIConnectedOverrides } from './overrides';

/* Add your custom theme definitions below. Anything that is supported in UI-Kit Theme can be
 overridden and/or customized here! */

/* Base colors.
 * These get used by theme types (see /types directory) to color
 * specific parts of the interface. For more control on how certain
 * elements are colored, go there. The next level of control comes
 * on a per-component basis with 'overrides'
 */

const colors = {
  primary: '#313e48',
  secondary: '#236092',
  tertiary: '#bd9a5f',
  screen: '#F8F7F4',
  paper: '#FFFFFF',
  alert: '#c64f55',

  // Dark shades
  darkPrimary: '#1d242b',
  darkSecondary: '#1e436e',
  darkTertiary: '#9c7d4c',

  // Light shades
  lightPrimary: '#ffffff',
  lightSecondary: '#f7f7f7',
  lightTertiary: '#d4aa67',

  // Statics
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
  wordOfChrist: '#8b0000', // only used in Scripture.

  action: {
    primary: '#d4aa67',
  },
  text: {
    tertiary: '#bd9a5f',
  },
};

/* Base Typography sizing and fonts.
 * To control speicfic styles used on different type components (like H1, H2, etc), see 'overrides'
 */
// const typography = {};

/* Responsive breakpoints */
// export const breakpoints = {};

/* Base sizing units. These are used to scale
 * space, and size components relatively to one another.
 */
// export const sizing = {};

/* Base alpha values. These are used to keep transparent values across the app consistant */
// export const alpha = {};

/* Base overlays. These are used as configuration for LinearGradients across the app */
// export const overlays = () => ({});

/* Overrides allow you to override the styles of any component styled using the `styled` HOC. You
 * can also override the props of any component using the `withTheme` HOC. See examples below:
 * ```const StyledComponent = styled({ margin: 10, padding: 20 }, 'StyledComponent');
 *    const PropsComponent = withTheme(({ theme }) => ({ fill: theme.colors.primary }), 'PropsComponent');
 * ```
 * These componnents can have their styles/props overriden by including the following overrides:
 * ```{
 *   overides: {
 *     StyledComponent: {
 *       margin: 5,
 *       padding: 15,
 *     },
 *     // #protip: you even have access 👇to component props! This applies to style overrides too 💥
 *     PropsComponent: () => ({ theme, isActive }) => ({
 *       fill: isActive ? theme.colors.secondary : theme.colors.primary,
 *     }),
 *   },
 * }
 * ```
 */
// const overrides = {
//   ...styleOverrides,
//   ...propOverrides,
// };

export const typography = {
  ...fonts,
  baseFontSize: 16,
  baseLineHeight: 23.04, // 1.44 ratio
};

const overrides = {
  'ui-kit.FeaturedCard.Label': {
    type: 'secondary',
  },
  'ui-kit.HighlightCard.Label': {
    type: 'secondary',
  },
  H1: {
    fontFamily: typography.sans.black.default,
  },
  H2: {
    fontFamily: typography.sans.black.default,
  },
  H3: {
    fontFamily: typography.sans.black.default,
  },
  H4: {
    fontFamily: typography.sans.black.default,
  },
  H5: {
    fontFamily: typography.sans.bold.default,
  },
  H6: {
    fontFamily: typography.sans.black.default,
  },
  ...UIConnectedOverrides({ colors }),
};

export default { colors, overrides, typography };
