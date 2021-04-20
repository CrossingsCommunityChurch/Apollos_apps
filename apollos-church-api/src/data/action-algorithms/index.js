import { ActionAlgorithm as baseAlgorithms } from '@apollosproject/data-connector-rock';
import moment from 'moment-timezone';

class dataSource extends baseAlgorithms.dataSource {
  expanded = true;

  /** Base Attrs and Methods from the Core DataSource */
  /** baseAlgorithms = this.ACTION_ALGORITHIMS; */

  ACTION_ALGORITHMS = {
    ...this.ACTION_ALGORITHMS,
    UPCOMING_EVENTS: this.upcomingEventsAlgorithm.bind(this),
    UPCOMING_STREAMS: this.allLiveStreamContentAlgorithm.bind(this),
  };

  async upcomingEventsAlgorithm() {
    const { Event, Person } = this.context.dataSources;
    const { campusId } = await Person.getCurrentUserCampusId();
    if (!campusId) {
      return [];
    }

    const events = await Event.getUpcomingEventsByCampus({
      campusId,
      limit: 3,
    });

    // Map them into specific actions.
    return events.map((event, i) => ({
      id: `${event.id}${i}`,
      title: Event.getName(event),
      subtitle: moment(event.mostRecentOccurence) // we add the `mostRecentOccurence` field in the `getUpcomingEventsByCampus` method.
        .tz('America/Chicago')
        .format('dddd, MMM D'),
      relatedNode: { ...event, __type: 'Event' },
      // image: Event.getImage(event),
      // Current app design calls for no user-supplied images.
      image: Event.getImage(event),
      action: 'READ_EVENT',
      summary: '',
    }));
  }

  async upcomingStreamsAlgorithm() {
    const { LiveStream, ContentItem } = this.context.dataSources;
    const liveStreams = await LiveStream.getLiveStreams({});
    // Map them into specific actions.
    return liveStreams.map((stream, i) => ({
      id: `1234${i}`,
      title: 'Test title',
      subtitle: 'Test Subtitle',
      relatedNode: { ...stream.url, __type: 'Url' },
      image: ContentItem.getCoverImage(stream.contentItem),
      action: 'OPEN_URL',
      summary: '',
    }));
  }

  async allLiveStreamContentAlgorithm() {
    const { LiveStream } = this.context.dataSources;
    const liveStreams = await LiveStream.getLiveStreams();
    return liveStreams;
  }
}

export { dataSource };
