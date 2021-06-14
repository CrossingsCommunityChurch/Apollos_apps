import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';
import gql from 'graphql-tag';
import fragmentTypes from './src/client/fragmentTypes.json';

// Create a map all the interfaces each type implements.
// If UniversalContentItem implements Node, Card, and ContentNode,
// our typemap would be { UniversalContentItem: ['Node', 'Card', 'ContentNode'] }
const TYPEMAP = fragmentTypes.__schema.types.reduce((acc, curr) => {
  const { name } = curr;
  const types = Object.fromEntries(
    curr.possibleTypes.map((type) => [type.name, name])
  );
  Object.keys(types).forEach((key) => {
    acc[key] = acc[key] ? [...acc[key], types[key]] : [types[key]];
  });
  return acc;
}, {});

ApollosConfig.loadJs({
  SCHEMA_VERSION: '2021.04.15',
  FRAGMENTS: {
    ...FRAGMENTS,
    LIVE_STREAM_LIST_FEATURE_FRAGMENT: gql`
      fragment LiveStreamListFeatureFragment on LiveStreamListFeature {
        id
        title
        subtitle
        liveStreams {
          id
          eventStartTime
          eventEndTime
          isLive
          webViewUrl
          action
          media {
            sources {
              uri
            }
          }
          relatedNode {
            id
            ... on LiveContentItem {
              title
              coverImage {
                sources {
                  uri
                }
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
        relatedNode {
          id
          ... on ContentNode {
            title
            coverImage {
              sources {
                uri
              }
            }
          }
        }
      }
    `,
  },
  TYPEMAP,
});
