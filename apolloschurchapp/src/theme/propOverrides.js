import LiveStreamListFeatureConnected from '../live-feed/LiveStreamListFeatureConnected';

/* Export your custom prop overrides here. */
export default {
  'ui-connected.FeaturesFeed.FeatureFeedComponentMapper': {
    additionalFeatures: {
      LiveStreamListFeature: LiveStreamListFeatureConnected,
    },
  },
};
