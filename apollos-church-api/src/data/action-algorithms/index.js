import { ActionAlgorithm } from '@apollosproject/data-connector-postgres';
import moment from 'moment-timezone';

class dataSource extends ActionAlgorithm.dataSource {
  ACTION_ALGORITHMS = {
    ...this.ACTION_ALGORITHMS,
    UPCOMING_EVENTS: this.upcomingEventsAlgorithm.bind(this),
    UPCOMING_STREAMS: this.allLiveStreamContentAlgorithm.bind(this),
    PERSONAL_PRAYER: this.dailyPersonalPrayerAlgorithm.bind(this),
  };

  async upcomingEventsAlgorithm() {
    const { Event, Campus, PostgresPerson } = this.context.dataSources;
    const person = await PostgresPerson.getCurrentPerson();
    if (!person) return [];
    const campus = await Campus.getForPerson(person);
    const campusID = campus.dataValues.originId;
    const events = await Event.getUpcomingEventsByCampus({
      limit: 4,
      campusId: campusID,
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
      action: 'READ_CONTENT',
      summary: '',
    }));
  }

  async allLiveStreamContentAlgorithm() {
    const { LiveStream } = this.context.dataSources;
    const liveStreams = await LiveStream.getLiveStreams();
    return liveStreams;
  }

  async dailyPersonalPrayerAlgorithm({
    limit = 10,
    numberDaysSincePrayer,
    personId,
  } = {}) {
    const { PrayerRequest, Feature } = this.context.dataSources;
    Feature.setCacheHint({ scope: 'PRIVATE' });

    return PrayerRequest.byPersonalPrayerFeed({
      numberDaysSincePrayer,
      personId,
      limit,
    });
  }
}

export { dataSource };
