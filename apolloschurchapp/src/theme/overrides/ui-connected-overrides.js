import { FEATURE_FEED_ACTION_MAP } from '@apollosproject/ui-connected';
import { useNavigation } from '@react-navigation/native';

export default () => ({
  'ui-connected.RockAuthedWebBrowser': {
    primary: '#fff',
    paper: 'black',
  },
  'ui-connected.FeaturesFeedConnected': {
    onPressActionItem: () => (action, ...props) => {
      if (FEATURE_FEED_ACTION_MAP[action]) {
        FEATURE_FEED_ACTION_MAP[action]({ action, ...props });
      } else {
        useNavigation.navigate('ContentFeed');
      }
    },
  },
});
