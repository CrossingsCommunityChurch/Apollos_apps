import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardImage,
  CardLabel,
  withTheme,
  withIsLoading,
  ImageSourceType,
  BackgroundImageBlur,
  Icon,
} from '@apollosproject/ui-kit';

import ContentTitles from './ContentTitles';

const CoverImage = withTheme(
  () => ({
    minAspectRatio: 1,
    maxAspectRatio: 1.78,
    maintainAspectRatio: true,
  }),
  'ui-kit.DefaultCard.Image'
)(CardImage);

const LiveIcon = withTheme(({ theme }) => ({
  name: 'live-dot',
  size: theme.helpers.rem(0.4375),
  style: { marginRight: theme.sizing.baseUnit * 0.5 },
}))(Icon);

const renderLabel = (isLoading, LabelComponent, labelText, summary, isLive) => {
  let ComponentToRender = null;

  if (LabelComponent) {
    ComponentToRender = LabelComponent;

    // this always shows a loading state for labels
  } else if (labelText || isLoading || isLive) {
    ComponentToRender = (
      <CardLabel
        hasSummary={summary}
        title={labelText || (isLive ? 'Live' : null)}
        type={'secondary'}
        icon={isLive ? 'live-dot' : undefined}
        IconComponent={isLive ? LiveIcon : undefined}
      />
    );
  }

  return ComponentToRender;
};

const DefaultCard = withIsLoading(
  ({
    featured,
    coverImage,
    title,
    tags,
    isLiked,
    isLoading,
    LabelComponent,
    labelText,
    summary,
    isLive,
    style,
  }) => (
    <Card isLoading={isLoading} style={style}>
      <BackgroundImageBlur source={coverImage} />
      <CoverImage source={coverImage} />
      <ContentTitles
        featured={featured}
        title={title}
        tags={tags}
        summary={summary}
        isLiked={isLiked}
        isLoading={isLoading}
        label={renderLabel(
          isLoading,
          LabelComponent,
          labelText,
          summary,
          isLive
        )}
      />
    </Card>
  )
);

DefaultCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  featured: PropTypes.bool,
  title: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  tags: PropTypes.array,
  isLiked: PropTypes.bool,
  isLive: PropTypes.bool,
  LabelComponent: PropTypes.element,
  labelText: PropTypes.string,
  summary: PropTypes.string,
  style: PropTypes.shape({}),
};

DefaultCard.displayName = 'DefaultCard';

export default DefaultCard;
