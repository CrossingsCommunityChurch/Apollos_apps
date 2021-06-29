import React from 'react';
import { View, Platform } from 'react-native';
import { styled, withTheme, Icon, UIText } from '@apollosproject/ui-kit';

const Container = styled(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
}))(View);

const Title = styled(({ theme }) => ({
  textTransform: 'uppercase',
  fontWeight: Platform.select({
    ios: '800',
    android: 'bold',
  }),
  marginLeft: 5,
  marginRight: 7,
  fontSize: 16,
  color: theme.colors.text.primary,
  ...Platform.select({
    ios: {
      lineHeight: 0,
    },
  }),
}))(UIText);

const BrandIcon = withTheme(() => ({
  name: 'brand-icon',
  size: 25,
}))(Icon);

const Logo = () => (
  <Container>
    <BrandIcon />
    <Title>Crossings</Title>
  </Container>
);

export default Logo;
