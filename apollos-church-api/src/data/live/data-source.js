// import { dataSource as baseLive } from '@apollosproject/data-connector-church-online';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';
import { compareAsc, parseISO, isFuture } from 'date-fns';
import { first } from 'lodash';

const { ROCK_MAPPINGS } = ApollosConfig;

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
      eventStartTime: '',
      eventEndTime: '',
      media: null,
      url: '',
    };
  }

  async getLiveStreams() {
    const { ContentItem } = this.context.dataSources;
    // This logic is a little funky right now.
    // The follow method looks at the sermon feed and the `getLiveStream` on this module
    // If we have data in the sermon feed, and the `getLiveStream.isLive` is true
    // this returns an array of livestreams
    const liveItems = await ContentItem.getActiveLiveStreamContent();
    return Promise.all(
      liveItems.map(async (item) => ({
        contentItem: item,
        relatedNode: { ...item, __type: ContentItem.resolveType(item) },
        webViewUrl: ContentItem.getWebviewURL(item),
        ...(await this.getLiveStream()),
      }))
    );
  }

  async getNextInstance({ attributeValues }) {
    const { Schedule } = this.context.dataSources;
    const scheduleIds = attributeValues?.schedules?.value;
    if (scheduleIds) {
      const scheduleArray = scheduleIds.split(',');
      const times = await Schedule.getOccurrencesFromIds(scheduleArray);
      const schedule = first(times);
      // This should be the right instance that is starting next. meant to be used in the timeisinschedules function.
      if (schedule) {
        /* const parsedSchedule = await Schedule.parseiCalendar(
          schedule.iCalendarContent
        );

        const nextInstance = parsedSchedule
          .filter(({ end }) => end && isFuture(parseISO(end)))
          .sort((a, b) => {
            const dateA = parseISO(a.start);
            const dateB = parseISO(b.start);

            return compareAsc(dateA, dateB);
          })
          .filter(({ end }) => isFuture(parseISO(end)))
          .find(() => true);
          */
        return schedule;
      }
    }

    return null;
  }
}
