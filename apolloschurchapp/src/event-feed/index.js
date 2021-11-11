import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { BackgroundView, FeedView } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import NoResults from '@apollosproject/ui-connected/src/SearchFeedConnected/NoResults';

import EventCard from './EventCard';

import GET_EVENTS from './getEvents';
/**
 * This is where the component description lives
 * A FeedView wrapped in a query to pull content data.
 */
class ContentFeed extends PureComponent {
  /** Function for React Navigation to set information in the header. */
  static navigationOptions = () => ({
    title: 'Upcoming Events',
  });

  static propTypes = {
    /** Functions passed down from React Navigation to use in navigating to/from
     * items in the feed.
     */
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  render() {
    return (
      <RockAuthedWebBrowser>
        {(openUrl) => (
          <BackgroundView>
            <Query query={GET_EVENTS} fetchPolicy="cache-and-network">
              {({ loading, error, data, refetch }) => (
                <FeedView
                  ListItemComponent={EventCard}
                  content={get(data, 'currentUser.profile.campus.events', [])}
                  ListEmptyComponent={() => <NoResults />}
                  isLoading={loading}
                  error={error}
                  refetch={refetch}
                  onPressItem={() =>
                    openUrl(
                      'https://crossings.church',
                      {},
                      { useRockToken: true }
                    )
                  }
                />
              )}
            </Query>
          </BackgroundView>
        )}
      </RockAuthedWebBrowser>
    );
  }
}

export default ContentFeed;
