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
          label="Serve"
        />
        <ActionBarItem
          onPress={() => openUrl('https://crossings.church/group-finder')}
          icon="groups"
          label="Find Groups"
        />
      </ActionBar>
    )}
  </RockAuthedWebBrowser>
);

export default Toolbar;
