import ApollosConfig from '@apollosproject/config';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import moment from 'moment-timezone';
import {
  createGlobalId,
  parseGlobalId,
  generateAppLink,
} from '@apollosproject/server-core';

const { ROCK } = ApollosConfig;

export default class Group extends RockApolloDataSource {
  resource = 'Groups';

  expanded = true;

  getGroupsData = async () => {
    this.baseURL = ROCK.API_URL || `${ROCK.URL}`;
    const response = await this.get(
      'Webhooks/Lava.ashx/crossings/api/appgroups'
    );
    return response;
  };

  getShareUrl = async (content) => {
    const __typename = 'Group';
    return generateAppLink('universal', 'content', {
      contentID: createGlobalId(content.id, __typename),
    });
  };

  getTimeFormat = (time) => {
    if (moment(time).isValid()) {
      return moment(time)
        .tz(ApollosConfig.ROCK.TIMEZONE)
        .format('h:mm a ddd, MMM D');
    }
    return null;
  };

  // Possibly leverage campus here to show groups by campus?
  async getGroups({ limit = null, campusId = null } = {}) {
    const groups = await this.getGroupsData();
    const sortedGroups = groups
      .filter(({ nextOc }) => nextOc && new Date(nextOc) > new Date())
      .filter(({ campus }) => campus && campus == campusId)
      .sort((a, b) => new Date(a.nextOc) - new Date(b.nextOc));
    if (limit != null) {
      const groups2 = sortedGroups.slice(0, limit);
      return Promise.all(
        groups2.map(async (group, i) => ({
          id: `${group.id}${i}`,
          title: group.name,
          htmlContent: group.details,
          subtitle: this.getTimeFormat(group.nextOc), // we add the `mostRecentOccurence` field in the `getUpcomingEventsByCampus` method.
          image: {
            __typename: 'ImageMedia',
            key: 'assetImage',
            name: null,
            sources: [{ uri: group.imageAsset }],
          },
          location: group.locationName,
          start: this.getTimeFormat(group.nextOc),
          end: 'fake end date',
          relatedNode: { ...group, __type: 'Group' },
          action: 'READ_CONTENT',
          dateFilter: group.nextOc,
        }))
      );
    }
    return Promise.all(
      sortedGroups.map(async (group, i) => ({
        id: `${group.id}${i}`,
        title: group.name,
        htmlContent: group.details,
        subtitle: this.getTimeFormat(group.nextOc), // we add the `mostRecentOccurence` field in the `getUpcomingEventsByCampus` method.
        coverImage: {
          __typename: 'ImageMedia',
          key: 'assetImage',
          name: null,
          sources: [{ uri: group.imageAsset }],
        },
        location: group.locationName,
        start: this.getTimeFormat(group.nextOc),
        end: 'fake end date',
        relatedNode: { ...group, __type: 'Group' },
        action: 'READ_CONTENT',
      }))
    );
  }

  getImage = async (groupId) => {
    const groups = await this.getGroupsData();
    const filteredGroups = groups.filter(({ id }) => id === groupId);
    if (filteredGroups.length > 0) {
      return {
        __typename: 'ImageMedia',
        key: 'assetImage',
        name: null,
        sources: [{ uri: filteredGroups[0].imageAsset }],
      };
    }
    return null;
  };

  getLocation = async (groupId) => {
    const groups = await this.getGroupsData();
    const filteredGroups = groups.filter(({ id }) => id === groupId);
    if (filteredGroups.length > 0) {
      const group = filteredGroups[0];
      console.log('SELECTED GROUP IS ......................', group);
      return group.locationName;
    }
    return null;
  };

  getTime = async (groupId) => {
    const groups = await this.getGroupsData();
    const filteredGroups = groups.filter(({ id }) => id === groupId);
    if (filteredGroups.length > 0) {
      const group = filteredGroups[0];
      return this.getDateTime(group.scheduleId);
    }
    return null;
  };

  getFromId = (id) =>
    this.request()
      .filter(`Id eq ${id}`)
      .expand('Schedule')
      .first();

  getByCampus = (id) =>
    this.findRecent()
      .cache({ ttl: 60 })
      .filter(`CampusId eq ${id}`)
      .get();

  getDateTime = async (schedule) => {
    /** Named schedules will include a duration, check in start offset and check in end offset
     *  (in minutes) and there is a parser using Lava that gives us all of these values
     */
    const lava = `{% schedule id:'${schedule}' %}
        {% assign duration = schedule.DurationInMinutes %}
            {
              "nextStartDateTime": "{{ schedule.NextStartDateTime | Date:'yyyy-MM-dd HH:mm' }}",
                "endTime": "{{ schedule.NextStartDateTime | DateAdd:duration,'m' | Date:'yyy-MM-dd HH:mm' }}"
            }
        {% endschedule %}`;

    this.baseURL = ROCK.API_URL || `${ROCK.URL}/api`;
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

  //   findRecent = () => {
  //     let request = this.request();
  //     if (!get(ApollosConfig, 'ROCK.USE_PLUGIN', false)) {
  //       console.warn(
  //         'Fetching public campuses is not possible without the Apollos Plugin\n\nReturning all campuses.'
  //       );
  //     } else {
  //       request = this.request(
  //         `Apollos/GetEventItemOccurencesByCalendarId?id=${1}`
  //       );
  //     }
  //     return request
  //       .cache({ ttl: 60 })
  //       .expand('Schedule')
  //       .orderBy('Schedule/EffectiveStartDate')
  //       .filter('Schedule/EffectiveStartDate ne null');
  //   };

  //   getName = async ({ eventItemId }) => {
  //     const event = await this.request('EventItems')
  //       .cache({ ttl: 60 })
  //       .find(eventItemId)
  //       .get();
  //     return event.name;
  //   };

  //   getDescription = async ({ eventItemId }) => {
  //     const event = await this.request('EventItems')
  //       .cache({ ttl: 60 })
  //       .find(eventItemId)
  //       .get();
  //     return event.description;
  //   };

  //   getImage = async ({ eventItemId }) => {
  //     const event = await this.request('EventItems')
  //       .cache({ ttl: 60 })
  //       .find(eventItemId)
  //       .get();
  //     const imageUrl = await this.context.dataSources.BinaryFiles.findOrReturnImageUrl(
  //       { id: event.photoId }
  //     );
  //     if (imageUrl) {
  //       return {
  //         sources: [{ uri: imageUrl }],
  //       };
  //     }
  //     return null;
  //   };

  //   getDateTime = (schedule) => {
  //     const iCal = schedule.iCalendarContent;
  //     const dateTimes = iCal.match(/DTEND:(\w+).*DTSTART:(\w+)/s);
  //     return {
  //       start: moment
  //         .tz(dateTimes[2], ApollosConfig.ROCK.TIMEZONE)
  //         .utc()
  //         .format(),
  //       end: moment
  //         .tz(dateTimes[1], ApollosConfig.ROCK.TIMEZONE)
  //         .utc()
  //         .format(),
  //     };
  //   };
}
