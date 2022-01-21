import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationService,
  withTheme,
  useTheme,
  Icon,
  Touchable,
} from '@apollosproject/ui-kit';
import { useApolloClient } from '@apollo/client';
import {
  createFeatureFeedTab,
  UserAvatarConnected,
  ConnectScreenConnected,
  CampusTabComponent,
  GET_USER_PROFILE,
} from '@apollosproject/ui-connected';
import { checkOnboardingStatusAndNavigate } from '@apollosproject/ui-onboarding';
import ActionTable from './ui/ActionTable';
import ActionBar from './ui/ActionBar';
import tabBarIcon from './tabs/tabBarIcon';
import Logo from './tabs/logo';
import HomeSearchButton from './ui/Search/SearchButton';
import LiveStreamListFeatureConnected from './live-feed/LiveStreamListFeatureConnected';

const HeaderLogo = () => <Logo />;

const SearchButton = () => {
  const navigation = useNavigation();
  return <HomeSearchButton onPress={() => navigation.navigate('Search')} />;
};
const HeaderLogoCore = () => {
  const theme = useTheme();
  return (
    <Icon
      name="brand-icon"
      size={theme.sizing.baseUnit * 1.5}
      fill={theme.colors.primary}
    />
  );
};

const ProfileButton = () => {
  const navigation = useNavigation();
  return (
    <Touchable
      onPress={() => {
        navigation.navigate('UserSettingsNavigator');
      }}
    >
      <View>
        <UserAvatarConnected size="xsmall" />
      </View>
    </Touchable>
  );
};

const SearchButtonCore = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <Touchable
      onPress={() => {
        navigation.navigate('Search');
      }}
    >
      <Icon
        name="search"
        size={theme.sizing.baseUnit * 2}
        fill={theme.colors.primary}
      />
    </Touchable>
  );
};

const tabBarIconCore = (name) => {
  function TabBarIcon({ color }) {
    return <Icon name={name} fill={color} size={24} />;
  }
  TabBarIcon.propTypes = {
    color: PropTypes.string,
  };
  return TabBarIcon;
};

// we nest stack inside of tabs so we can use all the fancy native header features
const HomeTab = createFeatureFeedTab({
  screenOptions: {
    headerHideShadow: true,
    headerCenter: HeaderLogo,
    headerRight: SearchButton,
    headerLeft: ProfileButton,
    headerLargeTitle: false,
  },
  tabName: 'Home',
  feedName: 'HOME',
  tabProps: {
    additionalFeatures: {
      LiveStreamListFeature: LiveStreamListFeatureConnected,
    },
  },
});

const ReadTab = createFeatureFeedTab({
  screenOptions: {
    headerHideShadow: true,
    headerCenter: HeaderLogo,
    headerRight: SearchButton,
    headerLeft: ProfileButton,
    headerLargeTitle: false,
  },
  tabName: 'Read',
  feedName: 'READ',
});

const WatchTab = createFeatureFeedTab({
  screenOptions: {
    headerHideShadow: true,
    headerCenter: HeaderLogo,
    headerRight: SearchButton,
    headerLeft: ProfileButton,
    headerLargeTitle: false,
  },
  tabName: 'Watch',
  feedName: 'WATCH',
});

const GiveTab = createFeatureFeedTab({
  screenOptions: {
    headerHideShadow: true,
    headerLeft: ProfileButton,
    headerRight: SearchButton,
    headerCenter: HeaderLogo,
    headerLargeTitle: false,
  },
  tabName: 'Give',
  feedName: 'GIVE',
});

// const PrayTab = createFeatureFeedTab({
//   screenOptions: {
//     headerHideShadow: true,
//     headerCenter: HeaderLogo,
//     headerRight: SearchButton,
//     headerLeft: ProfileButton,
//     headerLargeTitle: false,
//   },
//   tabName: 'Pray',
//   feedName: 'PRAY',
// });

const CustomConnectScreen = () => (
  <ConnectScreenConnected ActionTable={ActionTable} ActionBar={ActionBar} />
);

const ConnectTabStack = createNativeStackNavigator();
const ConnectTabStackNavigator = () => (
  <ConnectTabStack.Navigator
    screenOptions={{
      headerHideShadow: true,
      headerLargeTitle: false,
      headerCenter: HeaderLogo,
      headerRight: SearchButton,
      headerLeft: ProfileButton,
    }}
  >
    <ConnectTabStack.Screen name={'Connect'} component={CustomConnectScreen} />
  </ConnectTabStack.Navigator>
);

const { Navigator, Screen } = createBottomTabNavigator();

const TabNavigator = () => {
  const client = useApolloClient();
  // this is only used by the tab loaded first
  // if there is a new version of the onboarding flow,
  // we'll navigate there first to show new screens
  useEffect(
    () => {
      checkOnboardingStatusAndNavigate({
        client,
        navigation: NavigationService,
        navigateHome: false,
      });
    },
    [client]
  );
  return (
    <Navigator lazy>
      <Screen
        name="Home"
        component={HomeTab}
        options={{ tabBarIcon: tabBarIcon('home') }}
      />
      <Screen
        name="Read"
        component={ReadTab}
        options={{ tabBarIcon: tabBarIcon('sections') }}
      />
      <Screen
        name="Media"
        component={WatchTab}
        options={{ tabBarIcon: tabBarIcon('video') }}
      />
      {/* <Screen
        name="Pray"
        component={PrayTab}
        options={{ tabBarIcon: tabBarIcon('like') }}
      /> */}
      <Screen
        name="Give"
        component={GiveTab}
        options={{ tabBarIcon: tabBarIcon('currency-circle-dollar') }}
      />
      <Screen
        name="Connect"
        component={ConnectTabStackNavigator}
        options={{ tabBarIcon: tabBarIcon('profile') }}
      />
    </Navigator>
  );
};

export default TabNavigator;
