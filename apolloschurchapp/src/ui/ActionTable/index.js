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
            onPress={() => openUrl('https://crossings.church/contact-us')}
          >
            <Cell>
              <CellText>Contact Us</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />

          <Touchable
            onPress={() => openUrl('https://crossings.church/locations')}
          >
            <Cell>
              <CellText>Locations & Times</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
        </TableView>

        <TableView>
          <Touchable
            onPress={() =>
              openUrl(
                'https://docs.google.com/forms/d/e/1FAIpQLScWBlamg3lpBknEIWlWd6nrz1KbYMrkSis3Mdo2dWlvATHxKg/viewform?usp=sf_link'
              )
            }
          >
            <Cell>
              <CellText>Report Bug</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() =>
              openUrl(
                'https://docs.google.com/forms/d/e/1FAIpQLSf05zyDAZLj717LGP0kwle4VPH1hALgDPtGoxrFgpgGjuTK7A/viewform?usp=sf_link'
              )
            }
          >
            <Cell>
              <CellText>Request Feature On App</CellText>
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
