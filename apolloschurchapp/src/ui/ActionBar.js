import React from 'react';
import { ActionBar, ActionBarItem } from '@apollosproject/ui-kit';
import {
  RockAuthedWebBrowser,
  GET_USER_PROFILE,
} from '@apollosproject/ui-connected';
import { Query } from '@apollo/client/react/components';
import CurrentCampus from './CurrentCampus/CurrentCampus';
import { get } from 'lodash';

const Toolbar = () => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <>
        <ActionBar title="Test">
          <ActionBarItem
            onPress={() =>
              openUrl('https://crossings.church/locations/okc/serve/')
            }
            icon="hand-shake"
            label="Volunteer"
          />
          <ActionBarItem
            onPress={() => openUrl('https://crossings.church/group-finder')}
            icon="find-group"
            label="Find A Group"
          />
        </ActionBar>
        <Query query={GET_USER_PROFILE}>
          {({ data: campusData, loading: userCampusLoading }) => {
            const userCampus = get(campusData, 'currentUser.profile.campus');
            return userCampus ? (
              <CurrentCampus
                cardButtonText={'Campus Details'}
                cardTitle={userCampus.name}
                coverImage={userCampus.image}
                headerActionText={'Change'}
                itemId={userCampus.id}
                sectionTitle={'Your Campus'}
                isLoading={userCampusLoading}
              />
            ) : (
              <CurrentCampus
                cardButtonText={'Select a Campus'}
                cardTitle={'No location'}
                headerActionText={'Select'}
                sectionTitle={'Your Campus'}
                isLoading={userCampusLoading}
              />
            );
          }}
        </Query>
      </>
    )}
  </RockAuthedWebBrowser>
);

export default Toolbar;
