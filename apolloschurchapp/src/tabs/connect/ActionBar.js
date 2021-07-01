import React from 'react';
import { ActionBar, ActionBarItem } from '@apollosproject/ui-kit';
import { useNavigation } from '@react-navigation/native';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

const Toolbar = () => {
  const navigation = useNavigation();
  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <ActionBar>
          <ActionBarItem
            onPress={() => navigation.navigate('Passes')}
            icon="check"
            label="Check-in"
          />
          <ActionBarItem
            onPress={() => openUrl('https://crossings.church/give')}
            icon="Give"
            label="Give"
          />
        </ActionBar>
      )}
    </RockAuthedWebBrowser>
  );
};

export default Toolbar;
