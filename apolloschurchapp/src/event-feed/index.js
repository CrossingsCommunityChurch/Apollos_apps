import React, { PureComponent } from 'react';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'prop-types';

import { BackgroundView, FeedView, styled } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import NoResults from '@apollosproject/ui-connected/src/SearchFeedConnected/NoResults';

import { SafeAreaView } from 'react-native-safe-area-context';
import EventCard from './EventCard';

import GET_ALL_EVENTS from './getEvents';

/**
 * This is where the component description lives
 * A FeedView wrapped in a query to pull content data.
 */
const BackgroundContainer = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
  paddingTop: theme.sizing.baseUnit,
}))(BackgroundView);
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
          <BackgroundContainer>
            <SafeAreaView edges={['right', 'left']}>
              <Query query={GET_ALL_EVENTS} fetchPolicy="cache-and-network">
                {({ loading, error, data, refetch }) => (
                  <FeedView
                    ListItemComponent={EventCard}
                    content={data.allEvents}
                    ListEmptyComponent={() => <NoResults />}
                    isLoading={loading}
                    error={error}
                    refetch={refetch}
                    onPressItem={(event) =>
                      openUrl(
                        `Crossings://crossings/app-link/nav/ContentSingle?itemId=${
                          event.id
                        }&transitionKey=2`,
                        {},
                        { useRockToken: true }
                      )
                    }
                  />
                )}
              </Query>
            </SafeAreaView>
          </BackgroundContainer>
        )}
      </RockAuthedWebBrowser>
    );
  }
}

export default ContentFeed;
