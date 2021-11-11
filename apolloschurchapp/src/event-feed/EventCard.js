import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get } from 'lodash';

import {
  styled,
  FlexedView,
  H3,
  H4,
  withTheme,
  withIsLoading,
  ImageSourceType,
  BackgroundImageBlur,
  Card,
  CardImage,
} from '@apollosproject/ui-kit';

const DetailedView = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  paddingVertical: theme.sizing.baseUnit * 1.25,
}))(FlexedView);

const CoverImage = withTheme(() => ({}), 'ui-kit.DefaultCard.Image')(CardImage);

const EventCard = ({
  __typename,
  title,
  coverImage,
  htmlContent,
  start,
  end,
  location,
}) => (
  <Card>
    <BackgroundImageBlur source={get(coverImage, undefined)} />
    <CoverImage source={get(coverImage, 'sources', undefined)} />
    <DetailedView>
      <H3 numberOfLines={2} ellipsizeMode="tail">
        {title}
      </H3>
      <H4>{`${moment(start).format('MMM. Do, YYYY @ hh:mm A')}`}</H4>
    </DetailedView>
  </Card>
);

EventCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  start: PropTypes.string,
  end: PropTypes.string,
  htmlContent: PropTypes.string,
  title: PropTypes.string,
  location: PropTypes.string,
  __typename: PropTypes.string,
  /* This prop type is listed because it is needed. However, the prop is passed into context
   * automatically by `withIsLoading` so the prop variable is never used. */
  isLoading: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
};

EventCard.displayName = 'EventCard';

const EventCardWithTheme = withTheme(({ theme }) => ({
  colors: { background: { accent: theme.colors.white } },
}))(EventCard);

export default withIsLoading(EventCardWithTheme);
