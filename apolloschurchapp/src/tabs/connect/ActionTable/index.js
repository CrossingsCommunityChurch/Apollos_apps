import React from 'react';
import { View } from 'react-native';

import {
  TableView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  Touchable,
  styled,
  PaddedView,
  H4,
  NavigationService,
} from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit,
}))(PaddedView);

const Name = styled({
  flexGrow: 1,
})(View);

const ActionTable = () => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <View>
        <RowHeader>
          <Name>
            <H4>{'Connect with Crossings'}</H4>
          </Name>
        </RowHeader>
        <TableView>
          <Touchable
            onPress={() => openUrl('https://crossings.church/locations/okc/serve/')}
          >
            <Cell>
              <CellText>Find a serving opportunity</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() => openUrl('https://crossings.church/prayer/prayer-request')}
          >
            <Cell>
              <CellText>I need prayer</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
        </TableView>
        <TableView>
          <Touchable
            onPress={() => NavigationService.navigate('TestingControlPanel')}
          >
            <Cell>
              <CellIcon name="settings" />
              <CellText>Open Testing Panel</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
        </TableView>
      </View>
    )}
  </RockAuthedWebBrowser>
);

const StyledActionTable = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 100,
}))(ActionTable);

export default StyledActionTable;
