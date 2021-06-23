import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

import { styled, withTheme, Touchable, Icon } from '@apollosproject/ui-kit';

const SearchIcon = withTheme(({ theme: { colors, sizing: { baseUnit } } }) => ({
  name: 'search',
  size: baseUnit * 1.6,
  fill: colors.primary,
}))(Icon);

const SearchButtonContainer = styled(({ theme: { sizing: { baseUnit } } }) => ({
  // position: 'absolute',
  // right: -8,
  // top: -12,
}))(Animated.View);

const HomeSearchButton = ({ onPress }) => (
  <SearchButtonContainer>
    <Touchable onPress={onPress}>
      <SearchIcon />
    </Touchable>
  </SearchButtonContainer>
);

HomeSearchButton.propTypes = {
  onPress: PropTypes.func,
};

export default HomeSearchButton;
