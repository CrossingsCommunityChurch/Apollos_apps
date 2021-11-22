import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import { BackgroundView, styled } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const BackgroundContainer = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
  paddingTop: theme.sizing.baseUnit,
}))(BackgroundView);

// const html =
//  '<script async src="https://merlin.simpledonation.com/js/installScript.js"></script><a href="#" class="open-merlin" data-merlin-key="01E4ESB8Z1ANNJZ95F7JHP20Y6" data-merlin-autoload="true">Give Now</a>';

export default class Giving extends Component {
  static navigationOptions = () => ({
    title: 'Upcoming Events',
  });

  static propTypes = {
    /** Functions passed down from React Navigation to use in navigating to/from
     * items in the feed.
     */
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };
  // Need to change this to point local when developing for now until an update is pushed to the API.
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          javaScriptEnabled={true}
          originWhitelist={['*']}
          source={{ uri: 'https://apollo.crossings.church/simpledonation' }}
          mixedContentMode="always"
        />
      </SafeAreaView>
    );
  }
}
