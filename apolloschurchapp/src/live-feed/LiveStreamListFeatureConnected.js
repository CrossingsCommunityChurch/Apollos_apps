import React, { useState, useEffect } from 'react';
import { Animated, FlatList, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { get, isEmpty, isNumber } from 'lodash';
import { useQuery } from '@apollo/client';
import {
  ConnectedImage,
  TouchableScale,
  styled,
  withTheme,
  withPlaceholder,
  Placeholder,
  H6,
} from '@apollosproject/ui-kit';
import { compose, pure } from 'recompose';

import HorizontalFeatureFeed from '../ui/HorizontalFeatureFeed';
import { useLiveStreams } from './hooks';
import GET_LIVESTREAM_LIST_FEATURE from './getLiveStreamListFeature';

const AVATAR_MULTIPLIER = 0.8;

const LiveItemContainer = styled(({ theme, withMargin }) => ({
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: theme.sizing.baseUnit * (withMargin ? 0.5 : 0),
}))(TouchableScale);

const BorderWithPulse = withTheme()(({ theme, ...props }) => {
  const themeSize = theme.sizing.avatar.medium * AVATAR_MULTIPLIER;
  const MIN = 0.3;
  const MAX = 1;
  const duration = 1000;
  const [opacity, setOpacity] = useState(new Animated.Value(MIN));
  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: MAX,
      duration,
      useNativeDriver: true,
    }).start(() => {
      fadeOut();
    });
  };
  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: MIN,
      duration,
      useNativeDriver: true,
    }).start(() => {
      fadeIn();
    });
  };

  useEffect(() => {
    fadeIn();
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        height: themeSize,
        width: themeSize,
        borderRadius: themeSize * 0.5,
        borderWidth: 2,
        borderColor: theme.colors.alert,
      }}
      {...props}
    />
  );
});

const CirclularImage = withTheme(({ theme }) => {
  const themeSize = theme.sizing.avatar.medium * AVATAR_MULTIPLIER - 8;
  return {
    minAspectRatio: 1,
    maxAspectRatio: 1,
    maintainAspectRatio: true,
    style: {
      height: themeSize,
      width: themeSize,
      borderRadius: themeSize * 0.5,
    },
  };
})(ConnectedImage);

const CircularImagePosition = styled(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const Title = compose(
  styled(
    ({ theme }) => ({
      color: theme.colors.text.tertiary,
    }),
    'LiveItem.Title'
  ),
  withPlaceholder(Placeholder.Typography, { width: 75 }),
  pure
)(H6);

const LiveImageContainer = styled(({ theme, withMargin }) => ({
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'center',
  marginRight: theme.sizing.baseUnit * (withMargin ? 0.5 : 0),
}))(TouchableScale);

const LiveTouchable = ({ coverImage, withMargin, onPressItem, url, title }) => (
  <LiveItemContainer
    withMargin={withMargin}
  >
    <LiveImageContainer
        onPress={() =>
          onPressItem({
            relatedNode: { url },
            action: 'OPEN_URL',
          })
        }
    >
      <BorderWithPulse />
      <CircularImagePosition>
        <CirclularImage source={get(coverImage, 'sources[0]')} />
      </CircularImagePosition>
    </LiveImageContainer>
    <Title>{title}</Title>
  </LiveItemContainer>
);

const renderItem = ({ item, index, dataLength, ...props }) => {
  const { relatedNode, media, webViewUrl } = item;
  return (
    <LiveTouchable
      {...relatedNode}
      url={webViewUrl}
      media={media}
      withMargin={index < dataLength - 1}
      {...props}
    />
  );
};

const LiveStreamsFeedFeature = ({ liveStreams, ...props }) => (
  <FlatList
    data={liveStreams}
    renderItem={(items) =>
      renderItem({ ...items, dataLength: liveStreams.length, ...props })
    }
    horizontal
  />
);

const LiveStreamListFeatureConnected = ({
  featureId,
  onPressActionItem,
  ...props
}) => {
  const { loading, data } = useQuery(GET_LIVESTREAM_LIST_FEATURE, {
    fetchPolicy: 'network-only',
    skip: isEmpty(featureId),
    variables: {
      featureId,
    },
  });
  const { liveStreams, title, subtitle } = get(data, 'node', {
    liveStreams: [],
    title: '',
    subtitle: null,
  });
  const { currentStreams } = useLiveStreams(data?.node?.liveStreams);
  const style = liveStreams.length === 1 ? { alignItems: 'center' } : {};

  return currentStreams.length > 0 ? (
    <View style={{ flexDirection: 'row' }}>
      <HorizontalFeatureFeed
        Component={LiveStreamsFeedFeature}
        liveStreams={currentStreams}
        title={title}
        subtitle={subtitle}
        style={style}
        isLoading={loading}
        {...props}
      />
    </View>
  ) : null;
};

LiveStreamListFeatureConnected.propTypes = {
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  ItemSeparatorComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};

LiveStreamListFeatureConnected.defaultProps = {
  isLoading: false,
  ItemSeparatorComponent: null,
};

export default LiveStreamListFeatureConnected;
