import { Person as personData } from '@apollosproject/data-connector-postgres';

class Person extends personData.dataSource {
  async getCurrentUserCampusId() {
    const { Campus, Auth } = this.context.dataSources;

    try {
      // If we have a user
      const { id } = await Auth.getCurrentPerson();
      const { guid: campusGuid, id: campusId } = await Campus.getForPerson({
        id,
      });
      // The campus id is the current user's campus
      return { campusId, campusGuid };
    } catch (e) {
      console.log('No Campus found');
      // No campus or no current user.
    }
    return { campusId: null, campusGuid: null };
  }
}

export default Person;
