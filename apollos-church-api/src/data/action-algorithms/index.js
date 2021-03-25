import { ActionAlgorithm as baseAlgorithms } from '@apollosproject/data-connector-rock';
import moment from 'moment-timezone';

class dataSource extends baseAlgorithms.dataSource {
  expanded = true;

  /** Base Attrs and Methods from the Core DataSource */
  /** baseAlgorithms = this.ACTION_ALGORITHIMS; */

  ACTION_ALGORITHIMS = Object.entries({
    ...baseAlgorithms,
    UPCOMING_EVENTS: this.upcomingEventsAlgorithm,
  }).reduce((accum, [key, value]) => {
    // convenciance code to make sure all methods are bound to the Features dataSource
    // eslint-disable-next-line
        accum[key] = value.bind(this);
    return accum;
  }, {});

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
}

export { dataSource };
