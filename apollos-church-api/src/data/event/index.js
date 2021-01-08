import { Event } from '@apollosproject/data-connector-rock';
import ical from 'node-ical';
import moment from 'moment-timezone';
import ApollosConfig from '@apollosproject/config';
import resolver from './resolver';

// Re-work this after Rock update to v12 to use the eventscheduledinstance lavatemplate.

const { ROCK_CONSTANTS } = ApollosConfig;
const imageURL = 'images.crossings.church';

async function getMostRecentOccurenceForEvent(event) {
  // Let's grab the iCal content
  const iCal = event.schedule.iCalendarContent;
  const iCalEvent = Object.values(await ical.async.parseICS(iCal))[0];

  // Default the start date to the iCal's reported state date
  let mostRecentOccurence = moment.tz(
    iCalEvent.start,
    ApollosConfig.ROCK.TIMEZONE
  );

  // Dates returned from `iCal` are parsed if they are in UTC.
  // We need to find the difference between the times returned and the correct time.
  // And then offset by that time.
  const tzOffset = moment.tz
    .zone(ApollosConfig.ROCK.TIMEZONE)
    .utcOffset(mostRecentOccurence);

  mostRecentOccurence = mostRecentOccurence.add(tzOffset, 'minutes').toDate();
  // Sometimes we have a "recurring rule"
  // eslint-disable-next-line prettier/prettier
  // eslint-disable-next-line no-console
  // console.log(`ICAL OBJECT: ${JSON.stringify(iCalEvent)}`);
  if (iCalEvent.rrule) {
    // Using the embeded RRule JS library, let's grab the next time this event occurs.
    mostRecentOccurence = moment.tz(
      iCalEvent.rrule.after(new Date()),
      ApollosConfig.ROCK.TIMEZONE
    );

    const offset = moment.tz
      .zone(ApollosConfig.ROCK.TIMEZONE)
      .utcOffset(mostRecentOccurence);

    mostRecentOccurence = mostRecentOccurence.add(offset, 'minutes').toDate();

    // console.log({ mostRecentOccurence }, 'rrule');
    // Rock also likes to throw events inside this rdate property in the iCal string.
  } else if (iCalEvent.rdate) {
    // rdate's aren't supported by the iCal library. Let's parse them ourselves.
    mostRecentOccurence = iCalEvent.rdate
      .split(',') // Take a list of values
      .map((d) => moment.tz(d, ApollosConfig.ROCK.TIMEZONE).toDate()) // Use moment to parse them into dates
      .find((d) => d > new Date()); // Now find the one that happens soonest (it's already sorted by earliest to latest)
  }
  // We should have _something_ at this point. Return it!
  return mostRecentOccurence;
}

class dataSource extends Event.dataSource {
  async getUpcomingEventsByCampus({ limit = null, campusId } = {}) {
    // Get the first three persona items.
    const events = await this.findRecent()
      .andFilter(`CampusId eq ${campusId}`)
      .andFilter(
        `(Schedule/EffectiveEndDate ge datetime'${moment()
          // we need to subtract a day. The EffectiveEndDate is often the morning of the current day.
          // It's okay to get already occured events, because we filter them out later on.
          .subtract(1, 'day')
          .toISOString()}' or Schedule/EffectiveEndDate eq null)`
      )
      .get();

    // Phew - this gets tricky. We have to parse the iCal to figure out the REAL start date
    const eventsWithMostRecentOccurence = await Promise.all(
      events.map(async (event) => ({
        ...event,
        mostRecentOccurence: await getMostRecentOccurenceForEvent(event),
      }))
    );

    const sortedEvents = eventsWithMostRecentOccurence
      .filter(
        ({ mostRecentOccurence }) =>
          mostRecentOccurence &&
          mostRecentOccurence.getTime() > new Date().getTime()
      )
      .sort(
        (a, b) =>
          a.mostRecentOccurence.getTime() - b.mostRecentOccurence.getTime()
      );

    if (limit != null) {
      // eslint-disable-next-line prettier/prettier
      // console.log(JSON.stringify(sortedEvents));
      return sortedEvents.slice(0, 5);
    }
    // eslint-disable-next-line prettier/prettier
    // console.log(JSON.stringify(sortedEvents));
    return sortedEvents;
  }

