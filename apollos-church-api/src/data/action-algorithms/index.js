import { ActionAlgorithm } from '@apollosproject/data-connector-postgres';
import moment from 'moment-timezone';

class dataSource extends ActionAlgorithm.dataSource {
  ACTION_ALGORITHMS = {
    ...this.ACTION_ALGORITHMS,
    UPCOMING_EVENTS: this.upcomingEventsAlgorithm.bind(this),
    UPCOMING_STREAMS: this.allLiveStreamContentAlgorithm.bind(this),
    GROUP_FINDER_GROUPS: this.groupFinderGroupsAlgorithm.bind(this),
  };

  async groupFinderGroupsAlgorithm() {
    const { Group, Campus, PostgresPerson } = this.context.dataSources;
    const person = await PostgresPerson.getCurrentPerson();
    // Should we return unflitered groups?
    if (!person) return [];
    const campus = await Campus.getForPerson(person);
    const campusID = campus.dataValues.originId;
    const groups = await Group.getGroups({
      limit: 4,
      campusId: campusID,
    });
    return groups;
  }

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
}

export { dataSource };
