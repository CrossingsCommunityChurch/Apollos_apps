import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { View } from 'react-native';

import {
  styled,
  FlexedView,
  H4,
  withTheme,
  withIsLoading,
  ImageSourceType,
  CardImage,
} from '@apollosproject/ui-kit';

// import ActionListImage from '../ui/ActionListCard/ActionListImage';
// import { StyledH6 } from '../ui/ActionListCard/ActionListItem';

const Card = styled(({ theme }) => ({
  paddingHorizontal: 16,
  paddingVertical: 16,
  backgroundColor: theme.colors.background.paper,
  borderColor: theme.colors.shadows.default,
  borderBottomWidth: 0.5,
  flexDirection: 'row',
  justifyContent: 'flex-start',
}))(View);

const CoverImage = withTheme(
  () => ({
    minAspectRatio: 1,
    maxAspectRatio: 1.78,
    maintainAspectRatio: true,
  }),
  'ui-kit.DefaultCard.Image'
)(CardImage);

const EventCard = ({ image, name }) => (
  <Card>
    <CoverImage source={image} />
    <FlexedView>
      <H4 numberOfLines={2} ellipsizeMode="tail">
        {{ name }}
      </H4>
      {/* <StyledH6 numberOfLines={1}>
        {start &&
          `${moment(start).format('dddd, h:mmA')} — ${moment(end).format(
            'h:mmA'
          )}`}
      </StyledH6> */}
      {/* <StyledH6 numberOfLines={1}>{location}</StyledH6> */}
    </FlexedView>
  </Card>
);

EventCard.propTypes = {
  image: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  // start: PropTypes.string,
  // end: PropTypes.string,
  name: PropTypes.string,
  // location: PropTypes.string,
  // __typename: PropTypes.string,
  /* This prop type is listed because it is needed. However, the prop is passed into context
   * automatically by `withIsLoading` so the prop variable is never used. */
  isLoading: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
};

EventCard.displayName = 'EventCard';

const EventCardWithTheme = withTheme(({ theme }) => ({
  colors: { background: { accent: theme.colors.white } },
}))(EventCard);

export default withIsLoading(EventCardWithTheme);
