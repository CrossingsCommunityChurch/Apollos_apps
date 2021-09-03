import { ActionAlgorithm } from '@apollosproject/data-connector-postgres';
import moment from 'moment-timezone';

class dataSource extends ActionAlgorithm.dataSource {
  ACTION_ALGORITHMS = {
    ...this.ACTION_ALGORITHMS,
    UPCOMING_EVENTS: this.upcomingEventsAlgorithm.bind(this),
    UPCOMING_STREAMS: this.allLiveStreamContentAlgorithm.bind(this),
  };

  async upcomingEventsAlgorithm() {
    const { Event, RockPerson } = this.context.dataSources;
    const { campusId } = await RockPerson.getCurrentUserCampusId();
    if (!campusId) {
      return [];
    }

    const events = await Event.getUpcomingEventsByCampus({
      campusId,
      limit: 8,
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

  async allLiveStreamContentAlgorithm() {
    const { LiveStream } = this.context.dataSources;
    const liveStreams = await LiveStream.getLiveStreams();
    return liveStreams;
  }
}

export { dataSource };
