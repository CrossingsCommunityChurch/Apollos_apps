import React, { View } from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { withTheme, Touchable } from '@apollosproject/ui-kit';
import { useNavigation } from '@react-navigation/native';
import {
  UserAvatarConnected,
  ConnectScreenConnected,
} from '@apollosproject/ui-connected';
import { PropTypes } from 'prop-types';
import HomeSearchButton from '../../ui/Search/SearchButton';
import Logo from '../logo';
import ActionTable from '../../ui/ActionTable';
import ActionBar from '../../ui/ActionBar';
// import ConnectScreenConnected from './connectScreenConnected';

const { Navigator, Screen } = createNativeStackNavigator();

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

const ConnectScreen = () => (
  <ConnectScreenConnected
    showAvatar={false}
    ActionTable={ActionTable}
    ActionBar={ActionBar}
  />
);

const Connect = (props) => (
  <Navigator initialRouteName="Connect" {...props}>
    <Screen component={ConnectScreen} name="Connect" />
  </Navigator>
);

const EnhancedNavigator = withTheme(({ theme, ...props }) => ({
  ...props,
  screenOptions: {
    headerHideShadow: true,
    headerCenter: HeaderCenter,
    headerRight: HeaderRight,
    headerLeft: HeaderLeft,
    headerLargeTitle: false,
  },
}))(Connect);

export default Connect;
