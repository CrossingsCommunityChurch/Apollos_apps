import { Feature as coreFeatures } from '@apollosproject/data-connector-postgres';

export default class Feature extends coreFeatures.dataSource {
  modelName = 'feature';

  async createLiveStreamListFeature({ algorithms, title, subtitle }) {
    const { ActionAlgorithm } = this.context.dataSources;
    const liveStreams = ActionAlgorithm.runAlgorithms({ algorithms });

    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        args: {
          algorithms,
          title,
          subtitle,
        },
      }),
      title,
      subtitle,
      liveStreams,
      // Typename is required so GQL knows specifically what Feature is being created
      __typename: 'LiveStreamListFeature',
    };
  }

  /** Create Feeds */
  getFeatures = async (featuresConfig = [], args = {}) =>
    Promise.all(
      featuresConfig.map((featureConfig) => {
        const finalConfig = { ...featureConfig, ...args };
        switch (featureConfig.type) {
          case 'ActionBar':
            return this.createActionBarFeature(finalConfig);
          case 'ActionTable':
            return this.createActionTableFeature(finalConfig);
          case 'VerticalCardList':
            return this.createVerticalCardListFeature(finalConfig);
          case 'HorizontalCardList':
            return this.createHorizontalCardListFeature(finalConfig);
          case 'HeroListFeature':
            console.warn(
              'Deprecated: Please use the name "HeroList" instead. You used "HeroListFeature"'
            );
            return this.createHeroListFeature(finalConfig);
          case 'HeroList':
            return this.createHeroListFeature(finalConfig);
          case 'PrayerList':
            return this.createPrayerListFeature(finalConfig);
          case 'VerticalPrayerList':
            return this.createVerticalPrayerListFeature(finalConfig);
          case 'WebView':
            return this.createWebViewFeature(finalConfig);
          case 'FollowPeople':
            return this.createFollowPeopleFeature(finalConfig);
          case 'LiveContentList':
            return this.createLiveStreamListFeature(finalConfig);
          case 'ActionList':
          default:
            // Action list was the default in 1.3.0 and prior.
            return this.createActionListFeature(finalConfig);
        }
      })
    );
}
