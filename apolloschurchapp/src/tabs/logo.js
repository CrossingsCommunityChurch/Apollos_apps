import React from 'react';
import { View, Platform } from 'react-native';
import { styled, withTheme, Icon, UIText } from '@apollosproject/ui-kit';
import { useNavigation } from '@react-navigation/native';
import { SearchButton } from '../ui/Search';

const Container = styled(({ theme }) => ({
  width: '96%',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: theme.sizing.baseUnit,
  paddingVertical: theme.sizing.baseUnit,
  flexDirection: 'row',
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

const BrandIcon = withTheme(({ theme }) => ({
  name: 'BrandIcon',
  size: 25,
}))(Icon);

const Logo = () => {
  const Navigation = () => useNavigation();
  return (
    <Container>
      <BrandIcon />
      <Title>Crossings</Title>
      <SearchButton onPress={() => Navigation.navigate('Search')} />
    </Container>
  );
};

export default Logo;
