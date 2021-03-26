// import { dataSource as baseLive } from '@apollosproject/data-connector-church-online';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';

const { CHURCH_ONLINE, ROCK_MAPPINGS } = ApollosConfig;

export default class LiveStream extends RockApolloDataSource {
  async getLiveStream() {
    const stream =
      (await this.post(
        `Lava/RenderTemplate`,
        `{[ scheduledcontent schedulecategoryid:'${
          ROCK_MAPPINGS.SUNDAY_SERMON_SCHEDULE_CATEGORY_ID
        }' showwhen:'both' ]}{{ IsLive }}{[ endscheduledcontent ]}`
      )) === 'true';
    return {
      isLive: stream,
      eventStartTime: null,
      media: CHURCH_ONLINE.MEDIA_URLS,
      webViewUrl: CHURCH_ONLINE.WEB_VIEW_URL,
      url: { url: CHURCH_ONLINE.WEB_VIEW_URL, id: '1234654311234' },
    };
  }

  async getLiveStreams() {
    const { ContentItem } = this.context.dataSources;
    // This logic is a little funky right now.
    // The follow method looks at the sermon feed and the `getLiveStream` on this module
    // If we have data in the sermon feed, and the `getLiveStream.isLive` is true
    // this returns an array of livestreams
    const liveItems = await ContentItem.getActiveLiveStreamContent();
    if (!liveItems) return [];
    return Promise.all(
      liveItems.map(async (item) => ({
        contentItem: item,
        ...(await this.getLiveStream()),
      }))
    );
  }
}
