import React from 'react';
import { ActionBar, ActionBarItem } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

const Toolbar = () => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <ActionBar title="Test">
        <ActionBarItem
          onPress={() =>
            openUrl('https://crossings.church/locations/okc/serve/')
          }
          icon="HandShake"
          label="Volunteer"
        />
        <ActionBarItem
          onPress={() => openUrl('https://crossings.church/group-finder')}
          icon="groups"
          label="Find a Group"
        />
      </ActionBar>
    )}
  </RockAuthedWebBrowser>
);

export default Toolbar;
