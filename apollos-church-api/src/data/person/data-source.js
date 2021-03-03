import { Person as personData } from '@apollosproject/data-connector-rock';
import { getIdentifierType } from '../utils';

class Person extends personData.dataSource {
  async getCurrentUserCampusId() {
    const { Campus, Auth } = this.context.dataSources;

    try {
      // If we have a user
      const { id } = await Auth.getCurrentPerson();

      const { guid: campusGuid, id: campusId } = await Campus.getForPerson({
        personId: id,
      });
      // The campus id is the current user's campus
      return { campusId, campusGuid };
    } catch (e) {
      // No campus or no current user.
    }
    return { campusId: null, campusGuid: null };
  }

  getFromAliasId = async (aliasId) => {
    // Fetch the PersonAlias, selecting only the PersonId.
    const personAlias = await this.request('/PersonAlias')
      .filter(getIdentifierType(aliasId).query)
      .select('PersonId')
      .first();

    // If we have a personAlias, return him.
    if (personAlias) {
      return this.getFromId(personAlias.personId);
    }
    // Otherwise, return null.
    return null;
  };
}

export default Person;
