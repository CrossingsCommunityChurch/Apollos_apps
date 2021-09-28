import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { withTheme } from '@apollosproject/ui-kit';
import { useNavigation } from '@react-navigation/native';
import { ConnectScreenConnected } from '@apollosproject/ui-connected';
import HomeSearchButton from '../../ui/Search/SearchButton';
import Logo from '../logo';
import ActionTable from '../../ui/ActionTable';
import ActionBar from '../../ui/ActionBar';
// import ConnectScreenConnected from './connectScreenConnected';

const { Navigator, Screen } = createNativeStackNavigator();

const HeaderCenter = () => <Logo />;
const HeaderRight = () => {
  const navigation = useNavigation();
  return <HomeSearchButton onPress={() => navigation.navigate('Search')} />;
};

const ConnectScreen = () => (
  <ConnectScreenConnected
    showAvatar={false}
    ActionTable={ActionTable}
    ActionBar={ActionBar}
  />
);

const ConnectNavigator = (props) => (
  <Navigator {...props}>
    <Screen component={ConnectScreen} name="Connect" />
  </Navigator>
);

const EnhancedNavigator = withTheme(({ theme, ...props }) => ({
  ...props,
  screenOptions: {
    headerHideShadow: true,
    headerCenter: HeaderCenter,
    headerRight: HeaderRight,
    headerLargeTitle: false,
  },
}))(ConnectNavigator);

export default EnhancedNavigator;
