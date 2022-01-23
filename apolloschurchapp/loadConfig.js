import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';
import gql from 'graphql-tag';
import fragmentTypes from './src/client/fragmentTypes.json';

// Create a map all the interfaces each type implements.
// If UniversalContentItem implements Node, Card, and ContentNode,
// our typemap would be { UniversalContentItem: ['Node', 'Card', 'ContentNode'] }
//
// Used with Apollo Client cache resolver as well as internal Apollos UI functions
const TYPEMAP = {};
fragmentTypes.__schema.types.forEach((supertype) => {
  if (supertype.possibleTypes) {
    TYPEMAP[supertype.name] = [
      ...supertype.possibleTypes.map((subtype) => subtype.name),
    ];
  }
});

ApollosConfig.loadJs({
  SCHEMA_VERSION: '2022.01.23',
  FRAGMENTS: {
    ...FRAGMENTS,
    LIVE_STREAM_LIST_FEATURE_FRAGMENT: gql`
      fragment LiveStreamListFeatureFragment on LiveStreamListFeature {
        id
        title
        subtitle
        liveStreams {
          id
          eventEndTime
          eventStartTime
          isLive
          name
          webViewUrl
          action
          contentItem {
            coverImage {
              sources {
                uri
              }
            }
            videos {
              sources {
                uri
              }
            }
          }
        }
      }
    `,
    LIVE_NODE_FRAGMENT: gql`
      fragment LiveNodeFragment on LiveNode {
        liveStream {
          id
          isLive
          media {
            sources {
              uri
            }
          }
        }
      }
    `,
    LIVE_STREAM_FRAGMENT: gql`
      fragment LiveStreamFragment on LiveStream {
        id
        eventStartTime
        eventEndTime
        isLive
        media {
          sources {
            uri
          }
        }
      }
    `,
    EVENT_FRAGMENT: gql`
      fragment EventFragment on Event {
        id
        htmlContent
        title
        start
        end
        location
        coverImage {
          sources {
            uri
          }
        }
      }
    `,
  },
  TYPEMAP,
});
