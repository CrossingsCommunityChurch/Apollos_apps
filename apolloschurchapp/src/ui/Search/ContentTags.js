/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import styled from '@apollosproject/ui-kit/src/styled';

const Wrapper = styled(({ flexed }) => ({
  flex: flexed ? 1 : null,
  flexDirection: 'row',
  borderRadius: 5,
  marginBottom: -12,
}))(View);

const ItemWrapper = styled(({ theme }) => ({
  backgroundColor: theme.colors.tertiary,
  flexDirection: 'row',
  paddingTop: 3,
  paddingBottom: 3,
  paddingLeft: 7,
  paddingRight: 7,
  marginRight: 5,
  borderRadius: 9,
  bottom: 28,
}))(View);

const Item = styled(({ theme }) => ({
  color: theme.colors.text.primary,
  padding: 1,
  fontWeight: '500',
}))(Text);

const ContentTags = ({ tags }) => (
  <Wrapper>
    {tags?.map((tag, index) => {
      const items = [];
      if (tag !== '' && index < 2) {
        items.push(
          <ItemWrapper key={index}>
            <Item key={index}>{tag}</Item>
          </ItemWrapper>
        );
      }
      return items;
    })}
  </Wrapper>
);

ContentTags.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  tags: PropTypes.array,
};

ContentTags.displayName = 'ContentTags';

export default ContentTags;
