import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationService } from '@apollosproject/ui-kit';
import { useApolloClient } from '@apollo/client';
import { createFeatureFeedTab } from '@apollosproject/ui-connected';
import { checkOnboardingStatusAndNavigate } from '@apollosproject/ui-onboarding';
import { ONBOARDING_VERSION } from '../ui/Onboarding';
import LiveStreamListFeatureConnected from '../live-feed/LiveStreamListFeatureConnected';
import Connect from './connect';
import tabBarIcon from './tabBarIcon';
import Logo from './logo';

const HeaderCenter = () => <Logo />;

// we nest stack inside of tabs so we can use all the fancy native header features
const HomeTab = createFeatureFeedTab({
  screenOptions: {
    headerHideShadow: true,
    headerCenter: HeaderCenter,
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
  tabName: 'Read',
  feedName: 'READ',
});

const WatchTab = createFeatureFeedTab({
  tabName: 'Watch',
  feedName: 'WATCH',
});

const PrayTab = createFeatureFeedTab({
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
        latestOnboardingVersion: ONBOARDING_VERSION,
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
        name="Watch"
        component={WatchTab}
        options={{ tabBarIcon: tabBarIcon('video') }}
      />
      <Screen
        name="Pray"
        component={PrayTab}
        options={{ tabBarIcon: tabBarIcon('like') }}
      />
      <Screen
        name="Connect"
        component={Connect}
        options={{ tabBarIcon: tabBarIcon('profile') }}
      />
    </Navigator>
  );
};

export default TabNavigator;
