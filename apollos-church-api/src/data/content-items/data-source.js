import { ContentItem } from '@apollosproject/data-connector-postgres';
import { get } from 'lodash';
import ApollosConfig from '@apollosproject/config';
// const imageURL = 'images.crossings.church/fit-in/700x700';

class dataSource extends ContentItem.dataSource {
  modelName = 'contentItem';

  getLiveFeed(...args) {
    return this.getFromCategoryIds(
      ApollosConfig?.CONTENT?.LIVESTREAM_CONTENT_CHANNEL_IDS,
      args
    );
  }

  getWebviewURL = ({ attributeValues }) =>
    get(attributeValues, 'webviewUrl.value', 'default');

  getMeidaURL = ({ attributeValues }) => {
    const link = get(attributeValues, 'mediaHlsLink.value', '');
    return link;
  };

  // having this as a method instead of a property will cause issues in the
  // data-connector-church-online package.
  getActiveLiveStreamContent = async () => {
    const { LiveStream } = this.context.dataSources;
    const { isLive } = await LiveStream.getLiveStream();
    // if there is no live stream, then there is no live content. Easy enough!
    // if (!isLive) return [];

    const currentLiveStreams = await this.getLiveFeed({ limit: 10 });
    return currentLiveStreams;
  };
}

export { dataSource };
