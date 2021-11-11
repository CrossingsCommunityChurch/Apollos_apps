import { Event } from '@apollosproject/data-connector-rock';
import moment from 'moment-timezone';
import ApollosConfig from '@apollosproject/config';
import { get } from 'lodash';
import schema from './schema';
import resolver from './resolver';

// Re-work this after Rock update to v12 to use the eventscheduledinstance lavatemplate.

const { ROCK_CONSTANTS, CONTENT } = ApollosConfig;
const imageURL = 'images.crossings.church/fit-in/700x700';

class dataSource extends Event.dataSource {
  calIds = CONTENT.ALL_CALIDS;

  findRecent = (calId) => {
    let request = this.request();
    if (!get(ApollosConfig, 'ROCK.USE_PLUGIN', false)) {
      console.warn(
        'Fetching public campuses is not possible without the Apollos Plugin\n\nReturning all campuses.'
      );
    } else {
      request = this.request(
        `Apollos/GetEventItemOccurencesByCalendarId?id=${calId}`
      );
    }
    return request
      .cache({ ttl: 60 })
      .expand('Schedule')
      .orderBy('Schedule/EffectiveStartDate')
      .filter('Schedule/EffectiveStartDate ne null');
  };

  async getUpcomingEventsByCampus({ limit = null, campusId = null } = {}) {
    const campusEvents = [];
    await Promise.all(
      this.calIds.map(async (id) => {
        const events = await this.findRecent(id)
          .andFilter(
            `(Schedule/EffectiveEndDate ge datetime'${moment()
              .subtract(1, 'day')
              .toISOString()}' or Schedule/EffectiveEndDate eq null) and CampusId eq ${campusId}`
          )
          .get();
        campusEvents.push(...events);
      })
    );
    // Phew - this gets tricky. We have to parse the iCal to figure out the REAL start date
    const eventsWithMostRecentOccurence = await Promise.all(
      campusEvents.map(async (event) => ({
        ...event,
        mostRecentOccurence: await this.getNextStart(event),
      }))
    );
    const sortedEvents = eventsWithMostRecentOccurence
      .filter(
        ({ mostRecentOccurence }) =>
          mostRecentOccurence && new Date(mostRecentOccurence) > new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.mostRecentOccurence) - new Date(b.mostRecentOccurence)
      );

    if (limit != null) {
      // eslint-disable-next-line prettier/prettier
      return sortedEvents.slice(0, limit);
    }
    // eslint-disable-next-line prettier/prettier
    return sortedEvents;
  }

  async getAllEvents({ limit = 10 } = {}) {
    const allEvents = [];
    // Get the first three persona items.
    await Promise.all(
      this.calIds.map(async (id) => {
        const events = await this.findRecent(id)
          .andFilter(
            `(Schedule/EffectiveEndDate ge datetime'${moment()
              // we need to subtract a day. The EffectiveEndDate is often the morning of the current day.
              // It's okay to get already occured events, because we filter them out later on.
              .subtract(1, 'day')
              .toISOString()}' or Schedule/EffectiveEndDate eq null)`
          )
          .get();
        allEvents.push(...events);
      })
    );
    // Phew - this gets tricky. We have to parse the iCal to figure out the REAL start date
    const eventsWithMostRecentOccurence = await Promise.all(
      allEvents.map(async (event) => ({
        ...event,
        mostRecentOccurence: await this.getNextStart(event),
      }))
    );
    const sortedEvents = eventsWithMostRecentOccurence
      .filter(
        ({ mostRecentOccurence }) =>
          mostRecentOccurence && new Date(mostRecentOccurence) > new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.mostRecentOccurence) - new Date(b.mostRecentOccurence)
      );

    if (limit != null) {
      // eslint-disable-next-line prettier/prettier
      return sortedEvents.slice(0, limit);
    }
    // eslint-disable-next-line prettier/prettier
    return sortedEvents;
  }

  getNextStart = async (event) => {
    // TODO: need to update this to not use depercated lava.
    const lava = `{% schedule id:'${event.schedule.id}' %}
       {
        "nextStartDateTime": "{{ schedule.NextStartDateTime | Date:'yyyy-MM-dd HH:mm' }}"
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
    if (moment(nextStart, 'yyyy-MM-dd HH:mm').isValid()) {
      return moment
        .tz(nextStart, ApollosConfig.ROCK.TIMEZONE)
        .utc()
        .format();
    }

    return null; // Keep a null start date by default for easier value checking
  };

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

    // Convert to UTC time
    if (
      moment(nextStart, 'yyyy-MM-dd HH:mm').isValid() &&
      moment(end, 'yyyy-MM-dd HH:mm').isValid()
    ) {
      return {
        start: moment
          .tz(nextStart, ApollosConfig.ROCK.TIMEZONE)
          .utc()
          .format(),
        end: moment
          .tz(end, ApollosConfig.ROCK.TIMEZONE)
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

// const { schema } = Event;
export { schema, resolver, dataSource };
