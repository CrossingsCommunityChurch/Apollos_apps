import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PropTypes from 'prop-types';
import {
  NavigationService,
  withTheme,
  Icon,
  Touchable,
} from '@apollosproject/ui-kit';
import { useApolloClient } from '@apollo/client';
import {
  createFeatureFeedTab,
  UserAvatarConnected,
  ConnectScreenConnected,
} from '@apollosproject/ui-connected';
import { checkOnboardingStatusAndNavigate } from '@apollosproject/ui-onboarding';
import { useNavigation } from '@react-navigation/native';
import ActionTable from '../ui/ActionTable';
import ActionBar from '../ui/ActionBar';
import LiveStreamListFeatureConnected from '../live-feed/LiveStreamListFeatureConnected';
import HomeSearchButton from '../ui/Search/SearchButton';
import tabBarIcon from './tabBarIcon';
import Logo from './logo';

const Avatar = withTheme(({ theme: { sizing: { baseUnit } } }) => ({
  size: 'small',
  containerStyle: {
    paddingBottom: baseUnit * 0.25,
  },
}))(UserAvatarConnected);

const ProfileButton = ({ onPress }) => (
  <Touchable onPress={onPress}>
    <View>
      <Avatar />
    </View>
  </Touchable>
);

ProfileButton.propTypes = {
  onPress: PropTypes.func,
};

const HeaderLeft = () => {
  const navigation = useNavigation();
  return (
    <ProfileButton
      onPress={() => {
        navigation.navigate('UserSettingsNavigator');
      }}
    />
  );
};
const HeaderCenter = () => <Logo />;
const HeaderRight = () => {
  const navigation = useNavigation();
  return <HomeSearchButton onPress={() => navigation.navigate('Search')} />;
};

const CustomConnectScreen = () => (
  <ConnectScreenConnected
    showAvatar
    ActionTable={ActionTable}
    ActionBar={ActionBar}
  />
);

// we nest stack inside of tabs so we can use all the fancy native header features
const HomeTab = createFeatureFeedTab({
  screenOptions: {
    headerHideShadow: true,
    headerCenter: HeaderCenter,
    headerRight: HeaderRight,
    headerLeft: HeaderLeft,
    headerLargeTitle: false,
  },
  tabProps: {
    additionalFeatures: {
      LiveStreamListFeature: LiveStreamListFeatureConnected,
    },
  },
  tabName: 'Home',
  feedName: 'HOME',
});

const ReadTab = createFeatureFeedTab({
  screenOptions: {
    headerHideShadow: true,
    headerCenter: HeaderCenter,
    headerRight: HeaderRight,
    headerLeft: HeaderLeft,
    headerLargeTitle: false,
  },
  tabName: 'Read',
  feedName: 'READ',
});

const WatchTab = createFeatureFeedTab({
  screenOptions: {
    headerHideShadow: true,
    headerCenter: HeaderCenter,
    headerRight: HeaderRight,
    headerLeft: HeaderLeft,
    headerLargeTitle: false,
  },
  tabName: 'Watch',
  feedName: 'WATCH',
});

const PrayTab = createFeatureFeedTab({
  screenOptions: {
    headerHideShadow: true,
    headerCenter: HeaderCenter,
    headerRight: HeaderRight,
    headerLeft: HeaderLeft,
    headerLargeTitle: false,
  },
  tabName: 'Pray',
  feedName: 'PRAY',
});

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
      <Screen
        name="Pray"
        component={PrayTab}
        options={{ tabBarIcon: tabBarIcon('like') }}
      />
      <Screen
        name="Profile"
        component={CustomConnectScreen}
        options={{ tabBarIcon: tabBarIcon('profile') }}
      />
    </Navigator>
  );
};

export default TabNavigator;
