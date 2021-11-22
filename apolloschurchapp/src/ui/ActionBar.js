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
          icon="hand-shake"
          label="Volunteer"
        />
        <ActionBarItem
          onPress={() => openUrl('https://crossings.church/mobile/give')}
          icon="hands"
          label="Give"
        />
        <ActionBarItem
          onPress={() => openUrl('https://crossings.church/group-finder')}
          icon="find-group"
          label="Find A Group"
        />
      </ActionBar>
    )}
  </RockAuthedWebBrowser>
);

export default Toolbar;
