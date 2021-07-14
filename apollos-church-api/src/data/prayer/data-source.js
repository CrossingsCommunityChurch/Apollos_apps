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
}

export default PrayerRequest;
