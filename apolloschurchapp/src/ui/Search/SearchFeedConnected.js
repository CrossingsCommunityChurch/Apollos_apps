import React from 'react';
import { withProps } from 'recompose';
import { Query } from '@apollo/client/react/components';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { FeedView } from '@apollosproject/ui-kit';

import { SearchInputHeader } from '@apollosproject/ui-connected/src/SearchFeedConnected/SearchInputHeader';
import NoResults from '@apollosproject/ui-connected/src/SearchFeedConnected/NoResults';
import GET_SEARCH_RESULTS from '@apollosproject/ui-connected/src/SearchFeedConnected/getSearchResults';
import SearchCardConnected from './SearchCardConnected';

// this could be refactored into a custom effect hook 💥
const StyledFeedView = withProps(({ hasContent }) => ({
  contentContainerStyle: {
    ...(hasContent ? {} : { height: '100%' }),
  },
}))(FeedView);

const keyExtractor = (item) => item && get(item, 'node.id', null);

const SearchFeedConnected = ({ searchText, onPressItem, ...props }) => (
  <Query
    query={GET_SEARCH_RESULTS}
    variables={{ searchText }}
    fetchPolicy="cache-and-network"
  >
    {({ loading, error, data, refetch }) => (
      <StyledFeedView
        ListItemComponent={SearchCardConnected}
        content={get(data, 'search.edges', [])}
        ListEmptyComponent={() => <NoResults searchText={searchText} />}
        hasContent={get(data, 'search.edges', []).length}
        isLoading={loading}
        error={error}
        refetch={refetch}
        onPressItem={onPressItem}
        keyExtractor={keyExtractor}
        {...props}
      />
    )}
  </Query>
);

SearchFeedConnected.propTypes = {
  searchText: PropTypes.string,
  onPressItem: PropTypes.func,
};

export {
  SearchFeedConnected as default,
  SearchInputHeader,
  NoResults as SearchFeedNoResults,
  GET_SEARCH_RESULTS,
};
