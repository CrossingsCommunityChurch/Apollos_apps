// import styleOverrides from './styleOverrides';
// import propOverrides from './propOverrides';''
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { styled } from '@apollosproject/ui-kit';
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

const lightColors = {
  primary: '#313e48',
  secondary: '#236092',
  tertiary: '#bd9a5f',
  text: {
    tertiary: '#bd9a5f',
    action: '#236092',
  },
  action: {
    primary: '#bd9a5f',
    secondary: '#236092',
  },
};

const darkColors = {
  primary: '#313e48',
  secondary: '#236092',
  tertiary: '#bd9a5f',
  text: {
    tertiary: '#bd9a5f',
    action: '#236092',
  },
  action: {
    primary: '#d4aa67',
    secondary: '#236092',
  },
};

const breakpoints = {
  xs: 320,
  sm: 496,
  // md: 800,
  md: 1200,
  lg: 1200,
};

/* Base Typography sizing and fonts.
 * To control speicfic styles used on different type components (like H1, H2, etc), see 'overrides'
 */
// const typography = {};

/* Responsive breakpoints */
// export const breakpoints = {};

//  Base sizing units. These are used to scale
//  space, and size components relatively to one another.

const sizing = {
  avatar: {
    xsmall: 36,
  },
};

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

const FullScreenImage = styled({
  resizeMode: 'cover',
  ...StyleSheet.absoluteFill,
  width: '100%',
  height: '105%',
  top: '-2%',
})(Image);

const HalfScreenImage = styled({
  width: '100%',
  height: '50%',
})(Image);

const overrides = {
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
  ...UIConnectedOverrides({ lightColors, darkColors }),

  // Onboarding
  'ui-onboarding.Landing.Title': {
    textAlign: 'center',
  },
  'ui-onboarding.Landing.Subtitle': {
    textAlign: 'center',
    fontWeight: '900',
    marginBottom: '70%',
  },
  'ui-onboarding.Landing.BrandIcon': {
    paddingRight: '100%',
    size: '70px',
  },
  'ui-onboarding.Landing': {
    slideTitle: "We're glad you're here!",
    description: 'Live By Faith. Be A Voice Of Hope. Be Known By Love.',
    textColor: 'white',
    // eslint-disable-next-line react/display-name
    BackgroundComponent: () => (
      <FullScreenImage source={require('../../assets/Landing.png')} />
    ),
  },
  'ui-onboarding.Slide.SlideContent.Title': {
    textAlign: 'center',
  },
  'ui-onboarding.Slide.SlideContent.Description': {
    textAlign: 'center',
  },
  'ui-onboarding.Features': {
    description:
      "We'd like to help personalize your profile to make the most of your online experience.",
    // eslint-disable-next-line react/display-name
    BackgroundComponent: () => (
      // eslint-disable-next-line react/react-in-jsx-scope
      <Image
        alignSelf={'center'}
        marginTop={'15%'}
        source={require('../../assets/Welcome.png')}
      />
    ),
  },
  'ui-onboarding.LocationFinder': {
    description:
      "We'll use your location to connect you with your nearby campus and community.",
    // eslint-disable-next-line react/display-name
    BackgroundComponent: () => (
      <HalfScreenImage
        alignSelf={'center'}
        marginTop={'15%'}
        source={require('../../assets/Photo-3.jpg')}
      />
    ),
  },
  'ui-onboarding.AskNotifications': {
    description:
      "We'll let you know when important things are happening and keep you in the loop.",
    // eslint-disable-next-line react/display-name
    BackgroundComponent: () => (
      <HalfScreenImage
        alignSelf={'center'}
        marginTop={'15%'}
        source={require('../../assets/Photo-4.jpg')}
      />
    ),
  },
  'ui-onboarding.Follow': {
    description: 'Follow others to stay up to date with your community.',
    // eslint-disable-next-line react/display-name
    BackgroundComponent: () => (
      <Image
        alignSelf={'center'}
        marginTop={'15%'}
        source={require('../../assets/Connect.png')}
      />
    ),
  },
};

export default {
  lightColors,
  darkColors,
  breakpoints,
  overrides,
  typography,
  sizing,
};