  getDateTime = async (schedule) => {
    /** Named schedules will include a duration, check in start offset and check in end offset
     *  (in minutes) and there is a parser using Lava that gives us all of these values
     */
    const lava = `{% schedule id:'${schedule.id}' %}
    {% assign duration = schedule.DurationInMinutes %}
        {
            "nextStartDateTime": "{{ schedule.NextStartDateTime | Date:'yyyy-MM-dd HH:mm' }}",
            "endTime": "{{ schedule.NextStartDateTime | DateAdd:duration,'m' | Date:'yyy-MM-dd HH:mm' }}"
        }
    {% endschedule %}`;

    /** Parse the response and get each property of the response */
    const response = await this.post(
      `/Lava/RenderTemplate`,
      lava.replace(/\n/g, '')
    );
    const jsonResponse = JSON.parse(response);

    /** Build the final return object with defaults taken into consideration */
    const nextStart = jsonResponse.nextStartDateTime;
    const end = jsonResponse.endTime;

    console.log(
      `The end Time is: ${nextStart} and evaluates as ${moment
        .tz(nextStart, 'yyyy-MM-dd HH:mm', ApollosConfig.ROCK.TIMEZONE)
        .utc()
        .format()}`
    );
    // Convert to UTC time
    if (
      moment(nextStart, 'yyyy-MM-dd HH:mm').isValid() &&
      moment(end, 'yyyy-MM-dd HH:mm').isValid()
    ) {
      console.log('We made it here.');
      return {
        start: moment
          .tz(nextStart, 'yyyy-MM-dd HH:mm', ApollosConfig.ROCK.TIMEZONE)
          .utc()
          .format(),
        end: moment
          .tz(end, 'yyyy-MM-dd HH:mm', ApollosConfig.ROCK.TIMEZONE)
          .utc()
          .format(),
      };
    }

    // Fallback
    return {
      start: null, // Keep a null start date by default for easier value checking
      end: null, // Default the startOffset if the offset is 0
    };
  };

  getImage = async ({ eventItemId }) => {
    const event = await this.request('EventCalendarItems')
      .andFilter(`EventItemId eq ${eventItemId}`)
      .get();
    const eventProcess = event[0];
    const imageUrl = await this.getImages({
      attributeValues: eventProcess.attributeValues,
      attributes: eventProcess.attributes,
    });
    // console.log("image asset is ")
    // console.log(imageUrl);
    if (imageUrl) {
      return imageUrl[0];
    }
    return null;
  };

  attributeIsImage = ({ key, attributeValues, attributes }) =>
    attributes[key].fieldTypeId === ROCK_CONSTANTS.IMAGE ||
    (key.toLowerCase().includes('image') &&
      typeof attributeValues[key].value === 'string' &&
      (attributeValues[key].value.startsWith('http') ||
        attributeValues[key].valueFormatted.startsWith('http'))); // looks like an image url

  getImages = async ({ attributeValues, attributes }) => {
    const imageKeys = Object.keys(attributes).filter((key) =>
      this.attributeIsImage({
        key,
        attributeValues,
        attributes,
      })
    );
    return imageKeys.map((key) => ({
      __typename: 'ImageMedia',
      key,
      name: attributes[key].name,
      sources: attributeValues[key].value
        ? [
            {
              uri: attributeValues[key].valueFormatted.replace(
                'cccrockweb.s3.amazonaws.com',
                imageURL
              ),
            },
          ]
        : [],
    }));
  };
}

const { schema } = Event;
export { schema, resolver, dataSource };
