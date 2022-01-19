import ApollosConfig from '@apollosproject/config';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import moment from 'moment-timezone';

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

  getTimeFormat = (time) => {
    if (moment(time).isValid()) {
      return moment
        .tz(time, ApollosConfig.ROCK.TIMEZONE)
        .utc()
        .format();
    }
    return null;
  };

  async getGroups() {
    const groups = await this.getGroupsData();
    return Promise.all(
      groups.map(async (group) => ({
        title: group.name,
        htmlContent: group.details,
        subtitle: this.getTimeFormat(group.nextOC), // we add the `mostRecentOccurence` field in the `getUpcomingEventsByCampus` method.
        coverImage: { uri: group.imageAsset },
        location: group.locationName,
        start: this.getTimeFormat(group.nextOC),
        end: 'fake end date',
        relatedNode: { ...group, __type: 'Event' },
      }))
    );
  }

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
