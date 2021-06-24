import React from 'react';
import { View, Platform } from 'react-native';
import { styled, withTheme, Icon, UIText } from '@apollosproject/ui-kit';
import { useNavigation } from '@react-navigation/native';
import HomeSearchButton from '../ui/Search/SearchButton';

const Container = styled(({ theme }) => ({
  width: '96%',
  display: 'flex',
  alignItems: 'center',
  paddingHorizontal: theme.sizing.baseUnit * 2,
  paddingVertical: theme.sizing.baseUnit,
  flexDirection: 'row',
}))(View);

const BrandContainer = styled(() => ({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
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

const BrandIcon = withTheme(() => ({
  name: 'brand-icon',
  size: 25,
}))(Icon);

const Search = () => {
  const navigation = useNavigation();
  return <HomeSearchButton onPress={() => navigation.navigate('Search')} />;
};

const Logo = () => (
  <Container>
    <BrandContainer>
      <BrandIcon />
      <Title>Crossings</Title>
    </BrandContainer>
    <Search />
  </Container>
);

export default Logo;
