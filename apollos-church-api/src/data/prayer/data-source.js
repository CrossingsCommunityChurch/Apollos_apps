import { PrayerRequest as corePrayer } from '@apollosproject/data-connector-rock';
import moment from 'moment-timezone';
import ApollosConfig from '@apollosproject/config';

const { ROCK, ROCK_MAPPINGS } = ApollosConfig;

class PrayerRequest extends corePrayer.dataSource {
  addPrayer = async ({ text, isAnonymous }) => {
    const {
      dataSources: { Auth },
    } = this.context;
    const {
      primaryAliasId,
      nickName,
      firstName,
      lastName,
      email,
      primaryCampusId,
    } = await Auth.getCurrentPerson();

    const prayerId = await this.post('/PrayerRequests', {
      FirstName: nickName || firstName,
      LastName: lastName,
      Email: email,
      Text: text,
      Answer: '',
      CategoryId: ROCK_MAPPINGS.GENERAL_PRAYER_CATEGORY_ID,
      CampusId: primaryCampusId || ROCK_MAPPINGS.WEB_CAMPUS_ID,
      IsPublic: !isAnonymous,
      RequestedByPersonAliasId: primaryAliasId,
      CreatedByPersonAliasId: primaryAliasId,
      IsApproved: false,
      IsActive: true,
      AllowComments: false,
      IsUrgent: false,
      EnteredDateTime: moment()
        .tz(ROCK.TIMEZONE)
        .format(),
      ApprovedOnDateTime: moment()
        .tz(ROCK.TIMEZONE)
        .format(),
      ExpirationDate: moment()
        .tz(ROCK.TIMEZONE)
        .add(2, 'weeks')
        .format(),
    });
    return this.getFromId(prayerId);
  };

  byDailyPrayerFeed = async ({ personId, numberDaysSincePrayer = 3 }) => {
    const {
      dataSources: { Auth },
    } = this.context;

    let excludedAliasId;
    let primaryAliasId;
    if (!personId) {
      excludedAliasId = (await Auth.getCurrentPerson()).primaryAliasId;
    } else {
      primaryAliasId = await this.getPersonAliasId({ personId });
    }

    const prayers = await this.request()
      .filter(
        `RequestedByPersonAliasId ${
          primaryAliasId ? `eq ${primaryAliasId}` : `ne ${excludedAliasId}`
        }`
      ) // don't show your own prayers
      .andFilter(`IsActive eq true`) // prayers can be marked as "in-active" in Rock
      .andFilter(`IsApproved eq true`) // prayers can be moderated in Rock
      .andFilter('IsPublic eq true') // prayers can be set to private in Rock
      .andFilter(
        // prayers that aren't expired
        `ExpirationDate gt datetime'${moment
          .tz(ROCK.TIMEZONE)
          .format()}' or ExpirationDate eq null`
      )
      .andFilter(
        // prayers that were entered less then x days ago
        `EnteredDateTime gt datetime'${moment
          .tz(ROCK.TIMEZONE)
          .subtract(numberDaysSincePrayer, 'day')
          .format()}' or PrayerCount eq null` // include prayers that haven't prayed yet and within x number of days old
      )
      .andFilter(`Answer eq null or Answer eq ''`) // prayers that aren't answered
      .sort([
        { field: 'PrayerCount', direction: 'asc' }, // # of times prayed, ascending
        { field: 'EnteredDateTime', direction: 'asc' }, // oldest prayer first
      ])
      .get();
    return prayers;
  };

  byPersonalPrayerFeed = async ({ personId, numberDaysSincePrayer = 3 }) => {
    const {
      dataSources: { Auth },
    } = this.context;

    let excludedAliasId;
    let primaryAliasId;
    if (!personId) {
      excludedAliasId = (await Auth.getCurrentPerson()).primaryAliasId;
    } else {
      primaryAliasId = await this.getPersonAliasId({ personId });
    }

    const prayers = await this.request()
      .filter(
        `RequestedByPersonAliasId ${
          primaryAliasId ? `eq ${primaryAliasId}` : `ne ${excludedAliasId}`
        }`
      ) // don't show your own prayers
      // .andFilter(`IsActive eq true`) // prayers can be marked as "in-active" in Rock
      // .andFilter(`IsApproved eq true`) // prayers can be moderated in Rock
      // .andFilter('IsPublic eq true') // prayers can be set to private in Rock
      .andFilter(`Answer eq null or Answer eq ''`) // prayers that aren't answered
      .sort([
        { field: 'PrayerCount', direction: 'asc' }, // # of times prayed, ascending
        { field: 'EnteredDateTime', direction: 'asc' }, // oldest prayer first
      ])
      .get();
    return prayers;
  };
}

export default PrayerRequest;
