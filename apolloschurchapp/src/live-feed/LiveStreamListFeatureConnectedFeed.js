import React from 'react';
import { Query } from '@apollo/client/react/components';
import HorizontalCardListFeature from '@apollosproject/ui-connected';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import GET_LIVESTREAM_LIST_FEATURE from './getLiveStreamListFeature';

const LiveStreamListFeatureConnected = ({
  Component,
  featureId,
  isLoading,
  refetchRef,
  ...props
}) => (
  <Query
    query={GET_LIVESTREAM_LIST_FEATURE}
    variables={{ featureId }}
    fetchpolicy="cache-and-network"
  >
    {({ data, loading, refetch }) => {
      if (featureId && refetch && refetchRef)
        refetchRef({ refetch, id: featureId });
      return (
        <Component
          {...get(data, 'node')}
          cards={get(data, 'node.cards', []).map(({ actionIcon, ...card }) => ({
            ...card,
            ...(actionIcon != null ? { actionIcon: card.actionIcon } : {}), // temp hack because ContentCard doesn't handle null action icon well
            coverImage: get(card, 'coverImage.sources', undefined),
            __typename: card.relatedNode.__typename,
            id: card.relatedNode.id,
          }))}
          {...props}
          isLoading={loading || isLoading}
        />
      );
    }}
  </Query>
);

LiveStreamListFeatureConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  refetchRef: PropTypes.func,
};

LiveStreamListFeatureConnected.defaultProps = {
  Component: HorizontalCardListFeature,
};

export default LiveStreamListFeatureConnected;
