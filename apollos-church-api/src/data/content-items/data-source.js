import { ContentItem } from '@apollosproject/data-connector-rock';
import ApollosConfig from '@apollosproject/config';

const { ROCK_MAPPINGS, ROCK_CONSTANTS } = ApollosConfig;
const imageURL = 'images.crossings.church/fit-in/700x700';

class dataSource extends ContentItem.dataSource {
  expanded = true;

  attributeIsImage = ({ key, attributeValues, attributes }) =>
    attributes[key].fieldTypeId === ROCK_CONSTANTS.IMAGE ||
    (key.toLowerCase().includes('image') &&
      typeof attributeValues[key].value === 'string' &&
      (attributeValues[key].value.startsWith('http') ||
        attributeValues[key].valueFormatted.startsWith('http'))); // looks like an image url

  getImages = ({ attributeValues, attributes }) => {
    const imageKeys = Object.keys(attributes).filter((key) =>
      this.attributeIsImage({
        key,
        attributeValues,
        attributes,
      })
    );
    return imageKeys.map((key) => ({
      __typename: 'ImageMedia',
      key,
      name: attributes[key].name,
      sources: attributeValues[key].value
        ? [
            {
              uri: attributeValues[key].valueFormatted.replace(
                'cccrockweb.s3.amazonaws.com',
                imageURL
              ),
            },
          ]
        : [],
    }));
  };

  forSearch = () =>
    this.request()
      .filterOneOf(
        ROCK_MAPPINGS.SEARCH_CONTENT_CHANNEL_IDS.map(
          (id) => `ContentChannelId eq ${id}`
        )
      )
      .cache({ ttl: 60 })
      .andFilter(this.LIVE_CONTENT());

  forSearchDateAndActive = async () =>
    this.request()
      .filterOneOf(
        ROCK_MAPPINGS.SEARCH_CONTENT_CHANNEL_IDS.map(
          (id) => `ContentChannelId eq ${id}`
        )
      )
      .cache({ ttl: 60 })
      .andFilter(this.LIVE_CONTENT());

  getLiveFeed() {
    return this.byContentChannelId(
      ROCK_MAPPINGS.LIVESTREAM_CONTENT_CHANNEL_ID
    ).andFilter(this.LIVE_CONTENT());
  }

  // having this as a method instead of a property will cause issues in the
  // data-connector-church-online package.
  getActiveLiveStreamContent = async () => {
    const { LiveStream } = this.context.dataSources;
    const { isLive } = await LiveStream.getLiveStream();
    // if there is no live stream, then there is no live content. Easy enough!
    if (!isLive) return [];

    const currentLiveStreams = await this.getLiveFeed().first();
    return [currentLiveStreams];
  };
}
const { resolver, schema } = ContentItem;

export { dataSource, resolver, schema };
